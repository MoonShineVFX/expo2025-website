import { motion } from "framer-motion";

const Wave04 = ({ position }: { position: "relative" | "absolute" }) => {
  const transition = {
    duration: 30,
    repeat: Infinity,
    ease: [0.55, 0.5, 0.45, 0.5],
    times: [0, 1],
  };
  return (
    <div
      className={`w-full -bottom-[0] left-0 overflow-hidden  z-50 h-[350px] md:h-[1000px]   ${
        position === "relative" ? "relative" : "absolute bottom-0 left-0"
      }`}
    >
      <div className="w-[1200%] h-[100%] z-0 absolute bottom-0  ">
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute -bottom-0 "
          animate={{
            translateX: ["-50%", "-0%"],
          }}
          transition={{
            duration: transition.duration - 14,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -4,
          }}
          style={{
            backgroundImage: `url('https://r2.web.moonshine.tw/msweb/expo2025/images/exampleSvg.svg')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "20% auto",
            backgroundPosition: "bottom ",
            imageRendering: "pixelated", // 改善圖片渲染
            backfaceVisibility: "hidden", // 防止渲染問題
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.6,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute -bottom-0 "
          animate={{
            translateX: ["-50%", "-0%"],
          }}
          transition={{
            duration: transition.duration - 9,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -3,
          }}
          style={{
            backgroundImage: `url('https://r2.web.moonshine.tw/msweb/expo2025/images/exampleSvg.svg')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "20% auto",
            backgroundPosition: "bottom ",
            imageRendering: "pixelated", // 改善圖片渲染
            backfaceVisibility: "hidden", // 防止渲染問題
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.6,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute -bottom-0 "
          animate={{
            translateX: ["-50%", "-0%"],
          }}
          transition={{
            duration: transition.duration - 8,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -2,
          }}
          style={{
            backgroundImage: `url('https://r2.web.moonshine.tw/msweb/expo2025 /images/exampleSvg.svg')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "20% auto",
            backgroundPosition: "bottom ",
            imageRendering: "pixelated", // 改善圖片渲染
            backfaceVisibility: "hidden", // 防止渲染問題
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.7,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute -bottom-0 "
          animate={{
            translateX: ["-50%", "-0%"],
          }}
          transition={{
            duration: transition.duration,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -1,
          }}
          style={{
            backgroundImage: `url('https://r2.web.moonshine.tw/msweb/expo2025 /images/exampleSvg.svg')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "20% auto",
            backgroundPosition: "bottom ",
            imageRendering: "pixelated", // 改善圖片渲染
            backfaceVisibility: "hidden", // 防止渲染問題
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.8,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-2 "
          animate={{
            translateX: ["-50%", "-0%"],
            y: [0, 5, 0],
          }}
          transition={{
            duration: transition.duration + 10,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
          }}
          style={{
            backgroundImage:
              "url('https://r2.web.moonshine.tw/msweb/expo2025 /images/header_i05v2.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "18% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
};

export default Wave04;
