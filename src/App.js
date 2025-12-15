import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NewsList from './components/NewsList/NewsList';
import Dashboard from './components/dashboard/Dashboard';
import Footer from './components/footer/Footer'; 
import Header from './components/navbar/Header'; 
import Login from './components/login/Login';
import NewsDetails from './components/newsdetails/NewsDetails';
import TokenRefreshDialog from './components/TokenRefreshDialog/TokenRefreshDialog';
import TokenManager from './utils/TokenManager';
import './App.css';
import LiveRadioPlayer from "./components/radio/LiveRadioPlayer";
import { API_BASE_URL } from './api/config';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: !!localStorage.getItem('token'), 
      showRefreshDialog: false,
      timeRemaining: 60, 
    };
  }

  componentDidMount() {
    if (this.state.isLoggedIn) {
      this.startTokenMonitoring();
    }
  }

  componentWillUnmount() {
    TokenManager.stopTokenCheck();
  }

  startTokenMonitoring = () => {
    TokenManager.startTokenCheck(
      this.handleTokenExpired,
      this.handleTokenExpiringSoon,
      30000 // Check every 30 seconds
    );
  };

  handleTokenExpired = () => {
    // Token has already expired - force logout
    alert('Your session has expired. Please login again.');
    this.handleLogout();
  };

  handleTokenExpiringSoon = () => {
    const token = localStorage.getItem('token');
    const timeRemaining = Math.floor(TokenManager.getTimeUntilExpiry(token));
    
    this.setState({ 
      showRefreshDialog: true,
      timeRemaining: timeRemaining > 0 ? timeRemaining : 0
    });
  };

  handleRefreshToken = async () => {
  try {
    const token = localStorage.getItem("refreshToken");
    
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token ?? "" }),
    });

    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const data = await response.json();

    // expect backend returns: { accessToken: "..." }
    if (!data?.accessToken) {
      throw new Error("No accessToken in refresh response");
    }

    localStorage.setItem("token", data.accessToken);
    
    // close dialog
    this.setState({ showRefreshDialog: false });
    
    // restart monitoring with the new token
    this.startTokenMonitoring();
    
  } catch (error) {
    console.error("Token refresh failed:", error);
    alert("Failed to refresh session. Please login again.");
    this.handleLogout();
  }
};

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
    this.startTokenMonitoring();
  };

  handleLogout = () => {
    TokenManager.stopTokenCheck();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ 
      isLoggedIn: false,
      showRefreshDialog: false 
    });
    window.location.href = '/login';
  };

  render() {
    const { isLoggedIn, showRefreshDialog, timeRemaining } = this.state;

    return (
      <Router>
        <div>
          {/* <Header /> */}
          <Header isLoggedIn={isLoggedIn} onLogout={this.handleLogout} />
        <LiveRadioPlayer />

          {/* <nav>
            <div className="header">
              <span className="left">
                <Link to="/">Home</Link>
              </span>
              <span className="right">
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard">Dashboard</Link>
                    <button onClick={this.handleLogout}>Logout</button>
                  </>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </span>
            </div>
          </nav> */}

          <TokenRefreshDialog
            isOpen={showRefreshDialog}
            onRefresh={this.handleRefreshToken}
            onLogout={this.handleLogout}
            timeRemaining={timeRemaining}
          />

          <main>
            <Routes>
              <Route path="/" element={<NewsList />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
              <Route path="/news/:newsId" element={<NewsDetails />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;

