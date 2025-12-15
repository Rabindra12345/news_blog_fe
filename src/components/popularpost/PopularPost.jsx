import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PopularPost-style.css";
import axios from "axios";
import { API_BASE_URL } from '../../api/config';

const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const PopularPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/public/api/popular/news?limit=5`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setPosts(data);
      })
      .catch((err) => {
        console.error("Popular posts fetch error:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="popular">
      <div className="popular-card">
        <div className="popular-header">
          <h3>Most Visited</h3>
          <span className="popular-badge">Top</span>
        </div>

        {loading ? (
          <div className="popular-loading">Loading...</div>
        ) : posts.length ? (
          <div className="popular-list">
            {posts.map((p) => {
              const cover =
                Array.isArray(p?.imageUrl) && p.imageUrl.length > 0 ? p.imageUrl[0] : null;

              const title = (p?.textTitle || "Untitled").trim();
              const excerpt = stripHtml(p?.textBody || "").slice(0, 60);

              return (
                <Link key={p.newsId} to={`/news/${p.newsId}`} className="popular-item">
                  <div className="popular-thumb">
                    {cover ? (
                      <img src={cover} alt={title} />
                    ) : (
                      <div className="popular-thumb-placeholder">No</div>
                    )}
                  </div>

                  <div className="popular-meta">
                    <div className="popular-title" title={title}>
                      {title}
                    </div>
                    {!!excerpt && <div className="popular-sub">{excerpt}...</div>}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="popular-empty">No popular posts yet</div>
        )}
      </div>
    </section>
  );
};

export default PopularPost;