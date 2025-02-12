import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const WaveChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.4, // 使線條更平滑
      },
      point: {
        radius: 0, // 隱藏點
      },
    },
  };

  const data = {
    labels: Array.from({ length: 20 }, (_, i) => i.toString()),
    datasets: [
      {
        fill: true,
        data: [0, 10, 30, 50, 70, 90, 100, 90, 70, 50, 30, 10, 0],
        borderColor: "rgba(255, 255, 255, 0.8)",
        backgroundColor: "rgba(255, 182, 193, 0.3)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        fill: true,
        data: [0, 5, 15, 25, 35, 45, 50, 45, 35, 25, 15, 5, 0].map(
          (v) => v + 20
        ),
        borderColor: "rgba(255, 255, 255, 0.8)",
        backgroundColor: "rgba(135, 206, 235, 0.3)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        fill: true,
        data: [0, 3, 8, 15, 20, 25, 30, 25, 20, 15, 8, 3, 0].map((v) => v + 40),
        borderColor: "rgba(255, 255, 255, 0.8)",
        backgroundColor: "rgba(173, 216, 230, 0.3)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="w-full h-[200px]">
      <Line options={options} data={data} />
    </div>
  );
};

export default WaveChart;
