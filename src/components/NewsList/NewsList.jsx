import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./NewsList.css";
import ContentGrid from "../contentgrid/ContentGrid";
import PopularPost from "../popularpost/PopularPost";

const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString();
};

const makeExcerpt = (plainText, limit = 320) => {
  if (!plainText) return "";
  if (plainText.length <= limit) return plainText;

  // cut at word boundary so it doesn’t look ugly
  const cut = plainText.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trim() + "...";
};

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const postsPerPage = 3;

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8081/public/api/news")
      .then((res) => setNews(res.data || []))
      .catch((err) => console.error("Error fetching news:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(news.length / postsPerPage);

  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return news.slice(start, start + postsPerPage);
  }, [news, currentPage]);

  return (
    <div className="home">
      <div className="home-shell">
        <div className="home-grid">
          <aside className="ad ad-left">Left Ad</aside>

          <main className="feed">
            <div className="feed-header">
              <h1>मुख्य हेडलाईनस् !!</h1>
              <p>Latest updates from your blog</p>
            </div>

            {loading ? (
              <div className="skeleton-list">
                <div className="skeleton-card" />
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            ) : currentPosts.length ? (
              <div className="post-list">
                {currentPosts.map((post) => {
                  const plain = stripHtml(post.textBody || "");
                  const excerpt = makeExcerpt(plain, 320);

                  // Cover image: use first image only (prevents messy layouts)
                  const cover =
                    Array.isArray(post.imageUrl) && post.imageUrl.length > 0
                      ? post.imageUrl[0]
                      : null;

                  // Only show "Read more" when content is actually long enough
                  const showReadMore = plain.length > 360;

                  return (
                    <article key={post.newsId} className="post-card">
                      <div className="post-media">
                        {cover ? (
                          <img src={cover} alt={post.textTitle || "News"} />
                        ) : (
                          <div className="post-media-placeholder">No Image</div>
                        )}
                      </div>

                      <div className="post-content">
                        <Link className="post-title" to={`/news/${post.newsId}`}>
                          {post.textTitle}
                        </Link>

                        <div className="post-meta">
                          <span>Published: {formatDate(post.publishedDate)}</span>
                        </div>

                        <p className="post-excerpt">{excerpt}</p>

                        {showReadMore && (
                          <div className="post-actions">
                            <Link className="read-more" to={`/news/${post.newsId}`}>
                              Read more
                            </Link>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty">No posts available</div>
            )}

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onChange={setCurrentPage}
            />

            <ContentGrid />
          </main>

          <aside className="sidebar">
            <div className="sidebar-sticky">
              <PopularPost />
            </div>
          </aside>

          <aside className="ad ad-right">Right Ad</aside>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ totalPages, currentPage, onChange }) => {
  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="news-pagination">
      <button
        className="news-page-btn"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        type="button"
      >
        Prev
      </button>

      {start > 1 && (
        <>
          <button className="news-page-btn" onClick={() => onChange(1)} type="button">
            1
          </button>
          {start > 2 && <span className="dots">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`news-page-btn ${p === currentPage ? "active" : ""}`}
          onClick={() => onChange(p)}
          type="button"
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="dots">…</span>}
          <button
            className="news-page-btn"
            onClick={() => onChange(totalPages)}
            type="button"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="news-page-btn"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        type="button"
      >
        Next
      </button>
    </nav>
  );
};

export default NewsList;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './NewsList.css';
// import ContentGrid from '../contentgrid/ContentGrid';
// import NewsItem from '../NewsItem/NewsItem';
// import PopularPost from '../popularpost/PopularPost';

// const NewsList = () => {
//     const [news, setNews] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const postsPerPage = 3;

//     useEffect(() => {
//         axios.get('http://localhost:8081/public/api/news')
//             .then(response => {
//                 console.log('Fetched news data:', response.data);
//                 setNews(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching news:', error);
//             });
//     }, []);

//     const createParagraphs = (text, charLimit = 500) => {
//         const sentences = text.split('. ');
//         let paragraphs = [];
//         let currentParagraph = '';

//         sentences.forEach(sentence => {
//             if (currentParagraph.length + sentence.length < charLimit) {
//                 currentParagraph += `${sentence}. `;
//             } else {
//                 paragraphs.push(currentParagraph);
//                 currentParagraph = `${sentence}. `;
//             }
//         });

//         if (currentParagraph) paragraphs.push(currentParagraph);
//         return paragraphs;
//     };

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     const indexOfLastPost = currentPage * postsPerPage;
//     const indexOfFirstPost = indexOfLastPost - postsPerPage;
//     const currentPosts = news.slice(indexOfFirstPost, indexOfLastPost);

//     return (
//         <div className="App">
//             <div className="grid-container">
//                 <div className="advertisement left-ad">Left Ad</div>
//                 <div className="content">
//                     <main>
//                         <h1 className="headlines">मुख्य हेडलाईनस् !!</h1>
//                         <div className="posts">
//                             {currentPosts.length ? (
//                                 currentPosts.map(post => (
//                                     <div key={post.newsId} className="post">
//                                         <h3 className="post-title">{post.textTitle}</h3>
//                                         <p className="post-date">Published Date: {post.publishedDate}</p>
//                                         <div className="post-body">
//                                             {post.textBody.length > 300 ? (
//                                                 <p>
//                                                     {post.textBody.substring(0, 300)}...
//                                                     <Link to={`/news/${post.newsId}`} className="see-more-btn">
//                                                         See more
//                                                     </Link>
//                                                 </p>
//                                             ) : (
//                                                 <p>{post.textBody}</p>
//                                             )}
//                                         </div>
//                                         <NewsItem news={post} />
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p>No posts available</p>
//                             )}


//                         </div>
//                         <Pagination
//                             postsPerPage={postsPerPage}
//                             totalPosts={news.length}
//                             paginate={paginate}
//                             currentPage={currentPage}
//                         />
//                         <ContentGrid />
//                     </main>
//                 </div>
//                 <PopularPost />
//                 <div className="advertisement right-ad">Right Ad</div>
//             </div>
//         </div>
//     );
// };

// const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
//     const pageNumbers = [];

//     for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
//         pageNumbers.push(i);
//     }

//     return (
//         <nav className="pagination-container">
//             <ul className="pagination">
//                 {pageNumbers.map(number => (
//                     <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
//                         <button onClick={() => paginate(number)} className="page-link">
//                             {number}
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </nav>
//     );
// };

// export default NewsList;
