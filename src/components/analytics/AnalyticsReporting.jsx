import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsReporting = () => {
    const [analyticsData, setAnalyticsData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/api/analytics')
            .then(response => response.json())
            .then(data => setAnalyticsData(data))
            .catch(error => console.error('Error fetching analytics data:', error));
    }, []);

    return (
        <div>
            <h2>Analytics Reporting</h2>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={analyticsData}>
                        <Line type="monotone" dataKey="pageViews" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsReporting;
