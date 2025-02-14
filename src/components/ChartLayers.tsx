import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ChartLayersProps {
  pink?: number;
  green?: number;
  blue?: number;
}

const ChartLayers = ({ pink = 0, green = 0, blue = 0 }: ChartLayersProps) => {
  const [animatedPink, setAnimatedPink] = useState(0);
  const [animatedGreen, setAnimatedGreen] = useState(0);
  const [animatedBlue, setAnimatedBlue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPink(pink);
      setAnimatedGreen(green);
      setAnimatedBlue(blue);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pink, green, blue]);

  const generateLayers = (color: string, value: number) => {
    const layers = [];
    const validNumbers = [0, 10, 20, 30, 40, 50, 60, 70, 90, 100];

    for (let i = 0; i < validNumbers.length; i++) {
      const num = validNumbers[i];
      if (num <= value) {
        layers.push(
          <motion.img
            key={`${color}_${num}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: i * 0.2, // 每層延遲 0.2 秒
            }}
            src={`./images/charts/chart_${color}_${num
              .toString()
              .padStart(2, "0")}.png`}
            alt={`${color} ${num}`}
            className="absolute bottom-0 left-0 w-full"
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
      <div className="flex flex-row  absolute bottom-[6.2%] left-[6%] w-[94.5%] h-full ">
        {/* Pink Layers */}
        <div className="absolute bottom-0 left-[0%] w-full">
          {generateLayers("pink", animatedPink)}
        </div>

        {/* Green Layers */}
        <div className="absolute bottom-0 left-[0%] w-full">
          {generateLayers("green", animatedGreen)}
        </div>

        {/* Blue Layers */}
        <div className="absolute bottom-0 left-[0%] w-full">
          {generateLayers("blue", animatedBlue)}
        </div>
      </div>
    </motion.div>
  );
};

export default ChartLayers;
