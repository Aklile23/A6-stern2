import React, { useState, useRef, useEffect } from 'react';
import HomeCalendar from './HomeCalendar';
import ChartAll from '../components/Charts/Overview of data collected/ChartAll';
import ChartLocation from '../components/Charts/Overview of data collected per location/ChartLocation';
import HomeHeader from '../components/Header/HomeHeader';
import { useNavigate } from 'react-router-dom';


const HomePage: React.FC = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [pinnedCalendarPosition, setPinnedCalendarPosition] = useState<{ top: number; left: number } | null>(null);

  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const roomRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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
    e.stopPropagation();
    setPinnedCalendarPosition({ top: e.clientY, left: e.clientX });
    navigate('/projecty', { state: { room } }); // Pass the room as state
  };
  

  const handleOutsideClick = () => {
    setPinnedCalendarPosition(null);
    setCalendarVisible(false);
  };

  const handleScroll = () => {
    setPinnedCalendarPosition(null);
    setCalendarVisible(false);
  };

  useEffect(() => {
    if (pinnedCalendarPosition) {
      setCalendarVisible(false);
    }

    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('scroll', handleScroll);

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
        
        <div className="lg:w-2/3 pr-8 mt-20 ml-13">
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#525f7f] to-black opacity-40 blur-3xl"></div>

          <h1 className="ml-3 text-5xl font-extrabold dark:text-primary text-black mb-7">
            Interactive Floorplan
          </h1>
          <p className="ml-3 text-xl text-gray-600 dark:text-gray-400 mb-7 text-left max-w-3xl">
            Hover over a room to view a calendar and see available data by date. Click on a date to access detailed content, including images, videos, and point cloud data for that room.
          </p>

          {/* <Link to='/projectx' className='z-9999'>
            <button className="bg-primary text-white font-semibold ml-3 py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 mb-6">
              Projects
            </button>
          </Link> */}

          <div className="relative p-4 dark:bg-gray-700 rounded-lg shadow-lg max-w-7xl max-h-[80vh] mb-12 mt-15">
            <img
              src="/Images/floorplan.jpg"
              alt="Floorplan"
              className="rounded-lg w-full h-auto object-contain"
            />

            {/* Colored Hotspots */}
            <div
              ref={roomRef}
              // onMouseEnter={(e) => handleRoomHover(e, 'room1')}
              // onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'room1')}
              className="absolute top-[15%] left-[6.5%] w-[25%] h-[20%] sm:w-[4%] sm:h-[8%] md:w-[3%] md:h-[6%] lg:w-[13%] lg:h-[30%] bg-black bg-opacity-0 hover:bg-opacity-10 cursor-pointer rounded"
              title="Room 1"
            ></div>

            <div
              // onMouseEnter={(e) => handleRoomHover(e, 'room2')}
              // onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'room2')}
              className="absolute top-[15%] left-[20.5%] w-[5%] h-[10%] sm:w-[4%] sm:h-[8%] md:w-[3%] md:h-[6%] lg:w-[10%] lg:h-[30%] bg-black bg-opacity-0 hover:bg-opacity-10 cursor-pointer rounded"
              title="Room 2"
            ></div>

            <div
              // onMouseEnter={(e) => handleRoomHover(e, 'room3')}
              // onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'room3')}
              className="absolute top-[15%] left-[31%] w-[5%] h-[10%] sm:w-[4%] sm:h-[8%] md:w-[3%] md:h-[6%] lg:w-[10.5%] lg:h-[30%] bg-black bg-opacity-0 hover:bg-opacity-10 cursor-pointer rounded"
              title="Room 3"
            ></div>

            <div
              // onMouseEnter={(e) => handleRoomHover(e, 'room4')}
              // onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'room4')}
              className="absolute top-[15%] left-[42.5%] w-[8%] h-[15%] sm:w-[6%] sm:h-[12%] md:w-[5%] md:h-[10%] lg:w-[9.5%] lg:h-[30%] bg-black bg-opacity-0 hover:bg-opacity-10 cursor-pointer rounded"
              title="Room 4"
            ></div>

            <div
              // onMouseEnter={(e) => handleRoomHover(e, 'room5')}
              // onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'room5')}
              className="absolute top-[15%] left-[52.6%] w-[8%] h-[15%] sm:w-[6%] sm:h-[12%] md:w-[5%] md:h-[10%] lg:w-[9%] lg:h-[30%] bg-black bg-opacity-0 hover:bg-opacity-10  cursor-pointer rounded"
              title="Room 5"
            ></div>

            <div
              // onMouseEnter={(e) => handleRoomHover(e, 'room6')}
              // onMouseLeave={handleRoomLeave}
              onClick={(e) => handleRoomClick(e, 'room6')}
              className="absolute top-[35%] left-[70%] w-[10%] h-[20%] sm:w-[8%] sm:h-[15%] md:w-[6%] md:h-[12%] lg:w-[13%] lg:h-[38%] rotate-[124deg] bg-black bg-opacity-0 hover:bg-opacity-10 cursor-pointer rounded"
              title="Room 6"
            ></div>
          </div>
        </div>

        <div className="lg:w-1/3 flex flex-col space-y-5 mr-10">
          <div className="p-6 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <ChartAll />
          </div>
          <div className="p-6 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <ChartLocation hoveredRoom={hoveredRoom} />
          </div>
        </div>
      </div>

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
