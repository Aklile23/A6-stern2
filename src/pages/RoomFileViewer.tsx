// RoomFileViewer.tsx
import React, { useState, useEffect } from 'react';
import Thumbnail from '../components/Thumbnail';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHDImagePath } from '../utils/pathutils';
import { dataByRoomAndDate } from '../utils/roomData';

interface RoomFileViewerProps {
  room: string;
}

const RoomFileViewer: React.FC<RoomFileViewerProps> = ({ }) => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'pointclouds'>('images');
  const [collapsedDates, setCollapsedDates] = useState<{ [date: string]: boolean }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const room = location.state?.room || 'defaultRoom';
  const roomData = dataByRoomAndDate[room] || {};

  // Calculate total file counts for the current room (across all dates)
  const totalImageCount = Object.values(roomData)
    .flatMap(dateData => dateData.images || [])
    .length;

  const totalVideoCount = Object.values(roomData)
    .flatMap(dateData => dateData.videos || [])
    .length;

  const totalPointcloudCount = Object.values(roomData)
    .flatMap(dateData => dateData.pointclouds || [])
    .length;

  useEffect(() => {
    const initialCollapsedDates: { [date: string]: boolean } = {};
    Object.keys(roomData).forEach((date) => {
      const hasFiles = (roomData[date][activeTab] || []).length > 0;
      initialCollapsedDates[date] = !hasFiles;
    });
    setCollapsedDates(initialCollapsedDates);
  }, [roomData]);

  const toggleCollapse = (date: string) => {
    setCollapsedDates((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  const renderThumbnails = (thumbnails: { src: string; type: 'image' | 'video' | 'pointcloud' }[]) => {
    return thumbnails.map((thumbnail, index) => {
      const fileName = thumbnail.src.split('/').pop();
      const hdImagePath = getHDImagePath(thumbnail.src);

      return (
        <div
          key={index}
          className="flex flex-col"
          onClick={() => {
            if (thumbnail.type === 'image') {
              navigate('/staticViewerRoom', { state: { imageUrl: hdImagePath, room } });
            } else if (thumbnail.type === 'pointcloud') {
              navigate('/PCDViewer', { state: { modelUrl: thumbnail.src } });
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
    const filteredData = Object.keys(roomData).map((date) => ({
      date,
      files: roomData[date][activeTab] || [],
    }));

    return (
      <div className="space-y-4 mt-4">
        {filteredData.map(({ date, files }) => (
          <div key={date}>
            {/* Styled Collapsible Header */}
            <div
              onClick={() => toggleCollapse(date)}
              className="flex items-center cursor-pointer bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-md shadow hover:shadow-lg transition duration-200 ease-in-out"
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex-grow">
                {date}
              </h3>
              <svg
                className={`transition-transform duration-200 transform ${collapsedDates[date] ? '' : 'rotate-90'}`}
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

            {/* Collapsible Content */}
            {!collapsedDates[date] && files.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mt-2">
                {renderThumbnails(files)}
              </div>
            ) : (
              !collapsedDates[date] && (
                <p className="text-center text-bodydark dark:text-gray-400 mt-2">No {activeTab} available for this date</p>
              )
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Breadcrumb pageName={`A6_stern`} />
      <div className="w-full bg-white rounded-md shadow-default dark:bg-boxdark dark:text-white">
        <div className="p-4 border-b border-gray-300 dark:border-strokedark">
        <h1 className="text-xl font-bold text-black dark:text-white">
            {`${room.charAt(0).toUpperCase()}${room.slice(1).replace(/([a-zA-Z]+)(\d+)/, '$1 $2')} Files`}
        </h1>

          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex space-x-1">
            <p>Images ({totalImageCount}),</p>
            <p>Videos ({totalVideoCount}),</p>
            <p>Pointcloud Data ({totalPointcloudCount})</p>
          </div>

        </div>

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

        <div className="p-4">{renderContent()}</div>
      </div>
    </>
  );
};

export default RoomFileViewer;
