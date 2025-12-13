import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardForm from "../form/DashboardForm";
import AnalyticsReporting from "../analytics/AnalyticsReporting";
import UserProfileManagement from "../userprofile/UserProfileManagement";
import "./Dashboard-style.css";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("addNews"); 

  const menu = useMemo(
    () => [
      { key: "addNews", label: "Add News" },
      { key: "editNews", label: "Edit News" },
      { key: "userProfile", label: "User Profile Management" },
      { key: "analytics", label: "Analytics Reporting" },
    ],
    []
  );

  const handleFormSubmit = () => setCurrentView("addNews");

  const renderMain = () => {
    if (currentView === "addNews") return <DashboardForm onFormSubmit={handleFormSubmit} />;
    if (currentView === "editNews") return <div>Edit News Component</div>;
    if (currentView === "userProfile") return <UserProfileManagement />;
    if (currentView === "analytics") return <AnalyticsReporting />;
    return (
      <div className="empty-state">
        <h2>Welcome</h2>
        <p>Select an option from the left menu.</p>
      </div>
    );
  };

  const title =
    menu.find((m) => m.key === currentView)?.label || "News Blog Dashboard";

  return (
    <div className="dashboard-shell">

      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-title">Menu</div>

          <div className="menu">
            {menu.map((item) => (
              <button
                key={item.key}
                className={`menu-btn ${currentView === item.key ? "active" : ""}`}
                onClick={() => setCurrentView(item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="main-view">
          <div className="content-card">{renderMain()}</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;




// import React, { useState } from 'react';
// import DashboardForm from '../form/DashboardForm';
// import './Dashboard-style.css';
// import AnalyticsReporting  from '../analytics/AnalyticsReporting';
// import UserProfileManagement from '../userprofile/UserProfileManagement';

// const Dashboard = () => {
//     const [currentView, setCurrentView] = useState('');

//     const handleButtonClick = (view) => {
//         setCurrentView(view);
//     };

//     const handleFormSubmit = () => {
//         setCurrentView('');
//     };

//     return (
//         <div className="dashboard-container">
//             <header className="dashboard-header">
//                 <h1>News Blog Dashboard</h1>
//                 <nav>
//                     <a href="/">Home</a>
//                     <a href="/login">Login</a>
//                 </nav>
//             </header>
//             <div className="dashboard-content">
//             <aside className="sidebar">
//                     <h2>Menu</h2>
//                     <ul>
//                         <li>
//                             <button onClick={() => handleButtonClick('addNews')}>Add News</button>
//                         </li>
//                         <li>
//                             <button onClick={() => handleButtonClick('editNews')}>Edit News</button>
//                         </li>
//                         <li>
//                             <button onClick={() => handleButtonClick('userProfile')}>User Profile Management</button>
//                         </li>
//                         <li>
//                             <button onClick={() => handleButtonClick('analytics')}>Analytics Reporting</button>
//                         </li>
//                     </ul>
//                 </aside>
//                 <main className="main-view">
//                     {currentView === 'addNews' && <DashboardForm onFormSubmit={handleFormSubmit} />}
//                     {currentView === 'editNews' && <div>Edit News Component</div>}
//                     {currentView === 'userProfile' && <UserProfileManagement />}
//                     {currentView === 'analytics' && <AnalyticsReporting />}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
