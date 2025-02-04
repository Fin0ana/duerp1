'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import Cookie from "./Cookie";


const NavBar: React.FC = () => {
  const [navbar, setNavbar] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <>
      <nav className={`w-full fixed top-0 left-0 right-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-gray-200 opacity-50'}`}>
        <div className="justify-between px-6 mx-auto lg:max-w-7xl md:items-center md:flex md:px-10">
          <div>

          <div className="flex items-center justify-between py-2 md:py-3 md:block">
              <Image
                src="/assets/logo.png"
                alt="logo"
                width={170}
                height={60}
                className="h-15"
              />
              <div className="md:hidden flex items-center">
                <button
                  className="p-3 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <Image src="/assets/close.svg" width={35} height={35} alt="close" />
                  ) : (
                    <Image
                      src="/assets/hamburger-menu.svg"
                      width={35}
                      height={35}
                      alt="menu"
                    />
                  )}
                </button>
                <button
                  className="ml-4 p-3 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={toggleTheme}
                >
                  <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-gray-700" />
                </button>
              </div>
            </div>

          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-2 mt-3 md:block md:pb-0 md:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className={`h-screen md:h-auto items-center justify-center md:flex ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
                <li className="pb-3 text-xl md:py-2 md:px-5 text-center border-b-2 md:border-b-0 hover:text-[#ff0366] border-purple-900 md:hover:text-[#ff0366] md:hover:bg-transparent md:mr-3">
                  <Link href="/">Accueil</Link>
                </li>
                <li className="pb-3 text-xl md:py-2 md:px-5 text-center border-b-2 md:border-b-0 hover:text-[#ff0366] border-purple-900 md:hover:text-[#ff0366] md:hover:bg-transparent md:mr-3">
                  <Link href="/user/about">Qui sommes nous</Link>
                </li>
                <li className="pb-3 text-xl md:py-2 md:px-5 text-center border-b-2 md:border-b-0 hover:bg-purple-600 border-purple-900 md:hover:text-[#ff0366] md:hover:bg-transparent md:mr-3">
                  <Link href="/user/politique">Politique</Link>
                </li>
                <li className="pb-3 text-xl md:py-2 md:px-5 text-center border-b-2 md:border-b-0 hover:bg-purple-600 border-purple-900 md:hover:text-[#ff0366] md:hover:bg-transparent md:mr-3">
                  <Link href="/user/tarif">Tarif</Link>
                </li>
                <li className="pb-3 text-xl md:py-2 md:px-5 text-center border-b-2 md:border-b-0 hover:bg-purple-600 border-purple-900 md:hover:text-[#ff0366] md:hover:bg-transparent md:mr-3">
                  <Link href="/user/contact">Contact</Link>
                </li>
                <li className="pb-3 text-xl md:py-2 md:px-5 text-center border-b-2 md:border-b-0 hover:bg-purple-600 border-purple-900 md:hover:text-[#ff0366] md:hover:bg-transparent md:ml-5">
                  <Link href="/user/connexion">
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                    Connexion
                  </Link>
                </li>
                <li className="pb-3 text-xl md:py-2 md:px-5 text-center border-b-2 md:border-b-0 hover:bg-purple-600 border-purple-900 md:hover:text-[#ff0366] md:hover:bg-transparent md:ml-5">
                  <button onClick={toggleTheme}>
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <Cookie />
    </>
  );
}

export default NavBar;