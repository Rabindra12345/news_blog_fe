import "./content-grid-style.css";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from '../../api/config';
import axios from "axios";

const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const makeExcerpt = (plainText, limit = 120) => {
  if (!plainText) return "";
  if (plainText.length <= limit) return plainText;
  const cut = plainText.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "...";
};

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content; // Spring pageable
  if (Array.isArray(data?.data)) return data.data;       // common wrapper
  if (Array.isArray(data?.result)) return data.result;   // common wrapper
  return [];
};

const ContentGrid = () => {
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    setErrorMsg("");

    console.log("BASE URL __________:)"+API_BASE_URL);
    axios
      .get(`${API_BASE_URL}/public/api/entertainment/news`) 
      .then((res) => {
        const list = normalizeList(res.data);
        setEntertainmentNews(list);
      })
      .catch((err) => {
        console.error("Entertainment API error:", err);
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setErrorMsg("Entertainment API is protected (401/403). Use public endpoint or send JWT.");
        } else {
          setErrorMsg("Failed to load entertainment posts.");
        }
        setEntertainmentNews([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = useMemo(() => {
    return (entertainmentNews || []).map((ent) => {
      const cover =
        Array.isArray(ent?.imageUrl) && ent.imageUrl.length > 0
          ? ent.imageUrl[0]
          : null;

      const plain = stripHtml(ent?.textBody || "");
      return {
        newsId: ent.newsId,
        title: ent.textTitle || "Untitled",
        cover,
        excerpt: makeExcerpt(plain, 120),
      };
    });
  }, [entertainmentNews]);

  return (
    <section className="entertainment-section">
      <div className="entertainment-header">
        <h2>Entertainment</h2>
      </div>

      {loading && (
        <div className="entertainment-empty">Loading entertainment...</div>
      )}

      {!loading && errorMsg && (
        <div className="entertainment-empty">{errorMsg}</div>
      )}

      {!loading && !errorMsg && cards.length === 0 && (
        <div className="entertainment-empty">No entertainment posts available</div>
      )}

      {!loading && !errorMsg && cards.length > 0 && (
        <div className="entertainment-cards">
          {cards.map((c) => (
            <Link key={c.newsId} to={`/news/${c.newsId}`} className="entertainment-card">
              <div className="entertainment-img">
                {c.cover ? (
                  <img src={c.cover} alt={c.title} />
                ) : (
                  <div className="img-placeholder">No Image</div>
                )}
              </div>
              <div className="entertainment-content">
                <h3 title={c.title}>{c.title}</h3>
                <p>{c.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ContentGrid;



// import './content-grid-style.css';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// // import axios from '../../utils/axiosConfig';


// const ContentGrid = () => {
//     const [entertainmentNews, setEntertainmentNews] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:8081/api/entertainment')
//             .then(response => {
//                 console.log('Fetched entertainment data:', response.data);
//                 setEntertainmentNews(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching entertainment news:', error);
//             });
//     }, []);

//   return (
//     <div className="entertainment-section">
//     <h2>Entertainment</h2>
//     <div className="entertainment-cards">
        
//         {entertainmentNews.map((ent, index) => (
//             <div key={index} className="entertainment-card">
//                 <div className="entertainment-img">Image</div>
//                 <div className="entertainment-content">
//                     <h3>{ent.textTitle}</h3>
//                     <p>{ent.textBody}</p>
//                 </div>
//             </div>
//         ))}


//         {/* Static Cards for demonstration */}
//         {!entertainmentNews.length && (
//             <>
//                 <div className="entertainment-card">
//                     <div className="entertainment-img">Image</div>
//                     <div className="entertainment-content">
//                         <h3>Entertainment Headline 1</h3>
//                         <p>Brief description for entertainment content 1...</p>
//                     </div>
//                 </div>
//                 <div className="entertainment-card">
//                     <div className="entertainment-img">Image</div>
//                     <div className="entertainment-content">
//                         <h3>Entertainment Headline 2</h3>
//                         <p>Brief description for entertainment content 2...</p>
//                     </div>
//                 </div>
//                 <div className="entertainment-card">
//                     <div className="entertainment-img">Image</div>
//                     <div className="entertainment-content">
//                         <h3>Entertainment Headline 3</h3>
//                         <p>Brief description for entertainment content 3...</p>
//                     </div>
//                 </div>
//             </>
//         )}
//     </div>
// </div>
//   );
// };

// export default ContentGrid;

