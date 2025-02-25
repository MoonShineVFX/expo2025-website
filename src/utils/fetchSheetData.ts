interface ParsedSheetData {
  number: number;
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
  formattedNumber: string;
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
  formattedNumber: string;
}

// 添加一個補零的輔助函數
const padNumber = (num: number): string => {
  return num.toString().padStart(3, "0");
};

export async function fetchSheetData(sheetName: string = "景點文字") {
  const sheetId = "1mKCox7dZSBqQ5izSSFSWf7ZwX7UVbagDTevJe_zd5xY";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
    sheetName
  )}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    // 移除 Google 的 JSON 包裝
    const jsonString = text.substring(47).slice(0, -2);
    const json = JSON.parse(jsonString);

    // 欄位對應表
    const fieldMapping: { [key: string]: keyof ParsedSheetData } = {
      編號: "number",
      類別: "category",
      縣市: "area",
      "名稱(日)": "name_jp",
      "名稱(英)": "name_en",
      "名稱(中)": "name_zh",
      "內文(日)": "desc_jp",
      "內文(英)": "desc_en",
      "內文(中)": "desc_zh",
      影片檔名: "videoname",
      影片連結: "videolink",
      內文路徑: "folder",
      提供營業時間: "opentime",
      備註: "etc",
    };

    // 轉換欄位名稱並解析資料
    const headers = json.table.cols.map((col: { label: string }) => col.label);
    const rows = json.table.rows.map((row: { c: Array<{ v: any }> }) => {
      const parsedRow: Partial<ParsedSheetData> = {};
      headers.forEach((header: string, index: number) => {
        const englishField = fieldMapping[header];
        if (englishField) {
          const value = row.c[index]?.v ?? "";
          // 特別處理編號欄位，轉為數字並補零
          if (englishField === "number") {
            const numValue = Number(value);
            parsedRow[englishField] = numValue; // 保持原始數字型別
            parsedRow["formattedNumber"] = padNumber(numValue); // 新增格式化後的欄位
          } else {
            parsedRow[englishField] = value;
          }
        }
      });
      return parsedRow as ParsedSheetData & { formattedNumber: string };
    });

    // console.log("Parsed Sheet Data:", JSON.stringify(rows, null, 2));
    return rows;
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return [];
  }
}

export async function fetchCategorySheetData() {
  const sheetId = "1npqgrRFUp-TkZetNfYOh3jqpY7ssus-3eImAkUbZCuE";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    // 移除 Google 的 JSON 包裝
    const jsonString = text.substring(47).slice(0, -2);
    const json = JSON.parse(jsonString);

    // 欄位對應表
    const fieldMapping: { [key: string]: keyof CategoryData } = {
      編號: "number",
      類別: "category",
      "名稱(日)": "name_jp",
      "名稱(英)": "name_en",
      "名稱(中)": "name_zh",
    };

    // 轉換欄位名稱並解析資料
    const headers = json.table.cols.map((col: { label: string }) => col.label);
    const rows = json.table.rows.map((row: { c: Array<{ v: any }> }) => {
      const parsedRow: Partial<CategoryData> = {};
      headers.forEach((header: string, index: number) => {
        const englishField = fieldMapping[header];
        if (englishField) {
          const value = row.c[index]?.v ?? "";
          // 特別處理編號欄位，轉為數字並補零
          if (englishField === "number") {
            const numValue = Number(value);
            parsedRow[englishField] = numValue; // 保持原始數字型別
          } else {
            parsedRow[englishField] = value;
          }
        }
      });
      return parsedRow as ParsedSheetData & { formattedNumber: string };
    });

    // console.log("Parsed Sheet Data:", JSON.stringify(rows, null, 2));
    return rows;
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return [];
  }
}

//fetch json api https://r2web.expo2025-techworld-travel.com/data.json
export async function fetchJsonData() {
  const url = "https://r2web.expo2025-techworld-travel.com/data.json";
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

//fetch json api https://r2web.expo2025-techworld-travel.com/xx.json
export async function fetchXXJsonData() {
  const url = "https://r2web.expo2025-techworld-travel.com/xx.json";
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
