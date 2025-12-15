
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./NewsList.css";
import ContentGrid from "../contentgrid/ContentGrid";
import PopularPost from "../popularpost/PopularPost";
import axios from "axios";
import { API_BASE_URL } from '../../api/config';

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

  const cut = plainText.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trim() + "...";
};

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [rotateTick, setRotateTick] = useState(0);

  const postsPerPage = 3;



  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/public/api/news`)
      .then((res) => setNews(res.data || []))
      .catch((err) => console.error("Error fetching news:", err))
      .finally(() => setLoading(false));
  }, []);


  useEffect(() => {
    if (loading) return;

    const id = setInterval(() => {
      setRotateTick((t) => t + 1);
    }, 4000); 

    return () => clearInterval(id);
  }, [loading, currentPage]);

  const totalPages = Math.ceil(news.length / postsPerPage);

  //  UPDATED: currentPosts now rotates/swallows order inside the page
  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    const pagePosts = news.slice(start, start + postsPerPage);

    if (pagePosts.length <= 1) return pagePosts;

    // move last card to top every tick
    const k = rotateTick % pagePosts.length;

    return k === 0
      ? pagePosts
      : [...pagePosts.slice(-k), ...pagePosts.slice(0, -k)];
  }, [news, currentPage, rotateTick]);

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
                  const cover =
                    Array.isArray(post.imageUrl) && post.imageUrl.length > 0
                      ? post.imageUrl[0]
                      : null;

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
