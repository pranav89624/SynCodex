import { useState, useEffect, use } from "react";
import { Pencil, Trash } from "lucide-react";

export default function AccountView() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const avatarUrl = `https://robohash.org/${userName}?set=set5&size=148x148`;

  return (
    <>
      <h1 className="text-3xl font-bold p-6 font-Chakra">Account Management</h1>
      <div className="flex flex-col items-center justify-center bg-[#21232f] text-white p-6">
        <div className="bg-[#3D415A] p-10 rounded-2xl shadow-lg w-3xl">
          <div className="flex flex-col items-center">
            <img src={avatarUrl} alt="Profile" className="w-37 h-37 rounded-full border-2 border-blue-500 mb-4" />
            <div className="w-full">
              <div className="items-center mb-3 grid grid-cols-3">
                <span className="text-gray-400">Full Name</span>
                <span className="flex items-center">{userName}</span> 
                <Pencil className="w-4 h-4 ml-2 text-blue-400 hover:text-blue-300 cursor-pointer" />
              </div>
              <div className="items-center mb-3 grid grid-cols-3">
                <span className="text-gray-400">Email</span>
                <span className="flex items-center">{userEmail}</span> 
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-2">Change email</span>
              </div>
              <div className="items-center mb-3 grid grid-cols-3">
                <span className="text-gray-400">Password</span>
                <span></span>
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-2">Change password</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="flex items-center text-red-500 hover:text-red-400 transition" onClick={() => setShowDeleteModal(true)}>
              <Trash className="w-5 h-5 mr-2" /> Delete Account
            </button>
          </div>
        </div>
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
