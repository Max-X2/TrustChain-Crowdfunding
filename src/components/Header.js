"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setDarkMode(savedMode === 'true' || (!savedMode && prefersDarkScheme));
  }, []);

  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <header className="d-flex flex-wrap justify-content-around align-items-center py-4 px-5 mt-4">
      <div className="flex-grow-1">
  <h1 style={{ fontFamily: "'Lucida Console', monospace" }}>
    <Link className="nav-link fs-3 d-flex align-items-center" href="/">
      <img
        src="/icons/cryptocurrencylogo.svg"
        width="45"
        height="45"
        className="border-0"
        style={{ marginRight: '-4px' }}  
      />
      <p className="text-center mb-0">rowdCrypto</p>
    </Link>
  </h1>
</div>



      <nav className="flex-grow-1">
        <ul className="nav fs-6 mb-0 d-flex flex-wrap justify-content-center">
          <li className="nav-item mx-1 ms-3">
            <Link className="nav-link" href="/">Home</Link>
          </li>
          <li className="nav-item mx-1">
            <Link className="nav-link" href="/protected/donate">Donate</Link>
          </li>
          <li className="nav-item mx-1">
            <Link className="nav-link" href="/protected/create">New Campaign</Link>
          </li>
          <li className="nav-item mx-1">
            <Link className="nav-link" href="/protected/my_campaigns">My Campaigns</Link>
          </li>
        </ul>
      </nav>

      <label className="switch ms-2 d-flex align-items-center">
        <FontAwesomeIcon icon={faSun} className="sun-icon" />
        <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
        <span className="slider"></span>
        <FontAwesomeIcon icon={faMoon} className="moon-icon" />
      </label>
    </header>
  );
}