import { Link, useNavigate } from "react-router-dom";
import SignupNow from "../assets/followers_6081941 1.svg";
import { useState } from "react";
import openEye from "../assets/view.png";
import closedEye from "../assets/hidden.png";
import google from "../assets/icons8-google-48.png";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { easeInOut, motion } from "motion/react";
import Scroll from "../components/scroll";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateEmail = (email) => emailRegex.test(email);
  const validatePassword = (password) => passwordRegex.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Invalid Email!");
      return;
    }

    if (!validatePassword(password)) {
      alert(
        "Password must be at least 8 characters, with one uppercase, one number, and one special character!"
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
      });

      alert("Signup Successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Store additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName,
        email: user.email,
      });

      alert("Signup Successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error during Google signup:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <Scroll />
      <Navbar hideStartCoding={true} />

      <div className="flex items-center justify-center h-screen bg-[#21232F] text-white">
        <motion.div
          initial={{ opacity: 0.4, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: easeInOut,
          }}
        >
          <div className="w-full max-w-3xl bg-[#3D415A] p-8 rounded-lg border-3 border-blue-500 shadow-lg flex flex-col md:flex-row items-center animate-glow transition-all duration-500 hover:border-blue-400">
            <div className="flex flex-col items-center text-center md:w-1/2 p-6">
              <img src={SignupNow} alt="Secure Sign UP" className="w-50 mb-4" />
              <h2 className="text-xl font-semibold">
                Join{" "}
                <span className="bg-gradient-to-r from-[#94FFF2] to-[#506DFF] text-transparent bg-clip-text">
                  SynCodex
                </span>{" "}
                now.
              </h2>
              <p className="text-gray-400">
                code smarter, collaborate faster, and innovate together
                seamlessly
              </p>
            </div>

            <div className="md:w-1/2 w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Sign UP</h2>
              <form onSubmit={handleSubmit}>
                <label className="block text-gray-300 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#21232f]"
                  required
                />

                <label className="block text-gray-300 text-sm mt-3 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#21232f]"
                  required
                />

                <label className="block text-gray-300 text-sm mt-3 mb-1">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#21232f] pr-10"
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
                  Sign Up
                </button>

                <hr className="mt-3 border-gray-500" />
              </form>

              <div className="bg-gradient-to-r from-[#94FFF2] to-[#506DFF] p-[1px] rounded-lg mt-3">
                <button
                  className="w-full bg-gray-700 py-2 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer"
                  onClick={handleGoogleSignup}
                >
                  <span className="font-bold flex items-center gap-2.5">
                    <img src={google} className="w-7" />
                    Sign Up with Google
                  </span>
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-[#94FFF2] to-[#506DFF] text-transparent bg-clip-text "
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default Signup;