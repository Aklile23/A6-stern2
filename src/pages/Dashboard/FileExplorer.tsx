import React, { useEffect, useState } from 'react';
import { useSelectedDate } from '../../components/selectedDate ';
import Thumbnail from '../../components/Thumbnail';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { getHDImagePath } from '../../utils/pathutils';

// Define types for the data structure
interface Media {
  src: string;
  type: 'image' | 'video' | 'pointcloud';
}

interface RoomData {
  images: Media[];
  videos: Media[];
  pointclouds: Media[];
}

interface DateData {
  [room: string]: RoomData;
}

interface ThumbnailDataByDate {
  [date: string]: {
    rooms: DateData;
  };
}

// Sample data with typed structure
const thumbnailDataByDate: ThumbnailDataByDate = {
  "2024-10-07": {
    rooms: {
      "Room 1": {
        images: [],videos: [],pointclouds: []
      },
      "Room 2": {
        images: [{ src: "/Images/thumbnails/20241007/room02.jpg", type: "image" }, ],
        videos: [],
        pointclouds: [{ src: "/PCD/20241007/room02.glb", type: "pointcloud" }]
      },
      "Room 3": {
        images: [{ src: "/Images/thumbnails/20241007/room03.jpg", type: "image" }, ],
        videos: [],
        pointclouds: [{ src: "/PCD/20241007/room03.glb", type: "pointcloud" }]
      },
      "Room 4": {
        images: [],videos: [],pointclouds: []
      },
      "Room 5": {
        images: [],videos: [],pointclouds: []
      },
      "Room 6": {
        images: [],videos: [],pointclouds: []
      },
    }
  },
  "2024-10-09": {
    rooms: {
      "Room 1": {
        images: [],videos: [],pointclouds: []
      },
      "Room 2": {
        images: [{ src: "/Images/thumbnails/20241009/room02.jpg", type: "image" },],
        videos: [],
        pointclouds: [{ src: "/PCD/20241009/room02.glb", type: "pointcloud" }]
      },
      "Room 3": {
        images: [{ src: "/Images/thumbnails/20241009/room03.jpg", type: "image" }],
        videos: [],
        pointclouds: []
      },
      "Room 4": {
        images: [{ src: "/Images/thumbnails/20241009/room04.jpg", type: "image" },],videos: [],pointclouds: []
      },
      "Room 5": {
        images: [{ src: "/Images/thumbnails/20241009/room05.jpg", type: "image" },],videos: [],pointclouds: []
      },
      "Room 6": {
        images: [{ src: "/Images/thumbnails/20241009/room06.jpg", type: "image" },],videos: [],pointclouds: []
      },
    }
  },
  "2024-10-11": {
    rooms: {
      "Room 1": {
        images: [],videos: [],pointclouds: []
      },
      "Room 2": {
        images: [{ src: "/Images/thumbnails/20241011/room02.jpg", type: "image" },],
        videos: [],
        pointclouds: []
      },
      "Room 3": {
        images: [{ src: "/Images/thumbnails/20241011/room03.jpg", type: "image" }],
        videos: [],
        pointclouds: []
      },
      "Room 4": {
        images: [{ src: "/Images/thumbnails/20241011/room04.jpg", type: "image" },],videos: [],pointclouds: []
      },
      "Room 5": {
        images: [],videos: [],pointclouds: []
      },
      "Room 6": {
        images: [{ src: "/Images/thumbnails/20241011/room06.jpg", type: "image" },],videos: [],pointclouds: []
      },
    }
  },
};

