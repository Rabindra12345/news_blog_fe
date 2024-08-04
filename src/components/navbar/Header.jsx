import React from 'react';
import './header-style.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>तात्तातो खबर​</h1>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/world">World</a></li>
            <li><a href="/politics">Politics</a></li>
            <li><a href="/sports">Sports</a></li>
            <li><a href="/entertainment">Entertainment</a></li>
            <li><a href="/contact">Contact</a></li>
            </ul>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </div>
    </header>
  );
};

export default Header;

