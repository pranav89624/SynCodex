import React, { useState } from "react";
const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={`flex w-full items-center bg-[#21232F] justify-center sticky top-0 z-50`}>
      <div className="container px-4">
        <div className="relative flex items-center justify-end">
          <div className="w-auto max-w-full flex">
            <a href="/#" className="flex items-center space-x-4">              
              <>
                <img src="/SynCodex icon.png" alt="icon" className="w-17 md:hidden"/>
                <h1 className="max-md:hidden font-Chakra text-[48px] font-semibold bg-gradient-to-r from-[#94FFF2] to-[#506DFF] text-transparent bg-clip-text">SynCodex</h1>
              </>            
            </a>
          </div>
          <div className="flex w-full items-center justify-around px-4">
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
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg px-6 py-5 shadow bg-[#21232F] lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none ${
                  !open && "hidden"
                } `}
              >
                <ul className="block lg:flex">
                  <ListItem NavLink="/#" ><span className="text-white text-2xl font-normal font-[Open_Sans]">Home</span></ListItem>
                  <ListItem NavLink="/#" ><span className="text-white text-2xl font-normal font-[Open_Sans]">About Us</span></ListItem>
                  <ListItem NavLink="/#" ><span className="text-white text-2xl font-normal font-[Open_Sans]">Contact Us</span></ListItem>
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <a
                href="/#"
                className="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"
              >
                Sign in
              </a>

              <a
                href="/#"
                className="rounded-md bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
              >
                Sign Up
              </a>
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
