import React from 'react';
import './Footer-style.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-links">
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </div>
                <div className="footer-social">
                    <a href="https://facebook.com" aria-label="Facebook" className="social-icon">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://twitter.com" aria-label="Twitter" className="social-icon">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://instagram.com" aria-label="Instagram" className="social-icon">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
                <div className="footer-copyright">
                    &copy; {new Date().getFullYear()} तात्तातो खबर​. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
