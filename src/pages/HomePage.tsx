import React, { useState, useRef, useEffect } from 'react';
import HomeCalendar from './HomeCalendar';
import { Link } from 'react-router-dom';
import ChartAll from '../components/Charts/Overview of data collected/ChartAll';
import ChartLocation from '../components/Charts/Overview of data collected per location/ChartLocation';
import Header from '../components/Header';
import HomeHeader from '../components/Header/HomeHeader';

const HomePage: React.FC = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [pinnedCalendarPosition, setPinnedCalendarPosition] = useState<{ top: number; left: number } | null>(null);

  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const roomRef = useRef<HTMLDivElement | null>(null);

  const updateCalendarPosition = (top: number, left: number) => {
    if (calendarPosition.top !== top || calendarPosition.left !== left) {
      setCalendarPosition({ top, left });
    }
  };

  const handleRoomHover = (e: React.MouseEvent<HTMLDivElement>, room: string) => {
    if (!pinnedCalendarPosition) {
      setCalendarVisible(true);
      updateCalendarPosition(e.clientY, e.clientX);
    }
    setHoveredRoom(room);
  };

  const handleRoomLeave = () => {
    setHoveredRoom(null);
  };

  const handleRoomClick = (e: React.MouseEvent<HTMLDivElement>, room: string) => {
    setPinnedCalendarPosition({ top: e.clientY, left: e.clientX });
    console.log(`Room clicked: ${room}`);
  };

  const handleOutsideClick = () => {
    setPinnedCalendarPosition(null);
    setCalendarVisible(false);
  };

  // Function to handle scroll and close the calendar
  const handleScroll = () => {
    setPinnedCalendarPosition(null);
    setCalendarVisible(false);
  };

  useEffect(() => {
    if (pinnedCalendarPosition) {
      setCalendarVisible(false);
    }

    // Add event listeners for outside click and scroll
    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listeners on unmount
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pinnedCalendarPosition]);

  return (
    <>
      <HomeHeader sidebarOpen={undefined} setSidebarOpen={function (arg0: boolean): void {
        throw new Error('Function not implemented.');
      }} />

      <div className="relative flex flex-col lg:flex-row items-start justify-between min-h-screen bg-slate-100 dark:bg-black text-white p-8 overflow-hidden">
        
        {/* Left Side Content */}
        <div className="lg:w-2/3 pr-8 mt-20 ml-13">
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#525f7f] to-black opacity-40 blur-3xl"></div>

          {/* Title Section */}
          <h1 className="ml-3 text-5xl font-extrabold dark:text-primary text-black mb-7">
            Interactive Floorplan
          </h1>
          <p className="ml-3 text-xl text-gray-600 dark:text-gray-400 mb-7 text-left max-w-3xl">
            Hover over a room to view a calendar and see available data by date. Click on a date to access detailed content, including images, videos, and point cloud data for that room.
          </p>

          {/* Projects Button */}
          <Link to='/projectx' className='z-9999'>
              <button className="bg-primary text-white font-semibold ml-3 py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 mb-6">
                  Projects
              </button>
          </Link>

          {/* Floorplan Image with Clickable Hotspots */}
          <div className="relative p-4 dark:bg-gray-700 rounded-lg shadow-lg max-w-7xl max-h-[80vh] mb-12">
            <img
              src="/Images/floorplan.jpg"
              alt="Floorplan"
              className="rounded-lg w-full h-full object-contain"
            />

            {/* Hotspots */}
            <div
              ref={roomRef}
              onMouseEnter={(e) => handleRoomHover(e, 'room1')}
              onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'Room 1')}
              className="absolute top-26 left-22 w-39 h-44 bg-transparent cursor-pointer hover:bg-black hover:bg-opacity-20 rounded"
              title="Room 1"
            ></div>

            <div
              onMouseEnter={(e) => handleRoomHover(e, 'room2')}
              onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'Room 2')}
              className="absolute top-26 left-65 w-35 h-46 bg-transparent cursor-pointer hover:bg-black hover:bg-opacity-20 rounded"
              title="Room 2"
            ></div>

            <div
              onMouseEnter={(e) => handleRoomHover(e, 'room3')}
              onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'Room 3')}
              className="absolute top-26 left-100 w-32 h-44 bg-transparent cursor-pointer hover:bg-black hover:bg-opacity-20 rounded"
              title="Room 3"
            ></div>

            <div
              onMouseEnter={(e) => handleRoomHover(e, 'room4')}
              onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'Room 4')}
              className="absolute top-[109px] left-[546px] w-[116px] h-[190px] bg-transparent cursor-pointer hover:bg-black hover:bg-opacity-20 rounded"
              title="Room 4"
            ></div>

            <div
              onMouseEnter={(e) => handleRoomHover(e, 'room5')}
              onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'Room 5')}
              className="absolute top-[109px] left-[675px] w-[110px] h-[180px] bg-transparent cursor-pointer hover:bg-black hover:bg-opacity-20 rounded"
              title="Room 5"
            ></div>

            <div
              onMouseEnter={(e) => handleRoomHover(e, 'room6')}
              onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'Room 6')}
              className="absolute top-[205px] left-[875px] w-[150px] h-[260px] rotate-[124deg] bg-transparent cursor-pointer hover:bg-black hover:bg-opacity-20 rounded"
              title="Room 6"
            ></div>
          </div>
        </div>

        {/* Right Side Charts */}
        <div className="lg:w-1/3 flex flex-col space-y-5 mr-10">
          <div className="p-6 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <ChartAll />
          </div>
          <div className="p-6 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <ChartLocation hoveredRoom={hoveredRoom} />
          </div>
        </div>
      </div>

      {/* Conditional Rendering of Calendar */}
      {(calendarVisible || pinnedCalendarPosition) && (
        <div
          style={{
            position: 'fixed',
            top: pinnedCalendarPosition ? pinnedCalendarPosition.top + 10 : calendarPosition.top + 10,
            left: pinnedCalendarPosition ? pinnedCalendarPosition.left + 10 : calendarPosition.left + 10,
            zIndex: 20,
          }}
          className="bg-gray-700 p-4 rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <HomeCalendar />
        </div>
      )}
    </>
  );
};

export default HomePage;
