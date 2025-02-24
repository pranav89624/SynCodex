import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#21232F] text-white text-center py-6">
      <div className="w-full bg-[#3D415A] py-7 ">
        <div className="w-[60%] flex justify-around items-center flex-wrap text-center m-auto space-x-8">
            <a href="#" className="text-white hover:underline">FAQ’s</a>
            <a href="#" className="text-white hover:underline">About Us</a>
            <a href="#" className="text-white hover:underline">Contact Us</a>
            <a href="#" className="text-white hover:underline">Licences</a>
        </div>
      </div>
      <p className="pt-8 text-gray-400">
        copyright © 2025 - <span className="font-bold text-white">SynCodex</span>
      </p>
      <p className="text-gray-500">All rights reserved.</p>
    </footer>
  );
};

export default Footer;
