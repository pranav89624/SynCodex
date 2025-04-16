import { X, UserPlus } from "lucide-react";
import ToggleButton from "../toggleButton";

export default function CreateRoomModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#00000093]">
      <div className="bg-[#3D415A] p-6 rounded-xl shadow-4xl w-94 text-white">
        <div className="flex items-center justify-around">
          <h2 className="text-2xl font-Chakra font-bold mb-4 ml-10">Create New Room</h2>
          <button className="p-2rounded mb-4 cursor-pointer" onClick={onClose}><X size={25} /></button>
        </div>
        <label className="block font-open-sans mb-2">Enter Session Name</label>
        <input className="w-full p-2 mb-3 bg-[#21232f] text-white placeholder:text-white outline-none rounded" type="text" placeholder="My New Session" />
        <label className="block font-open-sans mb-2">Description (optional)</label>
        <textarea className="w-full p-2 mb-3 bg-[#21232f] text-white placeholder:text-white outline-none rounded" placeholder="Description (optional)"></textarea>
        <label className="block font-open-sans mb-2">Invite People</label>
        <div className="flex items-center justify-between">
          <input className="w-[85%] p-2 mb-3 bg-[#21232f] text-white placeholder:text-white outline-none rounded" type="email" placeholder="Email person's email address" /> 
          <div className="flex items-center justify-center h-10 w-10 rounded-lg p-[1.5px] mb-3 bg-gradient-to-b  from-[#94FFF2] to-[#506DFF] cursor-pointer">
            <div className="flex items-center justify-center h-full w-full bg-[#21232f] rounded-[calc(8px-1.2px)]">
              <UserPlus size={20} />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg">Interview Mode</span>
          <ToggleButton />
        </div>
        <button className="p-2 bg-gradient-to-b  from-[#94FFF2] to-[#506DFF] cursor-pointer hover:opacity-90 w-full rounded-lg">Create Room</button>
      </div>
    </div>
  );
}