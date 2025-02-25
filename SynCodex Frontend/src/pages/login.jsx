import { Link } from "react-router-dom";
import lockIcon from "../assets/password_11817746 1.svg";
import { useState } from "react";
import openEye from "../assets/view.png";
import closedEye from "../assets/hidden.png";
import google from "../assets/icons8-google-48.png"
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { easeInOut, motion } from "motion/react"


const Login = () => {

const [showPassword, setShowPassword] = useState(false);

const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateEmail = (email) => emailRegex.test(email);
  const validatePassword = (password) => passwordRegex.test(password);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Invalid Email!");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters, with one uppercase, one number, and one special character!");
      return;
    }

    alert("Login Successful!");
  };

return (
    <>
    <Navbar hideStartCoding={true}/>

    <div className="flex items-center justify-center h-screen bg-[#21232F] text-white">
    <motion.div
      initial={{ opacity: 0.4,scale:0.7}}
      animate={{ opacity: 1, scale: 1}}
      transition={{
          duration: 0.5,
          ease: easeInOut,
      }}
    >
        <div className="w-full max-w-3xl bg-[#3D415A] p-8 rounded-lg border-3 border-blue-500 shadow-lg flex flex-col md:flex-row items-center animate-glow transition-all duration-500 hover:border-blue-400">
        <div className="flex flex-col items-center text-center md:w-1/2 p-6">
          <img src={lockIcon} alt="Secure Login" className="w-50 mb-4" />
          <h2 className="text-xl font-semibold">Welcome back to <span className="bg-gradient-to-r from-[#94FFF2] to-[#506DFF] text-transparent bg-clip-text">SynCodex</span>.</h2>
          <p className="text-gray-400">Code, collaborate, and conquer in real-time.</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 w-full p-6">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
             type="email" 
             value={email} 
             onChange={(e) => setEmail(e.target.value)}
             className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
             required  
            />

            <label className="block text-gray-300 text-sm mt-3 mb-1">Password</label>
            <div className="relative w-full">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" 
                required 
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img 
                  src={showPassword ? openEye : closedEye} 
                  alt="Toggle Password Visibility" 
                  className="w-6 h-6 opacity-70 hover:opacity-100 transition cursor-pointer"
                />
              </button>

            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-[#94FFF2] to-[#506DFF] text-white py-2 rounded-lg hover:opacity-90 cursor-pointer font-bold">
              Login
            </button>

            <hr className="mt-3 border-gray-500" />

          </form>

            <div className="bg-gradient-to-r from-[#94FFF2] to-[#506DFF] p-[1px] rounded-lg mt-3">
                <button className="w-full bg-gray-700 py-2 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer">
                <span className="font-bold flex items-center gap-2.5"><img src={google} className="w-7"/>Login with Google</span>
                </button>
            </div>
          <p className="text-sm text-gray-400 mt-4">
            Don't have an account? <Link to="/signup" className="bg-gradient-to-r from-[#94FFF2] to-[#506DFF] text-transparent bg-clip-text ">Sign Up</Link>
          </p>
        </div>
      </div>
  </motion.div>
    </div>
    <Footer />
    </>
);
};

export default Login;
