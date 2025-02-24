import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Homepage from './pages/homepage';
function App() {
  return (
    <>      
      {/* <Homepage /> */}
      <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<h2>Signup Page</h2>} /> {/* Placeholder */}
      </Routes>
    </Router>
    </>
  )
}

export default App
