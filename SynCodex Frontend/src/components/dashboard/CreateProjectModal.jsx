import { useState, } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function CreateProjectModal({ onClose }) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleCreate = () => {
    if (!projectName.trim()) {
      toast.error("Project name is required.");
      return;
    }

    const projectData = {
      name: projectName,
      description: projectDescription,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("synProject", JSON.stringify(projectData));
    onClose();
    window.open("/editor", "_blank");
  };

  return (
    <div className="fixed inset-0 bg-[#00000093] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#3D415A] p-6 rounded-2xl shadow-4xl w-94 text-white">
        <div className="flex items-center gap-6 justify-end">
          <h2 className="text-2xl font-Chakra font-bold mb-4 ml-10">Create New Project</h2>
          <button className="p-2 rounded mb-4 cursor-pointer" onClick={onClose}>
            <X size={25} />
          </button>
        </div>
        <label className="block font-open-sans mb-2">Enter Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter Project Name"
          className="w-full p-2 mb-3 rounded-lg bg-[#21232f] text-white outline-none"
        />

        <label className="block font-open-sans mb-2">Project Description</label>
        <input
          type="text"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="(optional)"
          className="w-full p-2 mb-4 rounded-lg bg-[#21232f] text-white outline-none"
        />

        <p className="text-sm text-gray-400 mb-4">
          Note: It takes a few seconds to create a new project.
        </p>

        <button
          onClick={handleCreate}
          className="p-2 bg-gradient-to-b from-[#94FFF2] to-[#506DFF] cursor-pointer hover:opacity-90 w-full rounded-lg"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}
