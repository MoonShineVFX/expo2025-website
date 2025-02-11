import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchSheetData } from "../utils/fetchSheetData";

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

const YourComponent = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ParsedSheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sheetData = await fetchSheetData();

        // 解析 URL 參數
        const vParam = searchParams.get("v") || "";
        const match = vParam.match(/s(\d)(\d{3})(\d{3})?(\d{3})?/); // 修改正則表達式

        if (match) {
          // 正確分割每三個數字
          const numbers = [
            match[2], // 第一組三位數
            match[3], // 第二組三位數
            match[4], // 第三組三位數
          ].filter(Boolean); // 移除 undefined

          console.log("要過濾的編號:", numbers);

          // 過濾資料
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

  // 根據樣式編號選擇不同的樣式
  const getStyle = () => {
    const vParam = searchParams.get("v") || "";
    const styleMatch = vParam.match(/s(\d+)/);
    const styleNumber = styleMatch ? styleMatch[1] : "1";

    switch (styleNumber) {
      case "1":
        return "grid gap-6";
      case "2":
        return "flex flex-wrap gap-6";
      default:
        return "grid gap-6";
    }
  };

  // 修改 URL 參數解析邏輯
  const getUrlInfo = () => {
    const vParam = searchParams.get("v") || "";
    const match = vParam.match(/s(\d+)(\d{3})?(\d{3})?(\d{3})?/);

    if (match) {
      // 解析樣式和項目
      const styleNumber = match[1].charAt(0);
      const numbers = [
        match[1].slice(1).padStart(3, "0"),
        match[2]?.padStart(3, "0"),
        match[3]?.padStart(3, "0"),
      ].filter(Boolean);

      // 增加更多參數解析
      const lang = searchParams.get("lang") || "zh";
      const sort = searchParams.get("sort") || "asc";

      return {
        raw: vParam,
        style: styleNumber,
        numbers: numbers.join(", "),
        lang,
        sort,
      };
    }

    return {
      raw: vParam,
      style: "未指定",
      numbers: "全部",
      lang: "zh",
      sort: "asc",
    };
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* URL 參數資訊區塊 */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">URL 參數資訊</h3>
        <div className="space-y-1 text-sm">
          <p>
            <strong>原始參數:</strong> {getUrlInfo().raw}
          </p>
          <p>
            <strong>樣式編號:</strong> {getUrlInfo().style}
          </p>
          <p>
            <strong>顯示的編號:</strong> {getUrlInfo().numbers}
          </p>
        </div>
      </div>

      {/* 顯示資料筆數 */}
      <div className="mb-4 text-sm text-gray-600">
        找到 {data.length} 筆資料
      </div>

      {/* 資料顯示區塊 */}
      <div className={getStyle()}>
        {data.map((item) => (
          <div key={item.number} className="border rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">
                #{item.formattedNumber}
              </span>
              <h2 className="text-xl font-bold">{item.name_zh}</h2>
            </div>
            <p className="text-gray-600 mb-4">{item.desc_zh}</p>
            {item.videolink && (
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={item.videolink}
                  title={item.name_zh}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-500">
              <p>
                <strong>類別:</strong> {item.category}
              </p>
              <p>
                <strong>地區:</strong> {item.area}
              </p>
              <p>
                <strong>營業時間:</strong> {item.opentime}
              </p>
              {item.etc && (
                <p>
                  <strong>備註:</strong> {item.etc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourComponent;
