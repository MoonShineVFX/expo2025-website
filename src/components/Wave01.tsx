import { motion } from "framer-motion";

const Wave01 = () => {
  const transition = {
    duration: 75,
    repeat: Infinity,
    ease: [0.55, 0.5, 0.45, 0.5],
    times: [0, 0.5, 1],
  };
  return (
    <div className="w-full -bottom-[0px] left-0 overflow-hidden absolute z-50 h-[320px]  ">
      <div className="w-[14868px] h-[100%] z-0 absolute bottom-0">
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-10 "
          animate={{
            translateX: ["0%", "-50%"],
            y: [0, 15, 0],
          }}
          transition={{
            duration: transition.duration,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
          }}
          style={{
            backgroundImage: "url('./images/header_i04.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-6 "
          animate={{
            translateX: ["0%", "-50%"],
            y: [0, 45, 0],
          }}
          transition={{
            duration: transition.duration + 10,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
          }}
          style={{
            backgroundImage: "url('./images/header_i03.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-6 "
          animate={{
            translateX: ["0%", "-50%"],
            y: [0, 25, 0],
          }}
          transition={{
            duration: transition.duration + 25,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
          }}
          style={{
            backgroundImage: "url('./images/header_i02.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
          }}
        />
        <motion.div
          className="w-[100%] h-[100%] z-0 absolute -bottom-0 "
          animate={{
            translateX: ["0%", "-50%"],
          }}
          transition={{
            duration: transition.duration,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
          }}
          style={{
            backgroundImage: "url('./images/header_i01.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "15% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
          }}
        />

        <motion.div
          className="w-[100%] h-[100%] z-0 absolute bottom-2 "
          animate={{
            translateX: ["0%", "-50%"],
            y: [0, 5, 0],
          }}
          transition={{
            duration: transition.duration + 10,
            repeat: transition.repeat,
            ease: transition.ease,
            times: transition.times,
          }}
          style={{
            backgroundImage: "url('./images/header_i05.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "14% auto",
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0)", // 開啟硬體加速
          }}
        />
      </div>
    </div>
  );
};

export default Wave01;
