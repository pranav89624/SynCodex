import {  useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, ClipboardList, UserRound, Bell, UserPlus, X, Pencil, Trash} from "lucide-react";
import UserAvatar from "../components/userAvatar";
import ToggleButton from "../components/toggleButton";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [Box, setBox] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    toast.success("Logged out!");
    navigate("/");
  };

  const CustomButton = ({ children, onClick, className }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleBox = () => {
    setBox(!Box);
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
  
    window.addEventListener("resize", handleResize);
    handleResize();
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);


   const [userName, setUserName] = useState("");
  
    useEffect(() => {
      const storedName =localStorage.getItem("name");
      if (storedName) {
        setUserName(storedName);
      }
    }, []);
    const avatarUrl = `https://robohash.org/${userName}?set=set5&size=50x50`;   

  return (
    <>
      <div className="flex h-screen bg-[#21232f] text-white">
        
        {/* Sidebar */} 
        <aside className={`${
              isSidebarOpen ? "w-64 " : "hidden"
          } p-4 bg-[#21232f] flex flex-col justify-between border-r border-[#e4e6f3ab]`}>
          <div>
            

            <h1 className="text-[48px] font-semibold font-Chakra font-gradient">SynCodex</h1>

            <UserAvatar />

            <nav className="mt-6 space-y-2">
              <CustomButton
                className={`w-full flex items-center justify-center cursor-pointer text-xl ${activeTab === "sessions" ? "bg-[#3D415A]" : "bg-[#21232f] hover:bg-[#3D415A]"}`}
                onClick={() => setActiveTab("sessions")}
              >
                <ClipboardList size={25} className="mr-2" />Activities
              </CustomButton>
              <CustomButton
                className={`w-full flex items-center justify-center cursor-pointer text-xl ${activeTab === "account" ? "bg-[#3D415A]" : "bg-[#21232f] hover:bg-[#3D415A]"}`}
                onClick={() => setActiveTab("account")}
              >
                <UserRound size={25} className="mr-2" />Account
              </CustomButton>
              <CustomButton className="w-full flex items-center justify-center text-xl  text-red-400 hover:bg-[#3D415A] cursor-pointer"
                  onClick={handleLogout}
              >
                  <LogOut size={25} className="mr-2" /> Logout
              </CustomButton>
            </nav>
          </div>
          
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          
          {/* Top Bar */}
          <div className="flex items-center py-5  border-b border-[#e4e6f3ab] max-md:justify-between sticky top-0 bg-[#21232f]">
              <CustomButton
                  onClick={toggleSidebar}
                  className="p-3 ml-2 bg-[#3D415A] text-white cursor-pointer text-lg max-md:hidden"
              >
                  ☰
              </CustomButton>
              <h1 className="text-[48px] font-semibold font-Chakra font-gradient ml-2 md:hidden w-[60%]">SynCodex</h1>   
              <div className="w-full flex justify-center items-center max-md:hidden">
                  <Search className="relative cursor-pointer left-7 text-white" size={18} />
                  <input
                  type="text"
                  placeholder="Search project or session..."
                  className="w-[40%] bg-[#3D415A] placeholder-[#E4E6F3] text-white pl-10 pr-3 py-2 rounded-md focus:outline-none"
                  />
              </div>
              <CustomButton className="text-white bg-[#3D415A] mr-2 cursor-pointer"><Bell size={25} /></CustomButton>
              <img src={avatarUrl} alt={userName} className="w-10 h-10 rounded-full md:hidden mr-3" onClick={toggleBox} />
              <div className={`${
              Box ? "" : "hidden"
              } p-4 bg-[#21232f] flex flex-col shadow-xl rounded-xl justify-between absolute top-25 right-15`}>
                  <nav className="mt-6 space-y-2">
                      <CustomButton
                      className={`w-full flex items-center justify-center cursor-pointer text-xl ${activeTab === "sessions" ? "bg-[#3D415A]" : "bg-[#21232f] hover:bg-[#3D415A]"}`}
                      onClick={() => setActiveTab("sessions")}
                      >
                      <ClipboardList size={25} className="mr-2" />Activities
                      </CustomButton>
                      <CustomButton
                      className={`w-full flex items-center justify-center cursor-pointer text-xl ${activeTab === "account" ? "bg-[#3D415A]" : "bg-[#21232f] hover:bg-[#3D415A]"}`}
                      onClick={() => setActiveTab("account")}
                      >
                      <UserRound size={25} className="mr-2" />Account
                      </CustomButton>
                      <CustomButton className="w-full flex items-center justify-center text-xl  text-red-400 hover:bg-[#3D415A] cursor-pointer"
                          onClick={handleLogout}
                      >
                          <LogOut size={25} className="mr-2" /> Logout
                      </CustomButton>
                  </nav>
              </div>
          </div>

          {
            activeTab === "sessions" ? <DashboardView /> : <AccountView />
          }
          
        </main>
      </div>
    </>
  );
}


