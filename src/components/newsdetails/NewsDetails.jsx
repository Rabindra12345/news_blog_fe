import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./NewsDetails.css";
import { API_BASE_URL } from '../../api/config';
import axios from "axios";

const MEDIA_PREFIX = "/media/newsBlog/";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString();
};

const NewsDetails = () => {
  const { newsId } = useParams();
  const [news, setNews] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!newsId) return;

    const controller = new AbortController(); // cancels the duplicate call in StrictMode
    setLoading(true);
    setError("");
    axios
      .get(`${API_BASE_URL}/public/api/news/${newsId}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setNews(res.data);
      })
      .catch((err) => {
        //  ignore cancellation error
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;

        console.error("Error fetching news details:", err);
        setError(err?.response?.data?.message || "Failed to load news details");
      })
      .finally(() => {
        // if request was canceled, don't flip loading incorrectly
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort(); // cleanup cancels in-flight request
  }, [newsId]);

  const images = useMemo(() => {
    if (!news) return [];

    if (Array.isArray(news.imageUrl) && news.imageUrl.length > 0) {
      return news.imageUrl.filter(Boolean);
    }
    if (Array.isArray(news.images) && news.images.length > 0) {
      return news.images
        .map((img) => img?.imageUrl)
        .filter(Boolean)
        .map((path) => {
          if (path.startsWith("data:image/")) return path;
          if (path.startsWith("http://") || path.startsWith("https://")) return path;
          if (path.startsWith("/")) return `${API_BASE_URL}${path}`; // already web path

          const fileName = String(path).split("/").pop();
          return `${API_BASE_URL}${MEDIA_PREFIX}${fileName}`;
        });
    }

    return [];
  }, [news]);

  if (error) return <div className="nd-shell">{error}</div>;
  if (loading || !news) return <div className="nd-shell">Loading...</div>;

  return (
    <div className="nd-shell">
      <div className="nd-card">
        <h1 className="nd-title">{news.textTitle}</h1>
        <div className="nd-meta">Published: {formatDate(news.publishedDate)}</div>

        {images.length > 0 && (
          <div className="nd-gallery">
            {images.map((src, i) => (
              <div className="nd-imgWrap" key={`${i}-${src.slice(0, 40)}`}>
                <img src={src} alt={`news-${i}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}

        <div className="nd-body" dangerouslySetInnerHTML={{ __html: news.textBody }} />
      </div>
    </div>
  );
};

export default NewsDetails;

