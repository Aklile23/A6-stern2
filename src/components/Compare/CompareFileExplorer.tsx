import React, { useState } from 'react';
import Thumbnail from '../../components/Thumbnail';
import { FaCalendarAlt } from 'react-icons/fa'; // Import the calendar icon

interface CompareFileExplorerProps {
  selectedDate: string; // Date passed in for this specific view
  onFileSelect: (fileUrl: string) => void; // Function to handle file selection for comparison
  disabledFile: string | null;
  className?: string;
  onBackToCalendar: () => void; // Function to trigger going back to the calendar
}

const CompareFileExplorer: React.FC<CompareFileExplorerProps> = ({ selectedDate, onFileSelect, disabledFile, className, onBackToCalendar }) => {
  const [activeTab, setActiveTab] = useState('images');

  // Sample data for demonstration; replace with actual data as needed
  const thumbnailDataByDate: {
    [date: string]: {
      images?: { src: string; type: "image" }[];
      videos?: { src: string; type: "video" }[];
      pointclouds?: { src: string; type: "pointcloud" }[];
    };
  } = {
    "2024-10-07": {
      images: [
        { src: "/Images/thumbnails/20241007/room02.jpg", type: "image" },
        { src: "/Images/thumbnails/20241007/room03.jpg", type: "image" },
      ],
      pointclouds: [
        { src: "/PCD/20241007/Room 2.glb", type: "pointcloud" },
        { src: "/PCD/20241007/Room 3.glb", type: "pointcloud" },
        
      ],
    },
    "2024-10-09": {
      images: [
        { src: "/Images/thumbnails/20241009/room02.jpg", type: "image" },
        { src: "/Images/thumbnails/20241009/room03.jpg", type: "image" },
        { src: "/Images/thumbnails/20241009/room04.jpg", type: "image" },
        { src: "/Images/thumbnails/20241009/room05.jpg", type: "image" },
        { src: "/Images/thumbnails/20241009/room06.jpg", type: "image" },
      ],
      pointclouds: [
        { src: "/PCD/20241009/Room 2.glb", type: "pointcloud" },
      ],
    },
    "2024-10-11": {
      images: [
        { src: "/Images/thumbnails/20241011/room02.jpg", type: "image" },
        { src: "/Images/thumbnails/20241011/room03.jpg", type: "image" },
        { src: "/Images/thumbnails/20241011/room04.jpg", type: "image" },
        { src: "/Images/thumbnails/20241011/room06.jpg", type: "image" },
      ],
      pointclouds: [
        
      ],
    },
  };

  const thumbnailsForSelectedDate = selectedDate
    ? thumbnailDataByDate[selectedDate] || { images: [], videos: [], pointclouds: [] }
    : { images: [], videos: [], pointclouds: [] };

    const renderThumbnails = (thumbnails: { src: string; type: 'image' | 'video' | 'pointcloud' }[]) => {
      return thumbnails.map((thumbnail, index) => {
        const fileName = thumbnail.src.split('/').pop();
        const hdImagePath = thumbnail.src.replace('/thumbnails/', '/panoramas/');
    
        const isDisabled = thumbnail.src === disabledFile;
    
        return (
          <div
            key={index}
            className={`flex flex-col cursor-pointer ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            onClick={() => {
              if (!isDisabled) {
                if (thumbnail.type === 'pointcloud') {
                  onFileSelect(thumbnail.src);
                } else {
                  onFileSelect(hdImagePath);
                }
              }
            }}
          >
            <Thumbnail src={thumbnail.src} type={thumbnail.type} />
            <p className="text-sm text-center text-gray-600 dark:text-gray-200 mt-2">{fileName}</p>
          </div>
        );
      });
    };
    
      


  const renderContent = () => {
    const thumbnails = activeTab === 'images'
      ? thumbnailsForSelectedDate?.images || []
      : activeTab === 'videos'
        ? thumbnailsForSelectedDate?.videos || []
        : thumbnailsForSelectedDate?.pointclouds || [];
  
    if (thumbnails.length === 0) {
      return <p className="text-center text-bodydark dark:text-gray-400">No files available</p>;
    }
  
    return (
      <div 
        className="grid grid-cols-2 gap-4 mt-4 overflow-y-auto max-h-[550px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" 
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }} // Custom styling for Firefox
      >
        {renderThumbnails(thumbnails)}
      </div>
    );
  };
  

  return (
    <div className={`w-full h-full ${className} bg-white rounded-lg shadow-lg dark:bg-boxdark p-4 relative`}>
      {/* Top Bar with Title and Back Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-black dark:text-white">File Explorer</h1>
        
        {/* Back to Calendar Button with Icon */}
        <button 
          onClick={onBackToCalendar} 
          className="text-gray-300 hover:text-primary transition-transform transform hover:scale-110"
          aria-label="Back to Calendar"
        >
          <FaCalendarAlt size={20} /> {/* Calendar Icon */}
        </button>
      </div>

      {/* Display Selected Date */}
      <p className="text-sm text-gray-400 mb-4">
        Selected Date: <span className="text-white font-semibold">{selectedDate}</span>
      </p>

      {/* Tabs and Thumbnails Content */}
      <div className="rounded-md border border-gray-600 p-2 bg-gray-800 shadow-inner">
        {/* Insert the tabs and file thumbnails here */}
        <div className="flex border-b border-gray-300 dark:border-strokedark">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'images' ? 'border-b-2 border-primary text-primary dark:text-white' : 'text-bodydark1 dark:text-gray-300 hover:text-primary'}`}
            onClick={() => setActiveTab('images')}
          >
            Images
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'videos' ? 'border-b-2 border-primary text-primary dark:text-white' : 'text-bodydark1 dark:text-gray-300 hover:text-primary'}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'pointclouds' ? 'border-b-2 border-primary text-primary dark:text-white' : 'text-bodydark1 dark:text-gray-300 hover:text-primary'}`}
            onClick={() => setActiveTab('pointclouds')}
          >
            Pointcloud Data
          </button>
        </div>

        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CompareFileExplorer;
