import React, { useState } from 'react';
import DashboardForm from '../form/DashboardForm';
import './Dashboard-style.css';
import AnalyticsReporting  from '../analytics/AnalyticsReporting';
import UserProfileManagement from '../userprofile/UserProfileManagement';

const Dashboard = () => {
    const [currentView, setCurrentView] = useState('');

    const handleButtonClick = (view) => {
        setCurrentView(view);
    };

    const handleFormSubmit = () => {
        setCurrentView('');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>News Blog Dashboard</h1>
                <nav>
                    <a href="/">Home</a>
                    <a href="/login">Login</a>
                </nav>
            </header>
            <div className="dashboard-content">
            <aside className="sidebar">
                    <h2>Menu</h2>
                    <ul>
                        <li>
                            <button onClick={() => handleButtonClick('addNews')}>Add News</button>
                        </li>
                        <li>
                            <button onClick={() => handleButtonClick('editNews')}>Edit News</button>
                        </li>
                        <li>
                            <button onClick={() => handleButtonClick('userProfile')}>User Profile Management</button>
                        </li>
                        <li>
                            <button onClick={() => handleButtonClick('analytics')}>Analytics Reporting</button>
                        </li>
                    </ul>
                </aside>
                <main className="main-view">
                    {currentView === 'addNews' && <DashboardForm onFormSubmit={handleFormSubmit} />}
                    {currentView === 'editNews' && <div>Edit News Component</div>}
                    {currentView === 'userProfile' && <UserProfileManagement />}
                    {currentView === 'analytics' && <AnalyticsReporting />}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
