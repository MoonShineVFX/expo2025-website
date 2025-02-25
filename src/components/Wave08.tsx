import { motion } from "framer-motion";

const Wave08 = ({
  position,
  sceneStyle,
}: {
  position: string;
  sceneStyle: string;
}) => {
  const transition = {
    duration: 30,
    repeat: Infinity,
    ease: [0.55, 0.5, 0.45, 0.5],
    times: [0, 1],
  };
  return (
    <div
      className={`w-full -bottom-[0] md:bottom-[10%] left-0 overflow-hidden  z-0 h-[450px] md:h-[600px]  ${position}`}
    >
      <div className="w-[1200%] h-[100%] z-0 absolute bottom-0  ">
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-[15%] "
          animate={{
            translateX: ["-1400px", "0%"],
          }}
          transition={{
            duration: transition.duration - 5,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -4,
          }}
          style={{
            backgroundImage: `url('./images/${sceneStyle}desc_wave.svg')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "700px auto",
            backgroundPosition: "bottom ",
            imageRendering: "pixelated", // 改善圖片渲染
            backfaceVisibility: "hidden", // 防止渲染問題
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 1,
          }}
        />
      </div>
    </div>
  );
};

export default Wave08;
