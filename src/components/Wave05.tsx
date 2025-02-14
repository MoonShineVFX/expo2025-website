import { motion } from "framer-motion";

const Wave05 = ({ position }: { position: string }) => {
  const transition = {
    duration: 30,
    repeat: Infinity,
    ease: [0.55, 0.5, 0.45, 0.5],
    times: [0, 1],
  };
  return (
    <div
      className={`w-full -bottom-[0] left-0 overflow-hidden  z-50 h-[450px] md:h-[1000px]   ${position}`}
    >
      <div className="w-[1200%] h-[100%] z-0 absolute bottom-0  ">
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute -bottom-0 "
          animate={{
            translateX: ["-60%", "-0%"],
          }}
          transition={{
            duration: transition.duration,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -1,
          }}
          style={{
            backgroundImage: `url('./images/footer_wave01.svg')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom ",
            imageRendering: "pixelated", // 改善圖片渲染
            backfaceVisibility: "hidden", // 防止渲染問題
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
          }}
        />
      </div>
    </div>
  );
};

export default Wave05;
