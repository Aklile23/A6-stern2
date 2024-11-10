// ComparePCDViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import 'aframe';

interface ComparePCDViewerProps {
  modelUrl: string;
  onClose: () => void;
}

const ComparePCDViewer: React.FC<ComparePCDViewerProps> = ({ modelUrl, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Extract file name and folder-based date from modelUrl
  const fileName = modelUrl.split('/').pop() || 'Unknown File';
  const folderName = modelUrl.split('/')[2] || '';

  // Format date if folderName has the YYYYMMDD format
  const formattedDate =
    folderName.length === 8
      ? `${folderName.slice(0, 4)}-${folderName.slice(4, 6)}-${folderName.slice(6, 8)}`
      : 'Unknown Date';

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={viewerRef} className="w-full h-full relative bg-gray-700 rounded-lg overflow-hidden shadow-lg">
      {/* Display File Name and Date */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md z-999">
        <p className="text-sm text-black dark:text-gray-300">
          Viewing: <span className="font-semibold">{fileName}</span>
          <span className="text-gray-500 dark:text-gray-400"> (Date: {formattedDate})</span>
        </p>
      </div>

      {/* Toolbar Button */}
      <button
        onClick={() => setIsToolbarOpen(!isToolbarOpen)}
        className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 z-999"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isToolbarOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
          />
        </svg>
      </button>

      {/* Toolbar */}
      {isToolbarOpen && (
        <div className="absolute right-1.5 top-12 flex flex-col space-y-4 pt-3 rounded-lg shadow-lg z-999 px-2">
          <button className="bg-primary text-white w-10 h-10 rounded-lg shadow-lg hover:bg-opacity-80 transition">
            Screenshot
          </button>
          <button className="bg-primary text-white w-10 h-10 rounded-lg shadow-lg hover:bg-opacity-80 transition">
            Measure
          </button>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute z-999 top-4 left-4 bg-primary text-white p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 z-999"
      >
        {isFullscreen ? (
          <svg fill="#ffffff" height="24px" width="24px" viewBox="0 0 385.331 385.331">
            <path d="M264.943,156.665h108.273c6.833,0,11.934-5.39,11.934-12.211c0-6.833-5.101-11.85-11.934-11.838h-96.242V36.181c0-6.833-5.197-12.03-12.03-12.03s-12.03,5.197-12.03,12.03v108.273c0,0.036,0.012,0.06,0.012,0.084c0,0.036-0.012,0.06-0.012,0.096C252.913,151.347,258.23,156.677,264.943,156.665z"/>
            <path d="M120.291,24.247c-6.821,0-11.838,5.113-11.838,11.934v96.242H12.03c-6.833,0-12.03,5.197-12.03,12.03c0,6.833,5.197,12.03,12.03,12.03h108.273c0.036,0,0.06-0.012,0.084-0.012c0.036,0,0.06,0.012,0.096,0.012c6.713,0,12.03-5.317,12.03-12.03V36.181C132.514,29.36,127.124,24.259,120.291,24.247z"/>
            <path d="M120.387,228.666H12.115c-6.833,0.012-11.934,5.39-11.934,12.223c0,6.833,5.101,11.85,11.934,11.838h96.242v96.423c0,6.833,5.197,12.03,12.03,12.03c6.833,0,12.03-5.197,12.03-12.03V240.877c0-0.036-0.012-0.06-0.012-0.084c0-0.036,0.012-0.06,0.012-0.096C132.418,233.983,127.1,228.666,120.387,228.666z"/>
            <path d="M373.3,228.666H265.028c-0.036,0-0.06,0.012-0.084,0.012c-0.036,0-0.06-0.012-0.096-0.012c-6.713,0-12.03,5.317-12.03,12.03v108.273c0,6.833,5.39,11.922,12.223,11.934c6.821,0.012,11.838-5.101,11.838-11.922v-96.242H373.3c6.833,0,12.03-5.197,12.03-12.03S380.134,228.678,373.3,228.666z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M4 4h5V2H2v7h2V4zm15 0h-5V2h7v7h-2V4zM4 20h5v2H2v-7h2v5zm15-5h2v7h-7v-2h5z" />
          </svg>
        )}
      </button>

      {/* A-Frame Viewer */}
      <div ref={viewerRef} className="relative flex w-full h-[70vh] bg-gray-700 rounded-lg overflow-hidden shadow-lg">
        <a-scene embedded>
          <a-entity gltf-model={modelUrl} position="0 0 -3" rotation="0 180 0" scale="0.5 0.5 0.5"></a-entity>
          <a-camera></a-camera>
        </a-scene>
      </div>
    </div>
  );
};

export default ComparePCDViewer;
