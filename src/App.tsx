import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchJsonData, fetchXXJsonData } from "./utils/fetchSheetData";
import ChartLayers from "./components/ChartLayers";
import Wave05 from "./components/Wave05";
import Wave06 from "./components/Wave06";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Wave07 from "./components/Wave07";
import Wave08 from "./components/Wave08";
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

interface CategoryData {
  number: number;
  category: string;
  name_jp: string;
  name_en: string;
  name_zh: string;
}

interface DecryptResponse {
  v: string;
  p: string;
  c: string;
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
  const [language, setLanguage] = useState<"jp" | "en" | "ch" | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(true);
  const lastScrollY = useRef(0);
  const [languageArray, setLanguageArray] = useState({
    jp: {
      title: "この美しい島を\n共有する機会をくださり、\n感謝します。",
      noData: "現在、予定されている行程はありません。",
      dataDesc: "あなたの3つの旅程おすすめ。",
      webTitle: "EXPO 2025 TechWorld Travel",
      webDesc: "探索台灣的美麗風景",
      category: "",
    },
    en: {
      title:
        "Thank you so much\nfor giving us the opportunity\nto share this beautiful island.",
      noData: "There are currently no itineraries.",
      dataDesc: "Your three itinerary recommendations.",
      webTitle: "EXPO 2025 TechWorld Travel",
      webDesc: "Explore the beautiful scenery of Taiwan",
      category: "",
    },
    ch: {
      title: "非常感謝您\n讓我們有機會分享\n這個美麗的島嶼。",
      noData: "目前沒有任何行程",
      dataDesc: "您的3套行程推薦",
      webTitle: "EXPO 2025 TechWorld Travel",
      webDesc: "探索台灣的美麗風景",
      category: "",
    },
  });

  const styleArray = [
    {
      id: 1,
      style: "s1",
      name: "自然",
      color: "#4FCAD8",
      gradient:
        "linear-gradient(0deg, #4FCAD8 0%, #f3feff 12%, #ffffff00 100%)",
    },
    {
      id: 2,
      style: "s2",
      name: "生命",
      color: "#FFD1E4",
      gradient:
        "linear-gradient(0deg, #ffd1e4 0%, #fff4f9 12%, #ffffff00 100%)",
    },
    {
      id: 3,
      style: "s3",
      name: "未來",
      color: "#7CD8F0",
      gradient:
        "linear-gradient(0deg, #7CD8F0 0%, #7CD8F050 12%, #ffffff00 100%)",
    },
  ];
  useEffect(() => {
    setTimeout(function () {
      AOS.init({});
    }, 100);
    // AOS.refresh()
  }, []);
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
        const sheetData = await fetchJsonData();
        const categoryData = await fetchXXJsonData();
        const code = searchParams.get("code");
        let vParam = "";
        let pParam = "";
        let cParam = "";

