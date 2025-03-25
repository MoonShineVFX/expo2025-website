import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  fetchJsonData,
  fetchXXJsonData,
  fetchStaticJsonData,
} from "./utils/fetchSheetData";
import ChartLayers from "./components/ChartLayers";
import Wave05 from "./components/Wave05";
import Wave06 from "./components/Wave06";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Wave07 from "./components/Wave07";
import Wave08 from "./components/Wave08";
import useMobile from "./hooks/useMobile";
// import ReactPlayer from "react-player/lazy";
// import React from "react";
// import VideoPlayerV1 from "./components/VideopPlayerV1";
import DownloadButton from "./components/DownloadButton";
import VideoPlayerV2 from "./components/VideoPlayerV2";

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
  auth_jp: string;
  auth_en: string;
  auth_zh: string;
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
  standard_jp: string;
  standard_en: string;
  standard_zh: string;
  color_jp: string;
  color_en: string;
  color_zh: string;
  story_jp: string;
  story_en: string;
  story_zh: string;
}

interface DecryptResponse {
  v: string;
  p: string;
  c: string;
}

interface StaticData {
  key: string;
  jp: string;
  en: string;
  zh: string;
}

function App() {
  const isMobile = useMobile();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ParsedSheetData[]>([]);
  // const [moreData, setMoreData] = useState<ParsedSheetData[]>([]);
  const [currentStyle, setCurrentStyle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [language, setLanguage] = useState<"jp" | "en" | "zh" | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(true);
  const lastScrollY = useRef(0);
  const [languageArray, setLanguageArray] = useState({
    jp: {
      intro_title: "",
      noData: "現在、予定されている行程はありません。",
      dataDesc: "あなたの3つの旅程おすすめ。",
      webTitle: "EXPO 2025 TechWorld Travel",
      webDesc: "探索台灣的美麗風景",
      category: "",
      standard_word: "",
      color_word: "",
      font_color: "",
      resource: "写真・文章提供：",
      nature: "自然",
      life: "生命",
      future: "未来",
      story: "",
      journey_title: "",
      more: "",
    },
    en: {
      intro_title: "",
      noData: "There are currently no itineraries.",
      dataDesc: "Your three itinerary recommendations.",
      webTitle: "EXPO 2025 TechWorld Travel",
      webDesc: "Explore the beautiful scenery of Taiwan",
      category: "",
      standard_word: "",
      color_word: "",
      font_color: "",
      resource: "Photo & Text by: ",
      nature: "NATURE",
      life: "LIFE",
      future: "FUTURE",
      story: "",
      journey_title: "",
      more: "",
    },
    zh: {
      intro_title: "",
      noData: "目前沒有任何行程",
      dataDesc: "您的3套行程推薦",
      webTitle: "EXPO 2025 TechWorld Travel",
      webDesc: "探索台灣的美麗風景",
      category: "",
      standard_word: "",
      color_word: "",
      font_color: "",
      resource: "圖文提供：",
      nature: "自然",
      life: "生命",
      future: "未來",
      story: "",
      journey_title: "",
      more: "",
    },
  });

  const styleArray = [
    {
      id: 1,
      style: "s1",
      name: "生命",
      color: "#F481B1",
      gradient:
        "linear-gradient(0deg, #4FCAD8 0%, #f3feff50 12%, #ffffff00 100%)",
    },
    {
      id: 2,
      style: "s2",
      name: "自然",
      color: "#37AFBC",

      gradient:
        "linear-gradient(0deg, #ffd1e4 0%, #fff4f950 12%, #ffffff00 100%)",
    },
    {
      id: 3,
      style: "s3",
      name: "未來",
      color: "#36ADE8",
      gradient:
        "linear-gradient(0deg, #7CD8F0 0%, #7CD8F050 12%, #ffffff00 100%)",
    },
  ];
  // 新增一個函數來更新 languageArray
  const updateLanguageArrayFromStaticData = (staticData: StaticData[]) => {
    console.log("staticData:", staticData);
    console.log("languageArray:", languageArray);
    // 創建一個新的物件來存儲更新後的值
    const updatedLanguageArray = {
      jp: { ...languageArray.jp },
      en: { ...languageArray.en },
      zh: { ...languageArray.zh },
    };

    // 遍歷 staticData
    staticData.forEach((item) => {
      const key = item.key;

      // 更新各語言的值
      if (item.jp) (updatedLanguageArray.jp as any)[key] = item.jp;
      if (item.en) (updatedLanguageArray.en as any)[key] = item.en;
      if (item.zh) (updatedLanguageArray.zh as any)[key] = item.zh;
    });
    console.log("updatedLanguageArray:", updatedLanguageArray);

    // 更新 state
    setLanguageArray(updatedLanguageArray);
  };

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
        const staticData = await fetchStaticJsonData();
        updateLanguageArrayFromStaticData(staticData);
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
        if (match && matchC) {
          const filterCategoryData = categoryData.filter(
            (item: CategoryData) => item.number === Number(matchC)
          );
          // get vParam 的 s1,s2,s3
          const currentStyleData = styleArray.find(
            (style) => style.style === `s${match[1]}`
          );

          //filterCategoryData.standard_jp : あなたのtitleの旅 取代 title = filterCategoryData.color_jp
          //filterCategoryData.standard_en : Your Journey of title 取代 title = filterCategoryData.color_en
          //filterCategoryData.standard_zh : 您的title之旅 取代 title = filterCategoryData.color_zh
          if (currentStyleData && filterCategoryData.length > 0) {
            setLanguageArray((prev) => ({
              ...prev,
              jp: {
                ...prev.jp,
                standard_word: filterCategoryData[0].standard_jp,
                color_word: filterCategoryData[0].color_jp,
                font_color: currentStyleData.color,
                story: filterCategoryData[0].story_jp,
              },
              en: {
                ...prev.en,
                standard_word: filterCategoryData[0].standard_en,
                color_word: filterCategoryData[0].color_en,
                font_color: currentStyleData.color,
                story: filterCategoryData[0].story_en,
              },
              zh: {
                ...prev.zh,
                standard_word: filterCategoryData[0].standard_zh,
                color_word: filterCategoryData[0].color_zh,
                font_color: currentStyleData.color,
                story: filterCategoryData[0].story_zh,
              },
            }));
            console.log("languageArray:", languageArray);
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

          // 從原始資料中排除已顯示的項目，然後隨機選擇三個作為推薦
          getRandomRecommendations(sheetData, numbers);
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

  const getRandomRecommendations = (
    allData: ParsedSheetData[],
    excludeNumbers: string[]
  ) => {
    // 確保 excludeNumbers 中的所有值都是字符串
    const normalizedExcludeNumbers = excludeNumbers.map((num) => String(num));

    // 過濾掉已顯示的項目，並確保有效的 formattedNumber
    const availableData = allData.filter(
      (item) =>
        item.formattedNumber &&
        !normalizedExcludeNumbers.includes(String(item.formattedNumber))
    );

    // 如果可用資料少於3個，則全部顯示
    if (availableData.length <= 3) {
      console.log("可用資料少於3個，顯示全部:", availableData.length);
      // setMoreData(availableData);
      return;
    }

    // 隨機選擇3個項目
    const randomData: ParsedSheetData[] = [];
    const tempData = [...availableData]; // 創建副本以避免修改原始資料

    for (let i = 0; i < 3; i++) {
      if (tempData.length === 0) {
        console.log("臨時數據已用完，只能選擇", i, "個項目");
        break;
      }

      // 生成隨機索引
      const randomIndex = Math.floor(Math.random() * tempData.length);

      // 添加到結果並從臨時數組中移除
      randomData.push(tempData[randomIndex]);
      tempData.splice(randomIndex, 1);
    }

    // setMoreData(randomData);
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

  const handleLanguageChange = (lang: "jp" | "en" | "zh") => {
    setLanguage(lang);

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }, 1500);
  };

  const replaceTitle = (
    standard_word: string,
    color_word: string,
    color: string,
    language: "jp" | "en" | "zh"
  ) => {
    const [before, after] = standard_word.split("title");

    return (
      <div className="flex flex-row items-center">
        <span>{before}</span>
        <span style={{ color: color }}>
          {language === "en" ? <>&nbsp;{color_word}</> : color_word}
        </span>
        <span>{after}</span>
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

  const [videoHeight, setVideoHeight] = useState<number | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (videoRef.current) {
        const height = videoRef.current.offsetHeight;
        if (height > 0) {
          setVideoHeight(height);
        }
      }
    };

    // 只在組件掛載和視窗大小變化時更新高度
    updateHeight();

    // 設置一個定時器，確保在DOM完全渲染後再次嘗試獲取高度
    const timer = setTimeout(() => {
      updateHeight();
    }, 500);

    // 監聽視窗大小變化
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      clearTimeout(timer);
    };
  }, []); // 只在組件掛載時執行一次

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
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "jp"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  日
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
                  onClick={() => handleLanguageChange("zh")}
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "zh"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  繁
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
                  日
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
                  onClick={() => handleLanguageChange("zh")}
                  className={`border border-white w-10 h-10 flex items-center justify-center ${
                    language === "zh"
                      ? "bg-white text-[#5AB9F1]"
                      : "text-white hover:bg-white hover:text-[#5AB9F1]"
                  }`}
                >
                  繁
                </button>
              </div>
              <div className="text-white text-2xl mt-2 tracking-widest "></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要內容 */}

      {/*  Section */}
      <section className="pb-[25%] md:pt-[10%] min-h-screen  flex flex-col items-center justify-center px-4 text-center bg-gradient-to-r from-[#76C6F3] via-[#5AB9F1] via-[#42ACE9] to-[#048BDB] relative">
        <AnimatePresence>
          {
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              className={`flex flex-col md:flex-row items-center justify-center `}
            >
              <motion.div
                key={language && languageArray[language].intro_title}
                className="flex flex-col md:flex-row items-center md:items-start justify-center tracking-widest w-full md:w-[500px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <p className="text-xl md:text-3xl mb-2 text-white whitespace-pre-wrap text-left   leading-12 md:leading-16 md:tracking-widest">
                  {language && languageArray[language].intro_title}
                </p>
              </motion.div>

              <motion.div
                className="w-full md:w-1/2 h-full items-center justify-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <div className="w-10/12 mx-auto h-full relative my-[8%]">
                  <img src="./images/charts2/bg01.svg" alt="logo" />
                  {showContent && (
                    <ChartLayers pink={p1} green={p2} blue={p3} />
                  )}
                </div>
                <div className="w-10/12 mx-auto  relative my-[0%] ">
                  <div
                    className={`mx-auto flex items-center justify-between    ${
                      language === "en" ? "w-[84%]" : "w-[68%] md:w-[66%]"
                    }`}
                  >
                    <div
                      className={`text-white/80 text-sm md:text-[18px] text-center  ${
                        language === "en" ? "w-[33%]" : "w-[20%] md:w-[16%]"
                      }`}
                    >
                      {language && languageArray[language].life}
                    </div>
                    <div
                      className={`text-white/80 text-sm md:text-[18px] text-center ${
                        language === "en" ? "w-[33%]" : "w-[60%] md:w-auto"
                      }`}
                    >
                      {language && languageArray[language].nature}
                    </div>
                    <div
                      className={`text-white/80 text-sm md:text-[18px] text-center  ${
                        language === "en" ? "w-[33%]" : "w-[20%] md:w-[15%]"
                      }`}
                    >
                      {language && languageArray[language].future}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          }
        </AnimatePresence>

        <Wave07 position={"absolute -bottom-[15%] left-0"} />
      </section>

      {/* Intro Section */}
      <section className="py-[30%] md:py-[12%] bg-white text-center relative  -mt-[2px] z-10">
        <div className="flex flex-col items-center justify-center mb-15 md:mb-0 -mt-[5%] md:-mt-[0%] ">
          {/* <div className="w-full max-w-lg mx-auto">
            <VideoPlayerV2
              src="https://videos.expo2025-techworld-travel.com/HLS/BW_Life_0012_D/BW_Life_0012_D.m3u8" // HLS 測試串流
              controls={true}
              muted={true}
            />
          </div> */}
          {data.length > 0 ? (
            <h2
              className="text-3xl md:text-4xl font-bold"
              data-aos="fade-up"
              data-aos-duration="1300"
              data-aos-delay="200"
            >
              {language &&
                replaceTitle(
                  languageArray[language].journey_title,
                  languageArray[language].color_word,
                  languageArray[language].font_color,
                  language
                )}
            </h2>
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold">
              {language && languageArray[language].noData}
            </h2>
          )}
          <div
            className="text-lg md:text-xl text-center w-[70%] md:w-[60%] mx-auto mt-[10%] md:mt-[5%] whitespace-pre-wrap"
            data-aos="fade-up"
            data-aos-duration="1300"
            data-aos-delay="200"
          >
            {language && languageArray[language].story}
          </div>
        </div>
      </section>
      <section className="relative pb-[0%] md:pb-[0%]  md:mt-[10%]  ">
        {/* Itinerary Sections */}
        {data.length > 0 &&
          data.map((item, index) => {
            const currentStyle =
              styleArray.find((style) => style.name === item.category) ||
              styleArray[0];

            return (
              <section
                key={"sheetdata" + item.number + index}
                className="pb-[45%] md:pb-[25%] lg:pb-[28%]  max-w-full mx-auto relative -mt-[45%]  md:-mt-[17%]"
                style={{
                  background: currentStyle.gradient,
                }}
              >
                <Wave06 position={"relative"} sceneStyle={currentStyle.style} />
                <Wave08
                  position={"absolute top-[50%] md:top-[30%] left-0"}
                  sceneStyle={currentStyle.style}
                />

                <div className="w-10/12 md:w-8/12   mx-auto relative flex flex-col md:flex-row  items-stretch justify-center md:items-stretch md:gap-[7%] ">
                  <div className="w-full md:w-1/2  ">
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
                    <div className="flex flex-col h-full">
                      {item.videoname && (
                        // <div ref={videoRef} className="video-container">
                        //   <VideoPlayerV1
                        //     key={`${item.videoname}-${index}`}
                        //     videoUrl={`${videoDomain}/${item.videoname}`}
                        //     index={index}
                        //   />
                        // </div>
                        <VideoPlayerV2
                          src={`https://videos.expo2025-techworld-travel.com/HLS/${item.videoname.replace(
                            ".mp4",
                            ""
                          )}/${item.videoname.replace(".mp4", "")}.m3u8`}
                          controls={false}
                          muted={true}
                        />
                      )}
                      <DownloadButton
                        videoUrl={`${videoDomain}/${item.videoname}`}
                        fileName={item.videoname}
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2    ">
                    {!isMobile && (
                      <h2
                        className="text-2xl md:text-3xl font-bold mb- text-center flex flex-row items-center justify-between gap-2 px-[6px] text-transparent"
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
                    )}
                    <div
                      className=" flex flex-col h-full justify-between  leading-8 text-[#1E1E1E] px-1 md:text-[18px] md:leading-8  md:tracking-wider "
                      data-aos="fade-up"
                      data-aos-duration="1300"
                      data-aos-delay="200"
                    >
                      <div className="md:aspect-square w-full  mt-4 ">
                        <div
                          className="w-full max-w-xl overflow-y-auto scrollbar"
                          style={{
                            height: isMobile
                              ? "auto"
                              : videoHeight
                              ? `${videoHeight - 50}px`
                              : "auto",
                          }}
                        >
                          {language === "jp"
                            ? item.desc_jp
                            : language === "en"
                            ? item.desc_en
                            : item.desc_zh}
                        </div>
                      </div>

                      <div className="w-full  mt-[10%]  md:mt-auto h-12 flex items-center ">
                        <div
                          className="text-sm  md:text-[16px]  text-left text-[#1E1E1E]"
                          data-aos="fade-up"
                          data-aos-duration="1300"
                          data-aos-delay="200"
                        >
                          {language && languageArray[language].resource}{" "}
                          {language === "jp"
                            ? item.auth_jp
                            : language === "en"
                            ? item.auth_en
                            : item.auth_zh}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
      </section>
      <section className="relative  z-0 md:mb-[10%]  ">
        <Wave05
          position={
            "absolute   left-0 -z-10 h-[250px] md:h-[320px] -mt-[33%] md:-mt-[20%]   "
          }
        />
        {/* <div className="   w-10/12 md:w-6/12 mx-auto my-[10%] md:my-[5%] ">
          <div className="text-lg md:text-xl">
            {language && languageArray[language].more}
          </div>
          <div className="flex flex-col gap-2 my-[10%] md:my-[5%] text-lg md:text-xl ">
            {moreData.length > 0 &&
              moreData.map((item, index) => {
                return (
                  <div key={"recommend" + item.number + item.name_zh}>
                    <div
                      className="text-right"
                      data-aos="fade-down"
                      data-aos-duration="1300"
                      data-aos-delay={`${index * 200}`}
                    >
                      {language === "jp"
                        ? item.name_jp
                        : language === "en"
                        ? item.name_en
                        : item.name_zh}
                    </div>
                  </div>
                );
              })}
          </div>
        </div> */}
      </section>

      {/* Footer */}
      <footer className=" text-center   relative mt-[20%] md:-mt-[20%] lg:-mt-[10%] pt-[10%] ">
        <div className="w-full  bg-gradient-to-t from-[#73C5F3] via-[#43ADE9]  to-[#0D90DD] h-[60vh] md:h-[60vh] relative">
          {/* <img
            src="./images/footer_top.png"
            alt="logo"
            className="w-full  top-0 left-0"
          /> */}
          <div
            className="w-[100%]  h-[30px] z-0  -mt-[1%]  drop-shadow-[0_10px_4px_rgba(0,0,0,0.1)] bg-[450px_auto] md:bg-[700px_auto]  "
            style={{
              backgroundImage: "url('./images/footer_wave02.svg')",
              backgroundRepeat: "repeat-x",

              backgroundPosition: "bottom",
              opacity: 1,
            }}
          />
          {isMobile && (
            <div
              className="flex flex-row items-center justify-center gap-2  pt-[50px]"
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
          )}
          {!isMobile && (
            <div className=" px-[3%]  absolute bottom-[5%] left-0 right-0">
              <div className="w-full    relative flex justify-between border-t border-white/50 pt-[20px]">
                <div className=" cursor-pointer">
                  <img
                    src="./images/sharebtn.svg"
                    alt="logo"
                    className="w-[35px]"
                    onClick={sharePageUrl}
                  />
                </div>
                <div className=" cursor-pointer">
                  <img
                    src="./images/topbtn.svg"
                    alt="logo"
                    className="w-[45px]"
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
