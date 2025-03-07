import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import API from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/auth/forgot-password", { email });

      if (res.status === 200) {
        toast.success("Reset email sent! Check your inbox.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#21232f]">  
        <div className="bg-[#3D415A] pt-10 w-[50%] text-center rounded-2xl border-2 border-blue-500">
            <h2 className="text-4xl font-Chakra text-white font-semibold my-10">Forgot Password</h2>
            <form onSubmit={handleForgotPassword} className="flex flex-col justify-center items-center">
                <label className="flex justify-start w-[70%] m-auto text-gray-300 text-sm mb-1">
                    Email
                </label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 w-[70%] p-5 rounded-lg border-2 text-xl text-white font-bold border-transparent focus:outline-none focus:ring-2 focus:ring-[#21232f]"
                required
                />
                <button type="submit" className="w-[70%] text-white font-bold rounded-lg bg-gradient-to-r from-[#94FFF2] to-[#506DFF] py-4 hover:opacity-90 cursor-pointer mt-3 text-lg flex items-center justify-center gap-2 relative" disabled={loading}>
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Send Reset Link"
                    )}
                </button>
            </form>
            <p className="justify-self-start pt-10 pl-3 pb-3 text-blue-600 text-xs">
                <Link to={"/login"}>Go Back to login page</Link>
            </p>
      </div>
      
    </div>
  );
};

export default ForgotPassword;
