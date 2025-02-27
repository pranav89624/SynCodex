import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Homepage from "./pages/homepage";
import Signup from "./pages/sinup";
import About from "./pages/about";
import Contact from "./pages/contactUs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        </Routes>
      </Router>
      
    </>
  );
}

export default App;
