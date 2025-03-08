import { PhoneIcon, FolderAddIcon } from "@heroicons/react/outline";
import { IoIosSend } from "react-icons/io";
import Sidebar from "./assets/sidebar";
import Subheader from "./assets/subheader";
const Chat = () => {
  const contacts = [
    { name: "Rabi", status: "Available", img: "/profile.jpg" },
    { name: "Hina", status: "Available", img: "/profile.jpg" },
    { name: "Mina", status: "Available", img: "/profile.jpg" },
    { name: "Gina", status: "Available", img: "/profile.jpg" },
    { name: "Rusi", status: "Available", img: "/profile.jpg" },
    { name: "Rani", status: "Available", img: "/profile.jpg" },
  ];

  return (
    <div className="w-screen flex">
       
      <Sidebar />
     
      <div className="w-[254px] h-screen bg-secondary p-4">
        {/* Profile Section */}
        <div className="flex items-center my-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-500">
            <img
              src="/profile.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl">Ngima</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>

        <hr className="my-2 border border-gray" />
        <div className="ml-1 mt-7">
          <div className="text-primary text-lg">Messages</div>
        </div>
        {/* Contact List */}
        {contacts.map(({ name, status, img }) => (
          <div
            key={name}
            className="flex items-center py-8 border-b border-[#B5B5B5]"
          >
            <div className="cursor-pointer flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-500">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-sm font-light text-[#B5B5B5]">{status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat Section */}
      <div className="w-[75%] h-screen bg-white flex-col flex items-center">
        <div className="w-[75%] bg-secondary h-[82px] mt-14 rounded-full flex items-center px-14">
          <div className=" cursor-pointer w-12 h-12 rounded-full overflow-hidden border-2 border-gray-500">
            <img
              src="/profile.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-5 mr-auto">
            <h3 className="text-lg">Aasha</h3>
            <p className="text-sm font-light text-[#B5B5B5]">online</p>
          </div>
          <div className="cursor-pointer">
            <PhoneIcon className="h-6 w-6 " />
          </div>
        </div>
        <div className="h-[75%] border border-gray w-full overflow-hidden hover:overflow-scroll mt-5">
          <div className="h-[1000px] px-10 py-14">
            <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4">
              Lorem ipsum is simply a dummy text of the printing and
              typescruipting industry.
            </div>
            <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white">
              Lorem ipsum is simply a dummy text.
            </div>
            <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4">
              Lorem ipsum is simply a dummy text of the printing and
              typescruipting industry.
            </div>
            <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white">
              Lorem ipsum is simply a dummy text.
            </div>
            <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4">
              Lorem ipsum is simply a dummy text of the printing and
              typescruipting industry.
            </div>
            <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white">
              Lorem ipsum is simply a dummy text.
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start">
          <div className=" w-full mt-7 ml-3 flex items-center bg-secondary rounded-full shadow-md px-4">
            {/* Input Field */}
            <input
              placeholder="Type a message.."
              className="w-full p-4 border-0 bg-secondary focus:ring-0 focus:border-0 outline-none"
            />
            <div className="flex space-x-3">
              <div className="cursor-pointer">
                <FolderAddIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="cursor-pointer">
                <IoIosSend className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[25%] h-screen"></div>
    </div>
  );
};

export default Chat;