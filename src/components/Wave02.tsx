import { motion } from "framer-motion";

const Wave02 = ({
  position,
  sceneStyle,
}: {
  position: string;
  sceneStyle: string;
}) => {
  const transition = {
    duration: 28,
    repeat: Infinity,
    ease: [0.55, 0.5, 0.45, 0.5],
    times: [0, 1],
  };
  return (
    <div
      className={`w-full -bottom-[0] left-0 overflow-hidden  z-50 h-[320px]  md:h-[1000px]    ${position}`}
    >
      <div className="w-[500%] h-[100%] z-0 absolute bottom-0  ">
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-[33%]  "
          animate={{
            translateX: ["-55%", "-0%"],
            y: [0, 15, 0],
          }}
          transition={{
            duration: transition.duration - 10,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -1,
          }}
          style={{
            backgroundImage: "url('./images/wave3_04.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "55% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            backfaceVisibility: "hidden", // 防止渲染問題
            opacity: 0.8,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-[27%]"
          animate={{
            translateX: ["-55%", "-0%"],
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
            backgroundImage: "url('./images/wave3_03.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "55% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.8,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-[20%] "
          animate={{
            translateX: ["-55%", "-0%"],
          }}
          transition={{
            duration: transition.duration - 5,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -3,
          }}
          style={{
            backgroundImage: "url('./images/wave3_02.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "55% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            shapeRendering: "crispEdges", // 防止渲染問題
            opacity: 0.8,
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute -bottom-0"
          animate={{
            translateX: ["-55%", "0%"],
          }}
          transition={{
            duration: transition.duration,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
            delay: -4,
          }}
          style={{
            backgroundImage: `url('./images/w/${sceneStyle}wave3_01.svg')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "55% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            backfaceVisibility: "hidden", // 防止渲染問題
            willChange: "transform", // 優化動畫性能
            imageRendering: "auto", // 改回預設渲染
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-4 "
          animate={{
            translateX: ["-60%", "-0%"],
            y: [0, 5, 0],
          }}
          transition={{
            duration: transition.duration + 3,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
          }}
          style={{
            backgroundImage: "url('./images/header_i05v2.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "30% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
            opacity: 0.7,
            shapeRendering: "crispEdges", // 防止渲染問題
          }}
        />
      </div>
    </div>
  );
};

export default Wave02;
