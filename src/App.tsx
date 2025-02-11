import "./App.css";
import { useSearchParams } from "react-router-dom";
import Wave02 from "./components/Wave02";
import HomePage from "./components/HomePage";
import { useEffect, useState } from "react";
import { fetchSheetData } from "./utils/fetchSheetData";
import Wave04 from "./components/Wave04";
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
function App() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ParsedSheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState("s1");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sheetData = await fetchSheetData();

        const vParam = searchParams.get("v") || "";
        const match = vParam.match(/s(\d)(\d{3})(\d{3})?(\d{3})?/);

        if (match) {
          const numbers = [match[2], match[3], match[4]].filter(Boolean);
          const filteredData = sheetData.filter((item: ParsedSheetData) =>
            numbers.includes(item.formattedNumber)
          );
          setCurrentStyle("s" + match[1]);
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
        <div className="w-10/12 h-full flex items-center justify-center">
          <img src="./images/chart_main.svg" alt="logo" />
        </div>
        {/* <Wave01 /> */}

        <Wave04 position={"absolute"} />
      </section>

      {/* Intro Section */}
      <section className="py-16  bg-white text-center relative z-0">
        <div className="flex flex-col items-center justify-center my-15">
          <h2 className="text-3xl md:text-4xl font-bold">您的3套行程推薦</h2>
        </div>
        <Wave02 position={"relative"} sceneStyle={currentStyle} />
      </section>

      {/* Itinerary Sections */}
      {data.map((item, index) => (
        <section key={item.number} className="py-16 max-w-full mx-auto">
          <div className="w-10/12 mx-auto">
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
              {item.videolink && (
                <video
                  className="w-full h-full object-cover shadow-lg"
                  controls
                >
                  <source src={item.videolink} type="video/mp4" />
                </video>
              )}
            </div>
            <div className="prose max-w-none md:prose-lg mx-auto leading-8 text-[#1E1E1E] px-1">
              {item.desc_zh}
            </div>
          </div>
          <Wave02 position={"relative"} sceneStyle={currentStyle} />
        </section>
      ))}

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 text-center">
        <p className="text-gray-600">製作單位 103fm06</p>
      </footer>
    </div>
  );
}

export default App;
