// 修復後的 VideoPlayer 組件 - 支持多個影片
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactPlayer from "react-player/lazy";

interface VideoPlayerProps {
  videoUrl: string;
  index?: number;
  className?: string;
  poster?: string;
  muted?: boolean;
  controls?: boolean;
}

const VideoPlayerV1 = React.memo(
  ({
    videoUrl,
    index = 0,
    className = "",
    poster = "",
    muted = true,
    controls = false,
  }: VideoPlayerProps) => {
    // 狀態管理
    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [shouldPlay, setShouldPlay] = useState(false);

    // 引用管理
    const playerRef = useRef<ReactPlayer>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 播放器就緒處理
    const handleReady = () => {
      console.log(`視頻 ${index} 已就緒`);
      setIsReady(true);
      setHasError(false);

      if (isVisible) {
        delayedPlay();
      }
    };

    // 錯誤處理
    const handleError = (error: any) => {
      console.error(`視頻 ${index} 錯誤:`, error);
      setHasError(true);
      setIsReady(false);
      setShouldPlay(false);

      if (retryCount < 3) {
        setTimeout(() => {
          console.log(`視頻 ${index} 嘗試重新加載，第 ${retryCount + 1} 次`);
          setRetryCount((prev) => prev + 1);
          if (playerRef.current) {
            playerRef.current.getInternalPlayer()?.load();
          }
        }, 1000);
      }
    };

    // 延遲播放功能
    const delayedPlay = useCallback(() => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }

      playTimerRef.current = setTimeout(() => {
        console.log(`延遲播放視頻 ${index}`);
        setShouldPlay(true);
        playTimerRef.current = null;
      }, 1000);
    }, [index]);

    // 暫停功能
    const pauseVideo = useCallback(() => {
      console.log(`暫停視頻 ${index}`);
      setShouldPlay(false);

      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
    }, [index]);

    // 處理影片結束後暫停3秒再播放
    const handleVideoEnded = () => {
      console.log(`視頻 ${index} 播放完成，3秒後重新播放`);
      setShouldPlay(false);

      if (replayTimerRef.current) {
        clearTimeout(replayTimerRef.current);
      }

      replayTimerRef.current = setTimeout(() => {
        console.log(`視頻 ${index} 重新開始播放`);
        if (playerRef.current) {
          playerRef.current.seekTo(0);
          setShouldPlay(true);
        }
        replayTimerRef.current = null;
      }, 3000);
    };

    // 可見性監控
    useEffect(() => {
      if (!containerRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const nowVisible = entry.isIntersecting;
            console.log(`視頻 ${index} ${nowVisible ? "進入" : "離開"}視圖`);
            setIsVisible(nowVisible);

            if (nowVisible) {
              if (isReady) {
                delayedPlay();
              }
            } else {
              pauseVideo();
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
        if (playTimerRef.current) {
          clearTimeout(playTimerRef.current);
        }
        if (replayTimerRef.current) {
          clearTimeout(replayTimerRef.current);
        }
      };
    }, [index, isReady, delayedPlay, pauseVideo]);

    // 重置機制
    useEffect(() => {
      setRetryCount(0);
      setHasError(false);
      setIsReady(false);
      setShouldPlay(false);

      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }

      if (replayTimerRef.current) {
        clearTimeout(replayTimerRef.current);
        replayTimerRef.current = null;
      }
    }, [videoUrl]);

    // 清理
    useEffect(() => {
      return () => {
        if (playTimerRef.current) {
          clearTimeout(playTimerRef.current);
        }
        if (replayTimerRef.current) {
          clearTimeout(replayTimerRef.current);
        }
        setShouldPlay(false);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="aspect-square w-full p-[6px] mt-4 relative"
        style={{
          backgroundImage: poster
            ? `url(${poster})`
            : `url('./images/video_bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-aos="fade"
        data-aos-duration="1300"
        data-aos-delay="200"
      >
        {/* 加載狀態 */}
        {!isReady && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 錯誤狀態 */}
        {hasError && retryCount >= 3 ? (
          <div className="w-full h-full flex items-center justify-center bg-black/10 z-10">
            <p className="text-white text-sm">視頻無法播放</p>
          </div>
        ) : (
          <div
            className={`w-full h-full ${
              !isReady ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300 ${className}`}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              width="100%"
              height="100%"
              playing={shouldPlay}
              loop={false}
              muted={muted}
              controls={controls}
              playsinline={true}
              onReady={handleReady}
              onError={handleError}
              onBuffer={() => console.log(`視頻 ${index} 緩衝中`)}
              onBufferEnd={() => console.log(`視頻 ${index} 緩衝結束`)}
              onPlay={() => console.log(`視頻 ${index} 開始播放`)}
              onPause={() => console.log(`視頻 ${index} 已暫停`)}
              onEnded={handleVideoEnded}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload nofullscreen noremoteplayback",
                    disablePictureInPicture: true,
                    className: "w-full h-full object-cover shadow-lg",
                  },
                  forceVideo: true,
                },
              }}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    );
  }
);

export default VideoPlayerV1;
