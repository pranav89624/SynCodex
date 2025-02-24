// import React from "react";

// function Welcome () {
//     return (
//         <>
//             <div className="bg-[#21232F] h-screen bg1 ">
//                 <div className="img1">

//                 </div>
//             </div>
//         </>
//     )
// }

// export default Welcome;

import React from "react";
import laptopImage from "../assets/home_laptop_image.png";

const Welcome = () => {
  return (
    <section className="bg-[#21232F] bg1 text-white min-h-screen flex items-center justify-center px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold font-Chakra">
            Bridging the Gap Between <br /> 
            Coding and Communication.
          </h1>
          <p className="text-gray-400 mt-4">
            An advanced online collaborative code editor with live text streaming 
            and video calling, built for seamless technical interviews. Code together, 
            communicate instantly, and tackle challenges in real time!
          </p>
          <button className="mt-6 px-6 py-3 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all">
            Create Room
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-end">
        <img 
            src={laptopImage} 
            alt="Laptop with Code"
            className="w-[80%] md:w-[90%] opacity-70 "
        />
        </div>

      </div>
    </section>
  );
};

export default Welcome;
