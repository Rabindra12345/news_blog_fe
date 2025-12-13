import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./header-style.css";

const Header = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const nav = [
    { label: "Home", to: "/" },
    { label: "World", to: "/world" },
    { label: "Politics", to: "/politics" },
    { label: "Sports", to: "/sports" },
    { label: "Entertainment", to: "/entertainment" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header className="news-header">
      <div className="top-strip">
        <div className="top-left">
          <span className="date">{today}</span>
          <span className="dot" />
          <span className="breaking">BREAKING</span>
          <span className="breaking-text">Latest updates from Nepal & the world</span>
        </div>

        <div className="top-right">
          {isLoggedIn ? (
            <>
              <Link className="top-link" to="/dashboard">Dashboard</Link>
              <button className="top-btn" type="button" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="top-link" to="/login">Login</Link>
          )}
        </div>
      </div>

      <div className="main-bar">
        <div className="brand">
          <Link to="/" className="brand-link">
            <span className="brand-mark">TT</span>
            <span className="brand-name">तात्तातो खबर</span>
          </Link>
          <div className="tagline">Trusted news • Fast updates</div>
        </div>

        <div className="search">
          <input type="text" placeholder="Search news..." />
          <button type="button">Search</button>
        </div>
      </div>

      <nav className="nav-bar">
        <div className="nav-inner">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-item ${active ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Header;
