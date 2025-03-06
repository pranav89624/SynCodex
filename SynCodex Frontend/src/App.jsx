import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Homepage from "./pages/homepage";
import Signup from "./pages/sinup";
import About from "./pages/about";
import Contact from "./pages/contactUs";
import FAQSection from "./pages/faq";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/protectedRoute";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <>

      <ToastContainer
              position="top-center" // Change position
              autoClose={2500} // Auto-close time (ms)
              hideProgressBar={false} // Show progress bar
              newestOnTop={true} // Show newest toast first
              closeOnClick // Close when clicked
              pauseOnHover // Pause on hover
              draggable // Allow dragging
      />

      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQSection />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
      
    </>
  );
}

export default App;
