import React, { useState, useRef } from "react";

interface DownloadButtonProps {
  videoUrl: string;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  videoUrl,
  fileName,
}) => {
  // 在元件內部維護自己的下載狀態，不影響父元件
  const [isDownloading, setIsDownloading] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const downloadVideo = () => {
    let corsanywhere = "https://mscors-anywhwere.kilokingw.workers.dev/?";

    // 設置本地下載狀態
    setIsDownloading(true);

    // 使用 Web Worker 在後台線程中處理下載
    if (window.Worker) {
      // 創建一個 Blob，包含 Worker 代碼
      const workerCode = `
        self.onmessage = function(e) {
          const { url, corsUrl } = e.data;
          
          // 使用 fetch 獲取視頻
          fetch(corsUrl + url)
            .then(response => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.blob();
            })
            .then(blob => {
              // 將 blob 發送回主線程
              self.postMessage({ status: 'success', blob: blob });
            })
            .catch(error => {
              self.postMessage({ status: 'error', message: error.message });
            });
        };
      `;

      const workerBlob = new Blob([workerCode], {
        type: "application/javascript",
      });
      const workerUrl = URL.createObjectURL(workerBlob);
      const worker = new Worker(workerUrl);
      workerRef.current = worker;

      // 監聽 Worker 的消息
      worker.onmessage = function (e) {
        const { status, blob, message } = e.data;

        if (status === "success" && blob) {
          const videoBlob = new Blob([blob], { type: "video/mp4" });
          const downloadUrl = window.URL.createObjectURL(videoBlob);

          // 創建下載鏈接
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);

          // 觸發下載
          link.click();

          // 清理資源
          setTimeout(() => {
            if (link.parentNode) {
              link.parentNode.removeChild(link);
            }
            window.URL.revokeObjectURL(downloadUrl);
            window.URL.revokeObjectURL(workerUrl);

            // 終止 Worker
            worker.terminate();
            workerRef.current = null;

            // 重置下載狀態
            setIsDownloading(false);
            console.log("下載完成，已清理資源");
          }, 1000);
        } else {
          console.error("Worker 錯誤:", message);
          window.URL.revokeObjectURL(workerUrl);
          worker.terminate();
          workerRef.current = null;
          setIsDownloading(false);
        }
      };

      // 發送消息給 Worker 開始下載
      worker.postMessage({ url: videoUrl, corsUrl: corsanywhere });

      // 設置超時
      timeoutRef.current = setTimeout(() => {
        console.log("下載超時，重置狀態");
        if (workerRef.current) {
          window.URL.revokeObjectURL(workerUrl);
          workerRef.current.terminate();
          workerRef.current = null;
        }
        setIsDownloading(false);
      }, 30000);
    } else {
      // 瀏覽器不支持 Web Worker，使用原始方法
      console.log("瀏覽器不支持 Web Worker，使用標準方法下載");

      // 在下載開始前先設置計時器恢復按鈕狀態
      setTimeout(() => {
        setIsDownloading(false);
      }, 1500);

      fetch(corsanywhere + videoUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const videoBlob = new Blob([blob], { type: "video/mp4" });
          const downloadUrl = window.URL.createObjectURL(videoBlob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            if (link.parentNode) {
              link.parentNode.removeChild(link);
            }
            window.URL.revokeObjectURL(downloadUrl);
          }, 1000);
        })
        .catch((err) => {
          console.error("Error downloading video:", err);
          setIsDownloading(false);
        });
    }
  };

  // 組件卸載時清理資源
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <div className="w-full mt-4 md:mt-auto h-12 flex items-center justify-center">
      {isDownloading ? (
        <div className="w-[35px] h-[35px] rounded-full border-2 border-gray-300 border-t-[#5AB9F1] animate-spin"></div>
      ) : (
        <img
          src="https://r2.web.moonshine.tw/msweb/expo2025/images/dlbtn.png"
          alt="下載"
          className="w-[35px] cursor-pointer"
          onClick={downloadVideo}
        />
      )}
    </div>
  );
};

export default DownloadButton;
