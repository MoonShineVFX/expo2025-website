import { motion } from "framer-motion";

const Wave06 = ({
  position,
  sceneStyle,
}: {
  position: "relative" | "absolute";
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
      className={`w-full -bottom-[0] left-0 overflow-hidden  z-50 h-[450px] md:h-[1000px]  ${
        position === "relative" ? "relative" : "absolute bottom-0 left-0"
      }`}
    >
      <div className="w-[1200%] h-[100%] z-0 absolute bottom-0  ">
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-[20%] "
          animate={{
            translateX: ["-60%", "-0%"],
            y: [0, 15, 0],
          }}
          transition={{
            duration: transition.duration - 14,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -1,
          }}
          style={{
            backgroundImage: "url('./images/wave4_04.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.6,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-[15%]"
          animate={{
            translateX: ["-60%", "-0%"],
            y: [0, 15, 0],
          }}
          transition={{
            duration: transition.duration - 9,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -2,
          }}
          style={{
            backgroundImage: "url('./images/wave4_03.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.6,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-[10%] "
          animate={{
            translateX: ["-60%", "-0%"],
          }}
          transition={{
            duration: transition.duration - 8,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -3,
          }}
          style={{
            backgroundImage: "url('./images/wave4_02.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.7,
          }}
        />
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
            delay: -4,
          }}
          style={{
            backgroundImage: `url('./images/${sceneStyle}wave4_01.svg')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom ",
            imageRendering: "pixelated", // 改善圖片渲染
            backfaceVisibility: "hidden", // 防止渲染問題
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 1,
          }}
        />
      </div>
      <div className="absolute bottom-[25%] left-0 w-[30%] z-10 ">
        <img
          src={`./images/${sceneStyle}icon01.png`}
          alt=""
          className="w-full max-w-full"
          data-aos="fade"
          data-aos-duration="1300"
          data-aos-delay="200"
        />
      </div>
    </div>
  );
};

export default Wave06;
