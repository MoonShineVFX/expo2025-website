import "./App.css";
import { motion } from "framer-motion";
import Wave02 from "./components/Wave02";
import Wave01 from "./components/Wave01";

function App() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('./images/header_bg02.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-white text-5xl font-bold">EXPO 2025</div>
        <div className="flex flex-col gap-2 items-center justify-center  absolute bottom-1/5 ">
          <div className="flex flex-row gap-4 items-center justify-center">
            <div className="  border border-white p-2 text-white hover:bg-white hover:text-[#5AB9F1]">
              JP
            </div>
            <div className="  border border-white p-2 text-white hover:bg-white hover:text-[#5AB9F1]">
              EN
            </div>
            <div className="  border border-white p-2 text-white hover:bg-white hover:text-[#5AB9F1]">
              ZH
            </div>
          </div>
          <div className="text-white text-2xl mt-2 tracking-widest ">
            請選擇語言
          </div>
        </div>
      </header>
      {/*  Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-r from-[#76C6F3] via-[#5AB9F1] via-[#42ACE9] to-[#048BDB] relative">
        <div className="flex flex-col items-start justify-center tracking-widest">
          <p className="text-xl md:text-2xl mb-2 text-white">非常感謝您</p>
          <p className="text-xl md:text-2xl mb-2 text-white">
            讓我們有機會分享
          </p>
          <p className="text-xl md:text-2xl text-white">這個美麗的島嶼。</p>
        </div>
        <Wave01 />
      </section>

      {/* Intro Section */}
      <section className="py-16  bg-white text-center relative">
        <div className="flex flex-col items-center justify-center my-15">
          <h2 className="text-3xl md:text-4xl font-bold">您的3套行程推薦</h2>
        </div>
        <Wave02 position={"relative"} />
      </section>

      {/* Itinerary Sections */}
      {[1, 2, 3].map((num) => (
        <section key={num} className="py-16  max-w-6xl mx-auto">
          <div className=" w-10/12 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center flex flex-row items-center justify-between gap-2">
              {String(num).padStart(2, "0")}
              <div>鹿耳門</div>
            </h2>
            <div
              className="aspect-square w-full mb-8 p-2"
              style={{
                backgroundImage: `url('./images/video_bg.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <video className="w-full h-full object-cover  shadow-lg" controls>
                <source src={`/path-to-video${num}`} type="video/mp4" />
              </video>
            </div>
            <div className="prose max-w-none md:prose-lg mx-auto leading-8 text-[#1E1E1E] px-1">
              礁溪溫泉公園佔地寬廣、綠意盎然，步行不用 10
              分鐘就能抵達礁溪火車站及礁溪夜市。
              這裡有遊客中心、足湯池以及森林步道，遊憩設施完善。穿過綠樹與流水錯落的庭園後，還有日式露天溫泉「森林風呂」，男、女湯皆有數種泡湯池，能在泡湯同時享受不同風景。
            </div>
          </div>

          <Wave02 position={"relative"} />
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
