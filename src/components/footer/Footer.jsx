import React from "react";
import { Link } from "react-router-dom";
import "./Footer-style.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-mark">TT</span>
              <span className="footer-name">तात्तातो खबर</span>
            </div>
            <p className="footer-desc">
              Fast, reliable updates from Nepal and the world. Politics, sports, entertainment,
              and more — in one place.
            </p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>

            <div className="footer-col">
              <h4>Sections</h4>
              <Link to="/world">World</Link>
              <Link to="/politics">Politics</Link>
              <Link to="/sports">Sports</Link>
              <Link to="/entertainment">Entertainment</Link>
            </div>

            <div className="footer-col">
              <h4>Follow</h4>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                Twitter
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} तात्तातो खबर. All Rights Reserved.</span>
          <span className="footer-mini-links">
            <Link to="/privacy">Privacy</Link>
            <span className="sep">•</span>
            <Link to="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
