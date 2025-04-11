import { useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import CreateProjectModal from "./CreateProjectModal";
import JoinRoomModal from "./JoinRoomModal";

export default function DashboardView() {
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);

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

  return (
    <div className="bg-[#21232f] text-white p-6">
      <div className="flex gap-10 mb-6">
        {["Create Room", "Join Room", "Start Coding"].map((text, index) => (
          <div
            key={index}
            onClick={() => {
              if (text === "Create Room") setRoomModalOpen(true);
              if (text === "Start Coding") setProjectModalOpen(true);
              if (text === "Join Room") setJoinRoomModalOpen(true);
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
      {joinRoomModalOpen && <JoinRoomModal onClose={() => setJoinRoomModalOpen(false)} />}
    </div>
  );
}