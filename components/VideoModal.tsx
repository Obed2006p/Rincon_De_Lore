
import React, { useEffect, useRef, useState } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  startMuted: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc, startMuted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (isOpen && videoElement) {
      // Set initial state when modal opens
      setIsMuted(startMuted);
      videoElement.muted = startMuted;
      setHasEnded(false);

      // Attempt to play
      videoElement.currentTime = 0; // Rewind before playing
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Video autoplay failed:", error);
          // If autoplay with sound fails, fall back to muted.
          // The unmute overlay will then appear for the user.
          if (!videoElement.muted) {
            setIsMuted(true);
            videoElement.muted = true;
            videoElement.play(); // Try playing again, muted.
          }
        });
      }
    } else if (videoElement) {
      videoElement.pause();
    }
  }, [isOpen, startMuted]);

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      // Ensure it plays if it was paused by the browser
      videoRef.current.play();
    }
  };
  
  const handleVideoEnd = () => {
    setHasEnded(true);
  };

  const handleReplay = () => {
    if (videoRef.current) {
      setHasEnded(false);
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md transition-all duration-300 ease-in-out transform animate-slide-in">
      <div className="bg-black rounded-lg shadow-2xl overflow-hidden relative group">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 z-30 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-colors"
          aria-label="Cerrar video"
        >
          <i className="fas fa-times"></i>
        </button>

        {isMuted && !hasEnded && (
          <div 
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-60 cursor-pointer"
            onClick={handleUnmute}
          >
            <div className="text-white text-center p-4">
                <i className="fas fa-volume-mute fa-3x"></i>
                <p className="mt-2 font-semibold">Toca para activar el sonido</p>
            </div>
          </div>
        )}

        {hasEnded && (
          <div 
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-75 cursor-pointer"
            onClick={handleReplay}
          >
            <div className="text-white text-center p-4">
                <i className="fas fa-redo-alt fa-3x"></i>
                <p className="mt-2 font-semibold">Volver a ver</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full"
          src={videoSrc}
          controls
          controlsList="nodownload"
          autoPlay
          muted={startMuted} // The muted attribute is for initial load
          onEnded={handleVideoEnd}
          playsInline
        >
          Tu navegador no soporta la etiqueta de video.
        </video>
      </div>
       <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoModal;
