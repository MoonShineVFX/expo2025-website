import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  muted?: boolean;
}

const VideoPlayerV2 = ({
  src,
  poster,
  className = "video-js vjs-big-play-centered",
  controls = true,
  muted = true,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // 處理影片結束後的重播邏輯
  const setupEndedHandler = useCallback(() => {
    if (!playerRef.current) return;

    // 移除任何現有的結束事件處理器，避免重複註冊
    playerRef.current.off("ended");

    // 添加新的結束事件處理器
    playerRef.current.on("ended", () => {
      console.log("影片播放結束，3秒後重新播放");

      // 清除任何現有的重播計時器
      if (replayTimerRef.current) {
        clearTimeout(replayTimerRef.current);
      }

      // 只有當影片可見時才設置重新播放計時器
      if (isVisible) {
        replayTimerRef.current = setTimeout(() => {
          console.log("開始重新播放");
          if (playerRef.current) {
            playerRef.current.currentTime(0);
            playerRef.current.play();
          }
          replayTimerRef.current = null;
        }, 3000);
      }
    });
  }, [isVisible]);

  // 初始化播放器 - 只執行一次
  useEffect(() => {
    // 確保Video元素存在
    if (!videoRef.current) return;

    // 初始化播放器
    const player = videojs(
      videoRef.current,
      {
        controls,
        muted,
        fluid: true,
        responsive: true,
        html5: {
          hls: {
            overrideNative: true,
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
        },
        sources: [
          {
            src,
            type: "application/x-mpegURL",
          },
        ],
        poster,
      },
      () => {
        console.log("播放器已準備就緒");
        playerRef.current = player;
        setPlayerReady(true);
      }
    );

    // 清理函數
    return () => {
      // 清除重播計時器
      if (replayTimerRef.current) {
        clearTimeout(replayTimerRef.current);
        replayTimerRef.current = null;
      }

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]); // 只在src變更時重新初始化

  // 當播放器就緒或可見性改變時，設置事件處理器
  useEffect(() => {
    if (playerReady && playerRef.current) {
      setupEndedHandler();

      // 如果可見，開始播放
      if (isVisible) {
        playerRef.current.play();
      }
    }
  }, [playerReady, isVisible, setupEndedHandler]);

  // 處理播放源更新
  useEffect(() => {
    if (playerRef.current && playerReady) {
      playerRef.current.src({
        src,
        type: "application/x-mpegURL",
      });
    }
  }, [src, playerReady]);

  // 處理可見性檢測
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nowVisible = entry.isIntersecting;
          console.log(`視頻 ${nowVisible ? "進入" : "離開"}視圖`);
          setIsVisible(nowVisible);

          // 當播放器已經初始化時才執行播放/暫停
          if (playerRef.current) {
            if (nowVisible) {
              console.log("開始播放視頻");
              playerRef.current.play();
            } else {
              console.log("暫停視頻");
              playerRef.current.pause();

              // 當離開視圖時清除任何待執行的重播計時器
              if (replayTimerRef.current) {
                clearTimeout(replayTimerRef.current);
                replayTimerRef.current = null;
              }
            }
          }
        });
      },
      { threshold: 0.8 }
    );

    observer.observe(containerRef.current);

    // 清理函數
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} data-vjs-player>
      <video ref={videoRef} className={className} playsInline />
    </div>
  );
};

export default VideoPlayerV2;
