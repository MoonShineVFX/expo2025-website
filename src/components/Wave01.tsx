import { motion } from "framer-motion";

const Wave01 = () => {
  return (
    <div className="w-full -bottom-[2px] left-0 overflow-hidden absolute z-50 h-[250px] ">
      <motion.div
        className="w-[3000px] h-[195px] z-0 absolute bottom-0 "
        animate={{
          x: ["0%", "calc(-100% + 100vw)"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <img src="./images/header_i01.svg" alt="logo" className="w-full" />
      </motion.div>
      <motion.div
        className="w-[3000px] h-[195px] absolute bottom-0 -z-[1] "
        animate={{
          x: ["0%", "calc(-100% + 100vw)"],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <img src="./images/header_i02.svg" alt="logo" className="w-full" />
      </motion.div>
      <motion.div
        className="w-[3000px] h-[215px] absolute bottom-0 -z-[2]"
        animate={{
          x: ["0%", "calc(-100% + 100vw)"],
        }}
        transition={{
          duration: 75,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <img src="./images/header_i03.svg" alt="logo" className="w-full" />
      </motion.div>
      <motion.div
        className="w-[3000px] h-[210px] absolute bottom-0 -z-[3] "
        animate={{
          x: ["0%", "calc(-100% + 100vw)"],
        }}
        transition={{
          duration: 65,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <img src="./images/header_i04.svg" alt="logo" className="w-full" />
      </motion.div>
      <motion.div
        className="w-[3000px] h-[120px] absolute bottom-0 z-[1]"
        animate={{
          x: ["0%", "calc(-100% + 100vw)"],
        }}
        transition={{
          duration: 85,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <img src="./images/header_i05.svg" alt="logo" className="w-full" />
      </motion.div>
    </div>
  );
};

export default Wave01;
