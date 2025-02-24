import { useState, useEffect } from "react";

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初始檢查
    checkMobile();

    // 監聽視窗大小變化
    window.addEventListener("resize", checkMobile);

    // 清理監聽
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default useMobile;