        if (code) {
          try {
            const decrypted = await decryptCode(code);
            vParam = decrypted.v;
            pParam = decrypted.p;
            cParam = decrypted.c;
          } catch (error) {
            setError("解密失敗");
            return;
          }
        } else {
          vParam = searchParams.get("v") || "";
          pParam = searchParams.get("p") || "";
          cParam = searchParams.get("c") || "";
        }
        const match = vParam.match(/s(\d)(\d{3})(\d{3})?(\d{3})?/);
        const matchP = pParam.match(/(\d{2})(\d{2})(\d{2})/);
        const matchC = cParam;
        if (matchC) {
          const filterCategoryData = categoryData.filter(
            (item: CategoryData) => item.number === Number(matchC)
          );
          console.log("分類:", filterCategoryData);

          if (filterCategoryData.length > 0) {
            setLanguageArray((prev) => ({
              ...prev,
              jp: { ...prev.jp, category: filterCategoryData[0].name_jp },
              en: { ...prev.en, category: filterCategoryData[0].name_en },
              ch: { ...prev.ch, category: filterCategoryData[0].name_zh },
            }));
          }
        }
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
          setCurrentStyle("s" + match[1]);
          console.log("要過濾的編號:", currentStyle);

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
          //顯示現在沒有行程
          setData([]);
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
  const sharePageUrl = async () => {
    const url = window.location.href;
    const title = language
      ? languageArray[language].webTitle
      : languageArray.en.webTitle;
    const text = language
      ? languageArray[language].webDesc
      : languageArray.en.webDesc;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("網址已複製到剪貼簿");
      }
    } catch (error) {
      console.log("分享失敗:", error);
    }
  };

  const handleLanguageChange = (lang: "jp" | "en" | "ch") => {
    setLanguage(lang);

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }, 1500);
  };

  // VideoPlayer 組件
  const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && videoRef.current) {
              videoRef.current.play();
            } else if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          });
        },
        { threshold: 0.5 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={containerRef}
        className="aspect-square w-full p-[6px] mt-4"
        style={{
          backgroundImage: `url('./images/video_bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-aos="fade"
        data-aos-duration="1300"
        data-aos-delay="200"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover shadow-lg"
          muted
          playsInline
          webkit-playsinline="true"
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onEnded={(e) => {
            const video = e.target as HTMLVideoElement;
            setTimeout(() => {
              video.play();
            }, 3000);
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 只在頁面頂部 350px 範圍內處理向上滾動顯示
      if (currentScrollY < 350) {
        if (currentScrollY < lastScrollY.current) {
          // 向上滾動且在頂部範圍內
          setShowTopMenu(true);
        }
        // 新增：當向下滾動超過 100px 就隱藏
        if (currentScrollY > 40 && currentScrollY > lastScrollY.current) {
          setShowTopMenu(false);
        }
      } else {
        // 在 350px 以下時
        if (currentScrollY > lastScrollY.current) {
          // 向下滾動
          setShowTopMenu(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // 禁用滾動
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // 恢復滾動
      const scrollY = document.body.style.top;
      document.body.style.overflow = "unset";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isVisible]);

  if (loading)
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div
            className="w-full text-white flex items-center justify-center  h-[100vh] relative"
            style={{
              background: "linear-gradient(-45deg, #73C5F3, #43ADE9, #0D90DD)",
              backgroundSize: "400% 400%",
              animation: "gradient 8s ease infinite",
            }}
          >
            Loading...
          </div>
        </motion.div>
      </AnimatePresence>
    );
  if (error) return <div>錯誤: {error}</div>;
  return (
    <div className="min-h-screen relative">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed top-0 left-0 w-full h-screen bg-cyan-400/20 backdrop-blur-lg z-[999] flex flex-col items-center justify-center"
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
                    opacity: language === null ? 1 : language === "ch" ? 1 : 0,
                    y: 0,
                    scale: language === null ? 1 : language === "ch" ? 1.2 : 1,
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
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "jp"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  JP
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "en"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange("ch")}
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "ch"
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
      <AnimatePresence>
        {!isVisible && showTopMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="flex flex-col items-center justify-center ">
              <div className="flex flex-row gap-4 items-center justify-center">
                <button
                  onClick={() => handleLanguageChange("jp")}
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "jp"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  JP
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "en"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange("ch")}
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "ch"
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
              className="flex flex-col items-center justify-center "
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
                className="w-12/12 h-full items-center justify-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <div className="w-10/12 mx-auto h-full relative my-[8%]">
                  <img src="./images/charts2/bg01.svg" alt="logo" />
                  <ChartLayers pink={p1} green={p2} blue={p3} />
                </div>

                <div className="ml-[24%] mr-[23%]  mx-auto h-full flex items-center justify-between">
                  <div className="text-white/80 text-sm">生命</div>
                  <div className="text-white/80 text-sm">自然</div>
                  <div className="text-white/80 text-sm">未來</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Wave07 position={"absolute -bottom-[15%] left-0"} />
      </section>

      {/* Intro Section */}
      <section className="py-[30%] bg-white text-center relative  -mt-[2px] z-10">
        <div
          className="flex flex-col items-center justify-center mb-15 -mt-[5%] "
          data-aos="fade-up"
          data-aos-duration="1300"
          data-aos-delay="200"
        >
          {data.length > 0 ? (
            <h2 className="text-3xl md:text-4xl font-bold">
              {language && languageArray[language].category}
            </h2>
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold">
              {language && languageArray[language].noData}
            </h2>
          )}
        </div>
      </section>
      <section className="relative pb-[50%] ">
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
              <Wave08
                position={"absolute top-[50%] left-0"}
                sceneStyle={currentStyle.style}
              />

              <div className="w-10/12 mx-auto relative ">
                <h2
                  className="text-2xl md:text-3xl font-bold mb- text-center flex flex-row items-center justify-between gap-2 px-[6px]"
                  data-aos="fade-down"
                  data-aos-duration="1300"
                  data-aos-delay="200"
                >
                  <span>0{index + 1}</span>
                  <div className="text-right">
                    {language === "jp"
                      ? item.name_jp
                      : language === "en"
                      ? item.name_en
                      : item.name_zh}
                  </div>
                </h2>
                {item.videoname && (
                  <VideoPlayer videoUrl={`${videoDomain}/${item.videoname}`} />
                )}
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
                    data-aos="fade"
                    data-aos-duration="1300"
                    data-aos-delay="200"
                  />
                </div>
                <div
                  className="prose max-w-none md:prose-lg mx-auto leading-8 text-[#1E1E1E] px-1"
                  data-aos="fade-up"
                  data-aos-duration="1300"
                  data-aos-delay="200"
                >
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
        <Wave05 position={"absolute bottom-0 left-0"} />
      </section>

      {/* Footer */}
      <footer className=" text-center   relative -mt-[20%]">
        <div className="w-full  bg-gradient-to-t from-[#73C5F3] via-[#43ADE9]  to-[#0D90DD] h-[120vh] relative">
          <img
            src="./images/footer_top.png"
            alt="logo"
            className="w-full  top-0 left-0"
          />
          <div
            className="flex flex-row items-center justify-center gap-2 mt-14"
            data-aos="fade"
            data-aos-duration="1300"
            data-aos-delay="200"
          >
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
