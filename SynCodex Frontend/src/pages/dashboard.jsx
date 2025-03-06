import {  useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, ClipboardList, UserRound, Bell, UserPlus, X} from "lucide-react";
import UserAvatar from "../components/userAvatar";
import ToggleButton from "../components/toggleButton";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [Box, setBox] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("name");
    navigate("/"); // Redirect to homepage
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
  <div className="bg-[#21232f] text-white p-6 min-h-screen">
          <div className="flex gap-10 mb-6">
            {["Create Room", "Join Room", "Start Coding"].map((text, index) => (
              <div 
                key={index}
                onClick={() => {
                  if (text === "Create Room") setRoomModalOpen(true);
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
        </div>
);
}

const AccountView = () => {
  return (<h1>Account Management</h1>);
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