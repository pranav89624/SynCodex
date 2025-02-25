import React from "react";
import Navbar from "../components/navbar";
import Welcome from "../components/welcome"; 
import Features from "../components/features";
import Footer from "../components/footer";

function Homepage() {
    return (
      <>  
        <Navbar /> 
        <Welcome />
        <Features />
        <Footer />
      </>
    )
  }
  
  export default Homepage