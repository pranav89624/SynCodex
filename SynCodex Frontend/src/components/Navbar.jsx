import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={`flex w-full items-center bg-[#21232F] justify-center sticky top-0 z-50 shadow-sm`}>
      <div className="container px-4">
        <div className="relative flex items-center justify-end">
          <div className="w-auto max-w-full flex">
            <a href="/#" className="flex items-center space-x-4">              
              <>
                <img src="/SynCodex icon.png" alt="icon" className="w-17 md:hidden"/>
                <Link to="/" className="max-md:hidden font-Chakra text-[48px] font-semibold bg-gradient-to-r from-[#94FFF2] to-[#506DFF] text-transparent bg-clip-text">SynCodex</Link>
              </>            
            </a>
          </div>
          <div className="flex w-full items-center justify-around">
            <div>
              <button
                onClick={() => setOpen(!open)}
                id="navbarToggler"
                className={` ${
                  open && "navbarTogglerActive"
                } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
              </button>
              <nav
                // :className="!navbarOpen && 'hidden' "
                id="navbarCollapse"
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg py-7 shadow bg-[#21232F] lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none ${
                  !open && "hidden"
                } `}
              >
                <div className="flex justify-evenly space-x-8 px-5">
                  <Link to="/" className="text-white text-center text-2xl font-normal font-open-sans">Home</Link>
                  <Link to="/about" className="text-white text-center text-2xl font-normal font-open-sans">About Us</Link>
                  <Link to="/contact" className="text-white text-center text-2xl font-normal font-open-sans">Contact Us</Link>
                </div>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0 space-x-4">
              <a
                href="/#"
                className="px-7 py-3 max-w-45 text-center text-white text-xl font-bold font-open-sans bg-gradient-to-b from-[#94FFF2] to-[#506DFF] rounded-2xl transition hover:from-[#506DFF] hover:to-[#94fff2]"
              >
                Start Coding
              </a>

              <Link to="/login"
                className="p-[2.5px] min-w-45 text-center text-white text-xl font-bold font-open-sans bg-gradient-to-b from-[#94FFF2] to-[#506DFF] rounded-2xl transition hover:from-[#506DFF] hover:to-[#94fff2]"
              >
                <div className="bg-[#21232F] max-w-45 py-3 rounded-[calc(16px-2.5px)] lg:py-6 xl:py-3 ">
                  Login
                </div>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const ListItem = ({ children, NavLink }) => {
  return (
    <>
      <li>
        <a
          href={NavLink}
          className="flex py-2 text-base font-medium text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white lg:ml-12 lg:inline-flex"
        >
          {children}
        </a>
      </li>
    </>
  );
};
