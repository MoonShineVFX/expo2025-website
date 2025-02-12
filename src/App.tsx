import "./App.css";
import { useSearchParams } from "react-router-dom";
import Wave02 from "./components/Wave02";
import HomePage from "./components/HomePage";
import { useEffect, useState } from "react";
import { fetchSheetData } from "./utils/fetchSheetData";
import Wave04 from "./components/Wave04";
import WaveChart from "./components/WaveChart";
import ChartLayers from "./components/ChartLayers";
import Wave05 from "./components/Wave05";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");

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

        // 檢查是否有 code 參數
        const code = searchParams.get("code");
        let vParam = "";
        let pParam = "";

        if (code) {
          // 如果有 code，進行解密
          try {
            const decrypted = await decryptCode(code);
            vParam = decrypted.v; // 直接使用解密後的 v 值
            console.log("使用解密後的參數:", vParam);
            pParam = decrypted.p;
            console.log("使用解密後的參數:", pParam);
          } catch (error) {
            setError("解密失敗");
            return;
          }
        } else {
          // 如果沒有 code，使用原本的 v 參數
          vParam = searchParams.get("v") || "";
          pParam = searchParams.get("p") || "";
        }

        // 解析參數
        const match = vParam.match(/s(\d)(\d{3})(\d{3})?(\d{3})?/);
        const matchP = pParam.match(/(\d{2})(\d{2})(\d{2})/);

        if (matchP) {
          const numbers = [matchP[1], matchP[2], matchP[3]].filter(Boolean);
          setP1(numbers[0]);
          setP2(numbers[1]);
          setP3(numbers[2]);
        }
        if (match) {
          const numbers = [match[2], match[3], match[4]].filter(Boolean);
          console.log("要過濾的編號:", numbers);

          const filteredData = sheetData.filter((item: ParsedSheetData) =>
            numbers.includes(item.formattedNumber)
          );
          console.log("過濾後的資料:", filteredData);

          setData(filteredData);
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

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  return (
    <div className="min-h-screen relative">
      <HomePage />

      {/*  Section */}
      <section className="pb-[25%] min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-r from-[#76C6F3] via-[#5AB9F1] via-[#42ACE9] to-[#048BDB] relative">
        <div className="flex flex-col items-start justify-center tracking-widest">
          <p className="text-xl md:text-2xl mb-2 text-white">非常感謝您</p>
          <p className="text-xl md:text-2xl mb-2 text-white">
            讓我們有機會分享
          </p>
          <p className="text-xl md:text-2xl text-white">這個美麗的島嶼。</p>
        </div>
        <div className="w-10/12 h-full  items-center justify-center relative">
          <img src="./images/chart_main.svg" alt="logo" />
          <ChartLayers
            pink={parseInt(p1)} // 會自動疊加 10-90 的圖層
            green={parseInt(p2)} // 會自動疊加 10-50 的圖層
            blue={parseInt(p3)} // 會自動疊加 10-30 的圖層
          />
          <div className=" bottom-0 left-0 w-8/12 mx-auto h-full flex  items-center justify-between">
            <div className="text-white/80 text-sm">生命</div>
            <div className="text-white/80 text-sm">自然</div>
            <div className="text-white/80 text-sm">未來</div>
          </div>
        </div>
        {/* <Wave01 /> */}

        <Wave04 position={"absolute"} />
      </section>

      {/* Intro Section */}
      <section className="py-16  bg-white text-center relative z-0">
        <div className="flex flex-col items-center justify-center my-15">
          <h2 className="text-3xl md:text-4xl font-bold">您的3套行程推薦</h2>
        </div>
        {/* <Wave02 position={"relative"} sceneStyle={currentStyle} /> */}
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
            <Wave02 position={"relative"} sceneStyle={currentStyle.style} />
            <div className="w-10/12 mx-auto ">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center flex flex-row items-center justify-between gap-2">
                <span>行程{index + 1}</span>
                <div>{item.name_zh}</div>
              </h2>
              <div
                className="aspect-square w-full mb-8 p-2"
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
              <div className="prose max-w-none md:prose-lg mx-auto leading-8 text-[#1E1E1E] px-1">
                {item.desc_zh}
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
            className="w-full absolute top-0 left-0"
          />
        </div>
      </footer>
    </div>
  );
}

export default App;