const DashboardView = () => {
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);


  const sessions = [
    { title: "XYZ Java Interview", updated: "5 minutes ago", members: 3 },
    { title: "New Collaboration", updated: "10 days ago", members: 1 },
    { title: "First Collaboration", updated: "3 months ago", members: 2 },
    { title: "First Collaboration", updated: "3 months ago", members: 2 }
  ];

  const files = [
    { title: "college project", files: ["index.html", "style.css", "script.js", "server.js", "main.java", "+2 more"], updated: "1 month ago" },
    { title: "demo project", files: ["index.html", "style.css", "script.js", "server.js", "main.java", "+2 more"], updated: "1 month ago" },
    { title: "demo project", files: ["index.html", "style.css", "script.js", "server.js", "main.java", "+2 more"], updated: "1 month ago" },
    { title: "demo project", files: ["index.html", "style.css", "script.js", "server.js", "main.java", "+2 more"], updated: "1 month ago" }
  ];
  return(
  <div className="bg-[#21232f] text-white p-6">
          <div className="flex gap-10 mb-6">
            {["Create Room", "Join Room", "Start Coding"].map((text, index) => (
              <div 
                key={index}
                onClick={() => {
                  if (text === "Create Room") setRoomModalOpen(true);
                  if (text === "Start Coding") setProjectModalOpen(true);
                }}
                className="bg-[#3D415A] cursor-pointer w-48 h-28 flex flex-col items-center justify-center rounded-lg shadow-lg"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-[#21232f] rounded-full mb-2">
                  <span className="text-white text-2xl">+</span>
                </div>
                <span className="text-white">{text}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold inline-block pr-5">Sessions</h2>
            <button className="bg-[#3D415A] px-3 py-1 rounded text-sm cursor-pointer">View All Sessions</button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {sessions.map((session, index) => (
              <div key={index} className="bg-[#3D415A] p-4 rounded-lg relative">
                <h3 className="text-lg font-bold">{session.title}</h3>
                <p className="text-sm">Last Updated {session.updated}</p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold inline-block pr-5">My Files</h2>
            <button className="bg-[#3D415A] px-3 py-1 rounded text-sm cursor-pointer">View All Files</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="bg-[#3D415A] p-4 rounded-lg relative">
                <h3 className="text-lg font-bold">{file.title}</h3>
                <p className="text-sm">{file.files.join(" ")}</p>
                <p className="text-sm">Last Updated {file.updated}</p>
              </div>
            ))}
          </div>        

          {roomModalOpen && <CreateRoomModal onClose={() => setRoomModalOpen(false)} />}
          {projectModalOpen && <CreateProjectModal onClose={() => setProjectModalOpen(false)} />}

        </div>
);
}

const AccountView = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [userName, setUserName] = useState("");
  useEffect(() => {
    const storedName =localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  const avatarUrl = `https://robohash.org/${userName}?set=set5&size=148x148`;

  return ( <>
  <h1 className="text-3xl font-bold p-6 font-Chakra">Account Management</h1>
    <div className="flex flex-col items-center justify-center  bg-[#21232f] text-white p-6">
     
      <div className="bg-[#3D415A] p-10 rounded-2xl shadow-lg w-3xl">
        <div className="flex flex-col items-center">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-37 h-37 rounded-full border-2 border-blue-500 mb-4"
          />
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Full Name</span>
              <span className="flex items-center">{userName} <Pencil className="w-4 h-4 ml-2 text-blue-400 hover:text-blue-300 cursor-pointer" /></span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Email</span>
              <span className="flex items-center">myxyzdemo@gmail.com <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-2">Change email</span></span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Password</span>
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Change password</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="flex items-center text-red-500 hover:text-red-400 transition"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash className="w-5 h-5 mr-2" /> Delete Account
          </button>
        </div>
      </div>
    
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                onClick={() => setShowDeleteModal(false)}
              >Cancel</button>
              <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

const CreateRoomModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#00000093]">
      <div className="bg-[#3D415A] p-6 rounded-xl shadow-4xl w-94 text-white"> 
        <div className="flex items-center justify-around">
          <h2 className="text-2xl font-Chakra font-bold mb-4 ml-10">Create New Room</h2>
          <button className="p-2rounded mb-4 cursor-pointer" onClick={onClose}><X size={25} /></button>
        </div>
        <label className="block font-open-sans mb-2">Enter Session Name</label>
        <input className="w-full p-2 mb-3 bg-[#21232f] text-white placeholder:text-white rounded" type="text" placeholder="My New Session" />
        
        <label className="block font-open-sans mb-2">Description (optional)</label>
        <textarea className="w-full p-2 mb-3 bg-[#21232f] text-white placeholder:text-white rounded" placeholder="Description (optional)"></textarea>
        
        <label className="block font-open-sans mb-2">Invite People</label>
        <div className="flex items-center justify-between">
          <input className="w-[85%] p-2 mb-3 bg-[#21232f] text-white placeholder:text-white rounded" type="email" placeholder="Email person's email address" /> 
          <div className="flex items-center justify-center h-10 w-10 rounded-lg p-[1.5px] mb-3 bg-gradient-to-b  from-[#94FFF2] to-[#506DFF] cursor-pointer">
            <div className="flex items-center justify-center h-full w-full bg-[#21232f] rounded-[calc(8px-1.2px)]">
              <UserPlus size={20} />
            </div>
          </div>
        </div>

        {/* Toggle Interview Mode */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg">Interview Mode</span>
          <ToggleButton />
        </div>

        <button className="p-2 bg-gradient-to-b  from-[#94FFF2] to-[#506DFF] cursor-pointer hover:opacity-90 w-full rounded-lg">Create Room</button>
      </div>
    </div>
  );
};

const CreateProjectModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2f] p-6 rounded-2xl shadow-lg w-[90%] max-w-md text-white relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Create New Project</h2>
        
        <input
          type="text"
          placeholder="Enter Project Name"
          className="w-full p-2 mb-3 rounded bg-[#2a2a3d] text-white outline-none"
        />

        <input
          type="text"
          placeholder="Project Description (optional)"
          className="w-full p-2 mb-4 rounded bg-[#2a2a3d] text-white outline-none"
        />

        <p className="text-sm text-gray-400 mb-4">
          Note: It takes a few seconds to create a new project.
        </p>

        <button
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white rounded font-medium transition duration-200"
        >
          Create Project
        </button>

        <button
          className="absolute top-2 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
