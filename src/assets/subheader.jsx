import {
    BellIcon,

  } from "@heroicons/react/outline";
  
const Subheader = () => {
    return (
      <header className="flex items-center justify-end mb-6">
        <button className="relative mr-5">
          <BellIcon className="h-6 w-6 hover:text-gray-700" />
          <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
          <img src="" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>
    );
  };

  export default Subheader;