const FileExplorer: React.FC = () => {
  const { selectedDate } = useSelectedDate();
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'pointclouds'>('images');
  const [collapsedRooms, setCollapsedRooms] = useState<{ [room: string]: boolean }>({});
  const navigate = useNavigate();

  const thumbnailsForSelectedDate = selectedDate
    ? thumbnailDataByDate[selectedDate]?.rooms || {}
    : {};

  const toggleRoomCollapse = (room: string) => {
    setCollapsedRooms((prevState) => ({
      ...prevState,
      [room]: !prevState[room],
    }));
  };

  const calculateFileCounts = () => {
    let imageCount = 0;
    let videoCount = 0;
    let pointcloudCount = 0;

    Object.values(thumbnailsForSelectedDate).forEach((room) => {
      imageCount += room.images.length;
      videoCount += room.videos.length;
      pointcloudCount += room.pointclouds.length;
    });

    return { imageCount, videoCount, pointcloudCount };
  };

  const { imageCount, videoCount, pointcloudCount } = calculateFileCounts();

  useEffect(() => {
    const initialCollapsedRooms: { [room: string]: boolean } = {};
    
    // Collapse rooms that have no data for the active tab
    Object.entries(thumbnailsForSelectedDate).forEach(([room, media]) => {
      const hasFiles = (media[activeTab] || []).length > 0;
      initialCollapsedRooms[room] = !hasFiles;  // Set true (collapsed) if no files
    });

    setCollapsedRooms(initialCollapsedRooms);
  }, [activeTab, thumbnailsForSelectedDate]);

  const renderThumbnails = (thumbnails: Media[]) => {
    return (
      <div className="grid grid-cols-2 gap-4"> {/* Add grid layout to control layout and prevent stretching */}
        {thumbnails.map((thumbnail, index) => {
          const fileName = thumbnail.src.split('/').pop();
          const hdImagePath = getHDImagePath(thumbnail.src);
  
          return (
            <div
              key={index}
              className="flex flex-col mb-4 max-w-s" // Constrain width with max-w-xs to avoid stretching
              onClick={() => {
                if (thumbnail.type === 'image') {
                  navigate('/staticViewer', { state: { imageUrl: hdImagePath } });
                } else if (thumbnail.type === 'pointcloud') {
                  navigate('/PCDViewer', { state: { modelUrl: thumbnail.src } });
                }
              }}
            >
              <Thumbnail src={thumbnail.src} type={thumbnail.type} />
              <p className="text-sm text-center text-gray-600 dark:text-gray-200 mt-2">{fileName}</p>
            </div>
          );
        })}
      </div>
    );
  };
  
  

  const renderContent = () => {
    if (Object.keys(thumbnailsForSelectedDate).length === 0) {
      return <p className="text-center text-bodydark dark:text-gray-400">No files available</p>;
    }
  
    return Object.entries(thumbnailsForSelectedDate).map(([room, media]) => (
      <div key={room} className="mb-4">
        <div
          onClick={() => toggleRoomCollapse(room)}
          className="flex items-center cursor-pointer bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-md shadow hover:shadow-lg transition duration-200 ease-in-out"
        >
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex-grow">
            {room}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({(media[activeTab] || []).length})
            </span>
          </h3>
          <svg
            className={`transition-transform duration-200 transform ${collapsedRooms[room] ? '' : 'rotate-90'}`}
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
              fill="currentColor"
            />
          </svg>
        </div>
  
        {/* Collapsible Room Content with Animation */}
        <div
          style={{
            maxHeight: collapsedRooms[room] ? '0px' : '1000px',  // Use a large max-height for smooth transitions
            opacity: collapsedRooms[room] ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 0.5s ease, opacity 0.5s ease',  // Adjust timing as needed
            marginTop: collapsedRooms[room] ? '0px' : '1rem',
          }}
        >
          {(media[activeTab] || []).length > 0 ? (
            renderThumbnails(media[activeTab])
          ) : (
            <p className="text-center text-bodydark dark:text-gray-400 mt-2">
              No {activeTab} available for this room
            </p>
          )}
        </div>
      </div>
    ));
  };
  

  return (
    <>
      <Breadcrumb pageName={`${selectedDate}`} />
      <div className="w-full bg-white rounded-md shadow-default dark:bg-boxdark dark:text-white">
        <div className="p-4 border-b border-gray-300 dark:border-strokedark">
          <h1 className="text-xl font-bold text-black dark:text-white">
            Selected Date: <span className="font-semibold">{selectedDate || 'None'}</span>
          </h1>
          <p className="text-sm text-black dark:text-gray-400 mt-2">
            Images ({imageCount}), Videos ({videoCount}), Pointcloud data ({pointcloudCount})
          </p>
        </div>

        {/* Tab Navigation */}
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
    </>
  );
};

export default FileExplorer;
