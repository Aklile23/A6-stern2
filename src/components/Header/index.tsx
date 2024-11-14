import DarkModeSwitcher from './DarkModeSwitcher';
import { Link, useNavigate } from 'react-router-dom';

 const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  title?: string;
}) => {

  const navigation = useNavigate();
  return (
    <header className="sticky top-0 z-9999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="hidden sm:block">
          {/* Dynamic Title */}
          <Link to={'/'}>
            <h2 className="text-title-md font-semibold text-black dark:text-white">
              {props.title || "Default Title"}
            </h2>
          </Link>
          
        </div>
        
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <button
              className="mr-5 inline-flex items-center justify-center rounded-md bg-primary py-3 px-10 text-center font-medium text-white hover:scale-105 lg:px-8 xl:px-10"
              onClick={()=> navigation('/compare')}
            >
              Compare
            </button>

            {/* <!-- Dark Mode Toggler --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          {/* <DropdownUser /> */}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
