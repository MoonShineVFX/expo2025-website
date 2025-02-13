interface ChartLayersProps {
  pink?: number;
  green?: number;
  blue?: number;
}

const ChartLayers = ({ pink = 0, green = 0, blue = 0 }: ChartLayersProps) => {
  // 生成圖層陣列的函數
  const generateLayers = (color: string, value: number) => {
    const layers = [];
    for (let i = 10; i <= value; i += 10) {
      layers.push(
        <img
          key={`${color}_${i}`}
          src={`./images/charts/chart_${color}_${i}.png`}
          alt={`${color} ${i}`}
          className="absolute bottom-0 left-0 w-full"
        />
      );
    }
    return layers;
  };

  return (
    <div className="flex flex-row gap-2 absolute bottom-0 left-[0 w-full h-full">
      {/* Pink Layers */}
      <div className="absolute bottom-0 left-[4%] w-full">
        {generateLayers("pink", pink)}
      </div>

      {/* Green Layers */}
      <div className="absolute bottom-0 left-[3%] w-full">
        {generateLayers("green", green)}
      </div>

      {/* Blue Layers */}
      <div className="absolute bottom-0 left-[2%] w-full">
        {generateLayers("blue", blue)}
      </div>
    </div>
  );
};

export default ChartLayers;
