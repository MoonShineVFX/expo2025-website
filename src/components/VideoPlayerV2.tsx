import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";
import "videojs-contrib-quality-levels";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  width?: string | number;
  height?: string | number;
  onReady?: (player: any) => void;
  onError?: (error: any) => void;
}

const VideoPlayerV2 = ({
  src,
  poster,
  className = "video-js vjs-big-play-centered",
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  width = "auto",
  height = "auto",
  onReady,
  onError,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  console.log("src", src);

  useEffect(() => {
    // 確保Video元素存在
    if (!videoRef.current) return;

    // 初始化播放器
    const player = videojs(
      videoRef.current,
      {
        controls,
        autoplay,
        muted,
        loop: false, // 關閉內建的循環播放，我們自己實現
        fluid: true,
        responsive: true,
        html5: {
          hls: {
            overrideNative: true,
            enableLowInitialPlaylist: true,
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
        },
        sources: [
          {
            src,
            type: src.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4",
          },
        ],
        poster,
      },
      () => {
        console.log("播放器已準備就緒");
        playerRef.current = player;

        // 呼叫onReady回調（如果有提供）
        if (onReady) {
          onReady(player);
        }
      }
    );

    // 處理錯誤
    player.on("error", (error: any) => {
      console.error("播放器錯誤:", error);
      if (onError) {
        onError(error);
      }
    });

    // 處理影片結束事件
    player.on("ended", () => {
      console.log("影片播放結束，將在3秒後重新播放");

      // 清除任何現有的重播計時器
      if (replayTimerRef.current) {
        clearTimeout(replayTimerRef.current);
      }

      // 設置3秒後重新播放
      if (loop) {
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

    // 清理函數
    return () => {
      // 清除重播計時器
      if (replayTimerRef.current) {
        clearTimeout(replayTimerRef.current);
      }

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, controls, autoplay, muted, loop, onReady, onError]);

  // 當源URL改變時更新播放器源
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src({
        src,
        type: src.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4",
      });
    }
  }, [src]);

  return (
    <div data-vjs-player style={{ width, height }}>
      <video ref={videoRef} className={className} playsInline />
    </div>
  );
};

export default VideoPlayerV2;
