import React from "react";
import Navbar from "../components/navbar";
import Welcome from "../components/welcome";
import Features from "../components/features";
import Footer from "../components/footer";
import Scroll from "../components/scroll";
function Homepage() {
  return (
    <>
      <Scroll />
      <Navbar />
      <Welcome />
      <Features />
      <Footer />
    </>
  );
}

export default Homepage;
