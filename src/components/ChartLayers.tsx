import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ChartLayersProps {
  pink?: string;
  green?: string;
  blue?: string;
}

const ChartLayers = ({
  pink = "00",
  green = "00",
  blue = "00",
}: ChartLayersProps) => {
  const [animatedPink, setAnimatedPink] = useState("00");
  const [animatedGreen, setAnimatedGreen] = useState("00");
  const [animatedBlue, setAnimatedBlue] = useState("00");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPink(pink);
      setAnimatedGreen(green);
      setAnimatedBlue(blue);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pink, green, blue]);

  const generateLayers = (color: string, value: string) => {
    const layers = [];
    const validNumbers = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    // 加入數值解析的日誌
    // console.log(`${color} 原始值:`, value);
    const numValue = parseInt(value);
    // console.log(`${color} 解析後:`, numValue);

    const roundedValue = validNumbers.reduce((prev, curr) => {
      return Math.abs(curr - numValue) < Math.abs(prev - numValue)
        ? curr
        : prev;
    });
    // console.log(`${color} 四捨五入到最近的有效值:`, roundedValue);

    // 定義每個數值對應的深度
    const depthMap: { [key: number]: number } = {
      0: 0,
      10: -1,
      20: -2,
      30: -3,
      40: -4,
      50: -5,
      60: 1,
      70: 2,
      80: 3,
      90: 4,
      100: 5,
    };

    for (let i = 0; i < validNumbers.length; i++) {
      const num = validNumbers[i];
      if (num <= roundedValue) {
        layers.push(
          <motion.img
            key={`${color}_${num}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: i * 0.2,
            }}
            src={`https://r2.web.moonshine.tw/msweb/expo2025/images/charts2/chart_${color}_${num
              .toString()
              .padStart(2, "0")}.svg`}
            alt={`${color} ${num}`}
            className="absolute bottom-0 left-0 w-full"
            style={{ zIndex: depthMap[num] }} // 使用映射的深度值
          />
        );
      }
    }
    return layers;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-row  absolute bottom-[0%] left-[0%] w-[100%] z-0 ">
        {/* Pink Layers */}
        <div className="absolute bottom-0 left-[0%] w-full">
          {generateLayers("pink", animatedPink)}
        </div>

        {/* Green Layers */}
        <div className="absolute bottom-0 left-[0%] w-full">
          {generateLayers("green", animatedGreen)}
        </div>

        {/* Blue Layers */}
        <div className="absolute bottom-0 right-[0%] w-full">
          {generateLayers("blue", animatedBlue)}
        </div>
      </div>
    </motion.div>
  );
};

export default ChartLayers;
