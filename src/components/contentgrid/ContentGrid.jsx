import './content-grid-style.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentGrid = () => {
    const [entertainmentNews, setEntertainmentNews] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/api/entertainment')
            .then(response => {
                console.log('Fetched entertainment data:', response.data);
                setEntertainmentNews(response.data);
            })
            .catch(error => {
                console.error('Error fetching entertainment news:', error);
            });
    }, []);

  return (
    <div className="entertainment-section">
    <h2>Entertainment</h2>
    <div className="entertainment-cards">
        {entertainmentNews.map((ent, index) => (
            <div key={index} className="entertainment-card">
                <div className="entertainment-img">Image</div>
                <div className="entertainment-content">
                    <h3>{ent.textTitle}</h3>
                    <p>{ent.textBody}</p>
                </div>
            </div>
        ))}
        {/* Static Cards for demonstration */}
        {!entertainmentNews.length && (
            <>
                <div className="entertainment-card">
                    <div className="entertainment-img">Image</div>
                    <div className="entertainment-content">
                        <h3>Entertainment Headline 1</h3>
                        <p>Brief description for entertainment content 1...</p>
                    </div>
                </div>
                <div className="entertainment-card">
                    <div className="entertainment-img">Image</div>
                    <div className="entertainment-content">
                        <h3>Entertainment Headline 2</h3>
                        <p>Brief description for entertainment content 2...</p>
                    </div>
                </div>
                <div className="entertainment-card">
                    <div className="entertainment-img">Image</div>
                    <div className="entertainment-content">
                        <h3>Entertainment Headline 3</h3>
                        <p>Brief description for entertainment content 3...</p>
                    </div>
                </div>
            </>
        )}
    </div>
</div>
  );
};

export default ContentGrid;

