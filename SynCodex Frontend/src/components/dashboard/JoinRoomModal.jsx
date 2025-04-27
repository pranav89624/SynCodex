import { X } from "lucide-react";

export default function JoinRoomModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-[#00000093] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#3D415A] p-6 rounded-2xl shadow-4xl w-94 text-white">
        <div className="flex items-center gap-20 justify-end">
          <h2 className="text-2xl font-Chakra font-bold mb-4 ml-10">Join Room</h2>
          <button className="p-2rounded mb-4 cursor-pointer" onClick={onClose}><X size={25} /></button>
        </div>
        <label className="block font-open-sans mb-2">Room ID</label>
        <input type="text" placeholder="Enter Room ID" className="w-full p-2 mb-3 rounded-lg bg-[#21232f] text-white outline-none" />
        <label className="block font-open-sans mb-2">Password</label>
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 rounded-lg bg-[#21232f] text-white outline-none" />
        <p className="text-xs text-red-400 mb-2">* Note - This is an Interview Room. You can’t change tabs. If you minimize the screen or go back to files, the session will be ended automatically.</p>
        <p className="text-sm text-green-300 italic text-center mb-4">"Wishing you all the best for your interview!"</p>
        <button className="p-2 bg-gradient-to-b  from-[#94FFF2] to-[#506DFF] cursor-pointer hover:opacity-90 w-full rounded-lg">Join Room</button>
      </div>
    </div>
  );
}