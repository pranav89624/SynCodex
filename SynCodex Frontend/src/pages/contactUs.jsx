import { useState } from "react";
import ContactImage from "../assets/Contact-Us.svg";
import Navbar from "../components/navbar";
import Scroll from "../components/scroll";
import Footer from "../components/footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
  };

  return (
<>
    <Scroll/>
    <Navbar/>
    <div className="flex justify-center items-center min-h-screen bg-[#21232f]">
      <div className="bg-[#3d415a] p-8 rounded-2xl shadow-lg w-[600px] text-white border-3 border-blue-400 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center mb-4">Contact Us</h2>
        <div className="w-full flex flex-col items-center">
          <img src={ContactImage} alt="Contact Us" className="w-32 mb-4" />
          <div className="w-full text-center">
            <p className="text-lg font-semibold text-gray-300">Let's Connect & Code!</p>
            <p className="text-gray-400 mb-4">
              Got questions or need support? We're here to help! Reach out for inquiries, 
              feedback, or assistance, and let's shape the future of real-time coding together!
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#21232f]"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}      
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#21232f]"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          
          <textarea
            name="message"
            placeholder="Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#21232f]"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          
          <button
            type="submit"
            className="w-full p-3 cursor-pointer rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-90 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
<Footer/>
    </>
  );
};

export default ContactUs;
