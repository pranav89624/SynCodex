import { X } from "lucide-react";

export default function CreateProjectModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-[#00000093] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#3D415A] p-6 rounded-2xl shadow-lg w-[90%] max-w-md text-white relative">
        <div className="flex items-center justify-around">
          <h2 className="text-2xl font-Chakra font-bold mb-4 ml-10">Create New Project</h2>
          <button className="p-2rounded mb-4 cursor-pointer" onClick={onClose}><X size={25} /></button>
        </div>
        <label className="block font-open-sans mb-2">Enter Project Name</label>
        <input type="text" placeholder="Enter Project Name" className="w-full p-2 mb-3 rounded bg-[#21232f] text-white outline-none placeholder:text-white" />
        <label className="block font-open-sans mb-2">Project Description</label>
        <input type="text" placeholder="(optional)" className="w-full p-2 mb-4 rounded bg-[#21232f] text-white outline-none placeholder:text-white" />
        <p className="text-sm text-gray-400 mb-4">Note: It takes a few seconds to create a new project.</p>
        <button className="p-2 bg-gradient-to-b  from-[#94FFF2] to-[#506DFF] cursor-pointer hover:opacity-90 w-full rounded-lg">Create Project</button>
      </div>
    </div>
  );
}
