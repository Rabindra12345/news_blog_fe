import React, { useState, useEffect } from 'react';

const UserProfileManagement = () => {
    const [userProfiles, setUserProfiles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/api/users')
            .then(response => response.json())
            .then(data => setUserProfiles(data))
            .catch(error => console.error('Error fetching user profiles:', error));
    }, []);

    return (
        <div>
            <h2>User Profile Management</h2>
            <ul>
                {userProfiles.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserProfileManagement;
