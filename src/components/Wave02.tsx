import { motion } from "framer-motion";

const Wave02 = ({ position }: { position: "relative" | "absolute" }) => {
  return (
    <div
      className={`w-full -bottom-[2px] left-0 overflow-hidden  z-50 h-[330px] ${
        position === "relative" ? "relative" : "absolute bottom-0 left-0"
      }`}
    >
      <motion.div
        className="w-[2580px] h-[300px] z-0 absolute bottom-0 "
        animate={{
          x: ["0%", "calc(-100% + 100vw)"],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <img src="./images/wave2_01.svg" alt="logo" className="w-full" />
      </motion.div>
      <motion.div
        className="w-[2580px] h-[310px] absolute bottom-0 -z-[1] "
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
        <img src="./images/wave2_02.svg" alt="logo" className="w-full" />
      </motion.div>
      <motion.div
        className="w-[2580px] h-[320px] absolute bottom-0 -z-[2]"
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
        className="w-[2580px] h-[330px] absolute bottom-0 -z-[3] "
        animate={{
          x: ["0%", "calc(-100% + 100vw)"],
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <img src="./images/wave2_04.svg" alt="logo" className="w-full" />
      </motion.div>
    </div>
  );
};

export default Wave02;
