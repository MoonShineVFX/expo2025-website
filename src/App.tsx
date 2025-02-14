import "./App.css";
import { useSearchParams } from "react-router-dom";
import Wave02 from "./components/Wave02";
import { useEffect, useState } from "react";
import { fetchSheetData } from "./utils/fetchSheetData";
import ChartLayers from "./components/ChartLayers";
import Wave05 from "./components/Wave05";
import Wave06 from "./components/Wave06";
import { motion, AnimatePresence } from "framer-motion";

interface ParsedSheetData {
  number: number;
  formattedNumber: string;
  category: string;
  area: string;
  name_jp: string;
  name_en: string;
  name_zh: string;
  desc_jp: string;
  desc_en: string;
  desc_zh: string;
  videoname: string;
  videolink: string;
  folder: string;
  opentime: string;
  etc: string;
}

interface DecryptResponse {
  v: string;
  p: string;
}

function App() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ParsedSheetData[]>([]);
  const [currentStyle, setCurrentStyle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [language, setLanguage] = useState<"jp" | "en" | "zh" | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const languageArray = {
    jp: {
      title: "この美しい島を\n共有する機会をくださり、\n感謝します。",
    },
    en: {
      title:
        "Thank you so much\nfor giving us the opportunity\nto share this beautiful island.",
    },
    zh: {
      title: "非常感謝您\n讓我們有機會分享\n這個美麗的島嶼。",
    },
  };

  const styleArray = [
    {
      id: 1,
      style: "s1",
      name: "自然",
      color: "#4FCAD8",
      gradient: "linear-gradient(to top, #4FCAD8 5%, #D6F4FF00, #D6F4FF00)",
    },
    {
      id: 2,
      style: "s2",
      name: "生命",
      color: "#FFD1E4",
      gradient: "linear-gradient(to top, #FFD1E4 5%,#F7DDFA00, #00000000)",
    },
    {
      id: 3,
      style: "s3",
      name: "未來",
      color: "#7CD8F0",
      gradient: "linear-gradient(to top, #7CD8F0 5%, #D3E9FF00, #00000000)",
    },
  ];
  let videoDomain = "https://videos.expo2025-techworld-travel.com";
  // 解密 code 的函數
  const decryptCode = async (code: string): Promise<DecryptResponse> => {
    try {
      const response = await fetch(
        `https://urlencrypt-api.divine-wave-35ee.workers.dev/decrypt?code=${code}`
      );

      if (!response.ok) {
        throw new Error("解密請求失敗");
      }

      const data: DecryptResponse = await response.json();
      console.log("解密結果:", data);
      return data;
    } catch (error) {
      console.error("解密失敗:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sheetData = await fetchSheetData();
        const code = searchParams.get("code");
        let vParam = "";
        let pParam = "";

        if (code) {
          try {
            const decrypted = await decryptCode(code);
            vParam = decrypted.v;
            pParam = decrypted.p;
          } catch (error) {
            setError("解密失敗");
            return;
          }
        } else {
          vParam = searchParams.get("v") || "";
          pParam = searchParams.get("p") || "";
        }
        const match = vParam.match(/s(\d)(\d{3})(\d{3})?(\d{3})?/);
        const matchP = pParam.match(/(\d{2})(\d{2})(\d{2})/);

        if (matchP) {
          setP1(matchP[1]);
          setP2(matchP[2]);
          setP3(matchP[3]);
        } else {
          setP1("40");
          setP2("30");
          setP3("30");
        }

        if (match) {
          const numbers = [match[2], match[3], match[4]].filter(Boolean);
          console.log("要過濾的編號:", numbers);
          setCurrentStyle("s" + match[1]);

          // 先過濾出符合的資料
          const filteredData = sheetData.filter((item: ParsedSheetData) =>
            numbers.includes(item.formattedNumber)
          );

          // 根據 numbers 的順序排序資料
          const sortedData = numbers
            .map((number) =>
              filteredData.find(
                (item: ParsedSheetData) => item.formattedNumber === number
              )
            )
            .filter(Boolean) as ParsedSheetData[];

          console.log("排序後的資料:", sortedData);
          setData(sortedData);
        } else {
          setData(sheetData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);
  const downloadVideo = (url: string, name: string) => {
    let corsanywhere = "https://mscors-anywhwere.kilokingw.workers.dev/?";
    const fileName = name;

    fetch(corsanywhere + url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const videoBlob = new Blob([blob], { type: "video/mp4" });
        const downloadUrl = window.URL.createObjectURL(videoBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", fileName);

        // Append to the document
        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Clean up
        link.parentNode!.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((err) => console.error("Error downloading video:", err));
  };

  //share this page url
  const sharePageUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  const handleLanguageChange = (lang: "jp" | "en" | "zh") => {
    setLanguage(lang);

    setTimeout(() => {
      setIsVisible(false);
      // 當語言選擇區塊完全消失後，顯示主要內容
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }, 1500);
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  return (
    <div className="min-h-screen relative">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed top-0 left-0 w-full h-screen bg-cyan-400/20 backdrop-blur-sm z-[999] flex flex-col items-center justify-center"
          >
            <div className="text-white text-xl flex flex-col gap-6 items-center justify-center">
              <AnimatePresence>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: language === null ? 1 : language === "jp" ? 1 : 0,
                    y: 0,
                    scale: language === null ? 1 : language === "jp" ? 1.2 : 1,
                  }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  言語を選択してください
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: language === null ? 1 : language === "en" ? 1 : 0,
                    y: 0,
                    scale: language === null ? 1 : language === "en" ? 1.2 : 1,
                  }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Please select a language
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: language === null ? 1 : language === "zh" ? 1 : 0,
                    y: 0,
                    scale: language === null ? 1 : language === "zh" ? 1.2 : 1,
                  }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  請選擇語言
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center mt-[7%]">
              <div className="flex flex-row gap-4 items-center justify-center">
                <button
                  onClick={() => handleLanguageChange("jp")}
                  className={`border border-white p-2 ${
                    language === "jp"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  JP
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`border border-white p-2 ${
                    language === "en"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange("zh")}
                  className={`border border-white p-2 ${
                    language === "zh"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  ZH
                </button>
              </div>
              <div className="text-white text-2xl mt-2 tracking-widest "></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要內容 */}

      {/*  Section */}
      <section className="pb-[25%] min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-r from-[#76C6F3] via-[#5AB9F1] via-[#42ACE9] to-[#048BDB] relative">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col items-center justify-center"
            >
              <motion.div
                className="flex flex-col items-start justify-center tracking-widest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <p className="text-xl md:text-2xl mb-2 text-white whitespace-pre-wrap text-left   leading-12">
                  {language && languageArray[language].title}
                </p>
              </motion.div>

              <motion.div
                className="w-10/12 h-full items-center justify-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <img src="./images/chart_main.svg" alt="logo" />
                <ChartLayers
                  pink={parseInt(p1)}
                  green={parseInt(p2)}
                  blue={parseInt(p3)}
                />
                <div className="bottom-0 left-0 w-8/12 mx-auto h-full flex items-center justify-between">
                  <div className="text-white/80 text-sm">生命</div>
                  <div className="text-white/80 text-sm">自然</div>
                  <div className="text-white/80 text-sm">未來</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <Wave02
          position={"absolute bottom-0 left-0"}
          sceneStyle={currentStyle}
        />
      </section>

      {/* Intro Section */}
      <section className="py-16  bg-white text-center relative z-0">
        <div className="flex flex-col items-center justify-center my-15">
          <h2 className="text-3xl md:text-4xl font-bold">您的3套行程推薦</h2>
        </div>
      </section>

      {/* Itinerary Sections */}
      {data.map((item, index) => {
        const currentStyle =
          styleArray.find((style) => style.name === item.category) ||
          styleArray[0];

        console.log(currentStyle);

        return (
          <section
            key={item.number}
            className="pb-[45%] max-w-full mx-auto relative -mt-[45%]"
            style={{
              background: currentStyle.gradient,
            }}
          >
            <Wave06 position={"relative"} sceneStyle={currentStyle.style} />

            <div className="w-10/12 mx-auto relative ">
              <h2 className="text-2xl md:text-3xl font-bold mb- text-center flex flex-row items-center justify-between gap-2 px-[6px]">
                <span>0{index + 1}</span>
                <div>
                  {language === "jp"
                    ? item.name_jp
                    : language === "en"
                    ? item.name_en
                    : item.name_zh}
                </div>
              </h2>
              <div
                className="aspect-square w-full  p-[6px] mt-4"
                style={{
                  backgroundImage: `url('./images/video_bg.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {item.videoname && (
                  <video
                    className="w-full h-full object-cover shadow-lg"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source
                      src={`${videoDomain}/${item.videoname}`}
                      type="video/mp4"
                    />
                  </video>
                )}
              </div>
              <div className="flex flex-row items-center justify-center gap-2 my-3">
                <img
                  src="./images/dlbtn.png"
                  alt=""
                  className="w-[35px]"
                  onClick={() =>
                    downloadVideo(
                      `${videoDomain}/${item.videoname}`,
                      item.videoname
                    )
                  }
                />
              </div>
              <div className="prose max-w-none md:prose-lg mx-auto leading-8 text-[#1E1E1E] px-1">
                {language === "jp"
                  ? item.desc_jp
                  : language === "en"
                  ? item.desc_en
                  : item.desc_zh}
              </div>
            </div>
          </section>
        );
      })}

      {/* Footer */}
      <footer className="pb-8 text-center   relative -mt-[30%]">
        <Wave05 position={"relative"} />
        <div className="w-full  bg-gradient-to-t from-[#73C5F3] via-[#43ADE9]  to-[#0D90DD] h-[120vh] relative">
          <img
            src="./images/footer_top.png"
            alt="logo"
            className="w-full  top-0 left-0"
          />
          <div className="flex flex-row items-center justify-center gap-2 mt-14">
            <img
              src="./images/sharebtn.png"
              alt=""
              className="w-[35px]"
              onClick={sharePageUrl}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
