import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHDImagePath } from '../utils/pathutils';
import { FaCalendarAlt, FaDoorOpen } from 'react-icons/fa';

// Define a type for the file structure
type MediaFiles = {
  images?: string[];
  videos?: string[];
  pointclouds?: string[];
};

// Existing date-based file tree data
const fileTreeData: Record<string, MediaFiles> = {
  "2024-10-07": {
    images: ["room02.jpg", "room03.jpg"],
    pointclouds: ["Room 2.glb", "Room 3.glb"]
  },
  "2024-10-09": {
    images: ["room02.jpg", "room03.jpg", "room04.jpg", "room05.jpg", "room06.jpg"],
    pointclouds: ["Room 2.glb"]
  },
  "2024-10-11": {
    images: ["room02.jpg", "room03.jpg", "room04.jpg", "room06.jpg"],
    pointclouds: ["room02.e57"]
  }
};

// New room-based file tree data
const fileTreeDataByRoom: Record<string, Record<string, MediaFiles>> = {
  "Room 1": {
    "2024-10-07": {images: [], pointclouds: [] },"2024-10-09": {images: [], pointclouds: [] },"2024-10-11": {images: [], pointclouds: [] },},
  "Room 2": {
    "2024-10-07": {
      images: ["room02.jpg",],
      pointclouds: ["Room 2.glb"]
    },
    "2024-10-09": {
      images: ["room02.jpg"],
      pointclouds: ["Room 2.glb"]
    },
    "2024-10-11": {
      images: ["room02.jpg"],
      pointclouds: []
    }
  },
  "Room 3": {
    "2024-10-07": {
      images: ["room03.jpg",],
      pointclouds: ["Room 3.glb"]
    },
    "2024-10-09": {
      images: ["room03.jpg"],
      pointclouds: []
    },
    "2024-10-11": {
      images: ["room03.jpg"],
      pointclouds: []
    }
  },
  "Room 4": {
    "2024-10-07": {images: [], pointclouds: [] },
    "2024-10-09": {
      images: ["room04.jpg"],
      pointclouds: []
    },
    "2024-10-11": {
      images: ["room04.jpg"],
      pointclouds: []
    }
  },
  "Room 5": {
    "2024-10-07": {images: [], pointclouds: [] },
    "2024-10-09": {
      images: ["room05.jpg"],
      pointclouds: []
    },
    "2024-10-11": {images: [], pointclouds: [] },
  },
  "Room 6": {
    "2024-10-07": {images: [], pointclouds: [] },
    "2024-10-09": {
      images: ["room06.jpg"],
      pointclouds: []
    },
    "2024-10-11": {
      images: ["room06.jpg"],
      pointclouds: []
    }
  },
  // Continue similarly for other rooms
};

  const FileTree: React.FC = () => {
    const [fileTreeOpen, setFileTreeOpen] = useState<{ [key: string]: boolean }>({});
    const navigate = useNavigate();
  
    const toggleNode = (key: string) => {
      setFileTreeOpen((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

  return (
    <div className="text-[#f5f5f7] rounded-lg w-full overflow-y-auto max-h-[550px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
         style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
      
      <h2
        onClick={() => setFileTreeOpen((prev) => ({ ...prev, fileTree: !prev.fileTree }))}
        className="flex items-center font-bold text-lg cursor-pointer px-4 py-2 transition-colors duration-200 hover:text-primary"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4a1 1 0 0 1 1-1h6.236a1 1 0 0 1 .707.293l1.414 1.414H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z" />
        </svg>
        File Tree
      </h2>

      {fileTreeOpen.fileTree && (
        <div className="ml-4">

          {/* Date Based Section */}
          <h3
            onClick={() => toggleNode('dateBased')}
            className="flex items-center font-semibold text-md cursor-pointer px-4 py-2 transition-colors duration-200 hover:text-primary"
          >
            <FaCalendarAlt className="mr-2" /> Date Based
          </h3>
          {fileTreeOpen.dateBased && (
            <div className="ml-4">
              {Object.keys(fileTreeData).map((date) => (
                <div key={date} className="mb-2">
                  <div
                    onClick={() => toggleNode(date)}
                    className="flex items-center cursor-pointer text-sm text-white hover:text-primary transition-colors duration-200 pl-4"
                  >
                    <svg
                      className={`transform transition-transform duration-200 mr-2 ${fileTreeOpen[date] ? 'rotate-90' : 'rotate-0'}`}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 4a1 1 0 0 1 1-1h6.236a1 1 0 0 1 .707.293l1.414 1.414H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                    </svg>
                    <span className="font-medium">{date}</span>
                  </div>

                  {fileTreeOpen[date] && (
                    <div className="ml-4 mt-2 border-l border-gray-600 pl-4">
                      {Object.entries(fileTreeData[date]!).map(([type, files]) => (
                        <div key={type} className="mt-3">
                          <span className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                          <ul className="ml-4 space-y-1">
                            {files!.map((file, index) => {
                              const formattedDate = date.replace(/-/g, '');
                              const filePath = type === "pointclouds"
                                ? `/PCD/${formattedDate}/${file}`
                                : `/Images/thumbnails/${formattedDate}/${file}`;

                              return (
                                <li key={index} className="flex items-center text-sm text-gray-300 hover:text-primary transition-colors duration-150">
                                  {type === "images" ? (
                                    <>
                                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 1 2-2zm-9-8l3.5 4.5H8l2.5-3z" />
                                      </svg>
                                      <button
                                        onClick={() => navigate('/staticViewer', { state: { imageUrl: getHDImagePath(filePath) } })}
                                        className="text-sm text-gray-300 hover:text-primary transition-colors duration-150"
                                      >
                                        {file}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm2-6h-4v-4h4zm-2 2a6.61 6.61 0 0 0 3.66-1.18l1.07 1.07A7.93 7.93 0 0 1 12 20a7.93 7.93 0 0 1-4.73-1.61l1.07-1.07A6.61 6.61 0 0 0 12 16z" />
                                      </svg>
                                      <button
                                        onClick={() => navigate('/PCDViewer', { state: { modelUrl: filePath } })}
                                        className="text-sm text-gray-300 hover:text-primary transition-colors duration-150"
                                      >
                                        {file}
                                      </button>
                                    </>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

{/* Room Based Section */}
<h3
        onClick={() => toggleNode('roomBased')}
        className="flex items-center font-semibold text-md cursor-pointer px-4 py-2 transition-colors duration-200 hover:text-primary"
      >
        <FaDoorOpen className="mr-2" /> Room Based
      </h3>

      {fileTreeOpen.roomBased && (
        <div className="ml-4">
          {Object.keys(fileTreeDataByRoom).map((room) => (
            <div key={room} className="mb-2">
              {/* Room Level */}
              <div
                onClick={() => toggleNode(room)}
                className="flex items-center cursor-pointer text-sm text-white hover:text-primary transition-colors duration-200 pl-4"
              >
                <svg
                  className={`transform transition-transform duration-200 mr-2 ${fileTreeOpen[room] ? 'rotate-90' : 'rotate-0'}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 4a1 1 0 0 1 1-1h6.236a1 1 0 0 1 .707.293l1.414 1.414H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                </svg>
                <span className="font-medium">{room}</span>
              </div>

              {fileTreeOpen[room] && (
                <div className="ml-4 mt-2 border-l border-gray-600 pl-4">
                  {Object.keys(fileTreeDataByRoom[room]!).map((date) => (
                    <div key={date} className="mb-2">
                      {/* Date Level */}
                      <div
                        onClick={() => toggleNode(`${room}-${date}`)}
                        className="flex items-center cursor-pointer text-sm text-gray-300 hover:text-primary transition-colors duration-200 pl-4"
                      >
                        <svg
                          className={`transform transition-transform duration-200 mr-2 ${fileTreeOpen[`${room}-${date}`] ? 'rotate-90' : 'rotate-0'}`}
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M3 4a1 1 0 0 1 1-1h6.236a1 1 0 0 1 .707.293l1.414 1.414H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                        </svg>
                        <span className="font-medium">{date}</span>
                      </div>

                      {fileTreeOpen[`${room}-${date}`] && (
                        <div className="ml-4 mt-2 border-l border-gray-600 pl-4">
                          {Object.entries(fileTreeDataByRoom[room]![date]!).map(([type, files]) => (
                            <div key={type} className="mt-3">
                              {/* File Type Level */}
                              <div
                                onClick={() =>
                                  toggleNode(`${room}-${date}-${type}`)
                                }
                                className="flex items-center cursor-pointer text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide hover:text-primary transition duration-200"
                              >
                                <svg
                                  className={`transform transition-transform duration-200 mr-2 ${fileTreeOpen[`${room}-${date}-${type}`] ? 'rotate-90' : 'rotate-0'}`}
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M3 4a1 1 0 0 1 1-1h6.236a1 1 0 0 1 .707.293l1.414 1.414H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                                </svg>
                                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                              </div>

                              {fileTreeOpen[`${room}-${date}-${type}`] && (
                                <ul className="ml-4 space-y-1">
                                  {files!.map((file, index) => {
                                    const formattedDate = date.replace(/-/g, '');
                                    const filePath = type === "pointclouds"
                                      ? `/PCD/${room.replace(' ', '')}/${formattedDate}/${file}`
                                      : `/Images/thumbnails/${room.replace(' ', '')}/${formattedDate}/${file}`;

                                    return (
                                      <li key={index} className="flex items-center text-sm text-gray-300 hover:text-primary transition-colors duration-150">
                                        {type === "images" ? (
                                          <>
                                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                              <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 1 2-2zm-9-8l3.5 4.5H8l2.5-3z" />
                                            </svg>
                                            <button
                                              onClick={() => navigate('/staticViewer', { state: { imageUrl: getHDImagePath(filePath) } })}
                                              className="text-sm text-gray-300 hover:text-primary transition-colors duration-150"
                                            >
                                              {file}
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm2-6h-4v-4h4zm-2 2a6.61 6.61 0 0 0 3.66-1.18l1.07 1.07A7.93 7.93 0 0 1 12 20a7.93 7.93 0 0 1-4.73-1.61l1.07-1.07A6.61 6.61 0 0 0 12 16z" />
                                            </svg>
                                            <button
                                              onClick={() => navigate('/PCDViewer', { state: { modelUrl: filePath } })}
                                              className="text-sm text-gray-300 hover:text-primary transition-colors duration-150"
                                            >
                                              {file}
                                            </button>
                                          </>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default FileTree;