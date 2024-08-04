import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css'; // Assuming you have some basic styles
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NewsList from './components/NewsList/NewsList';
import Dashboard from './components/dashboard/Dashboard';
import Footer from './components/footer/Footer'; 
import Header from './components/navbar/Header'; 
import Login from './components/login/Login';
import NewsDetails from './components/newsdetails/NewsDetails';
// import Signup from './components/auth/Signup';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
  };

  handleLogout = () => {
    this.setState({ isLoggedIn: false });
  };

  render() {
    const { isLoggedIn } = this.state;

    return (
      <Router>
        <div>
          <Header />
          <nav>
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
                  <>
                    <Link to="/login">Login</Link>
                    {/* <Link to="/signup">Signup</Link> */}
                  </>
                )}
              </span>
            </div>
          </nav>
          <main>
            <Routes>
              <Route path="/" element={<NewsList />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
              <Route path="/news/:newsId" element={<NewsDetails />} />
              {/* <Route path="/signup" element={<Signup />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
