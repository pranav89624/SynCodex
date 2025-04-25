import { FaPlay } from "react-icons/fa";

export default function EditorNav() {
    return (
        <div className="flex items-center bg-[#21232f] h-16 px-4 border-b border-[#e4e6f3ab]">
            <h1 className="text-4xl font-bold font-Chakra font-gradient cursor-default">SynCodex</h1>
            <div className="w-full flex justify-center items-center">
                <button className="bg-[#3D415A] hover:opacity-90 text-white p-3 rounded-lg cursor-pointer flex justify-center items-center">
                    <FaPlay height={20} />
                </button>
            </div>
      </div>
    );
}