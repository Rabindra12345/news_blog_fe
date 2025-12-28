import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./NewsDetails.css";
import { API_BASE_URL } from "../../api/config";
import axios from "axios";

const MEDIA_PREFIX = "/media/newsBlog/";

const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user?.userId ?? null;
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "TABLET";
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  )
    return "MOBILE";
  return "DESKTOP";
};

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

  const sessionId = useMemo(() => getSessionId(), []);
  const [startTime] = useState(() => Date.now());

  // Track VIEW interaction when component mounts (deduped for React StrictMode)
  useEffect(() => {
    if (!newsId) return;

    const userId = getUserId();

    // DEDUPE: stop double call caused by React 18 StrictMode re-mount
    // Allows real revisits later (only blocks repeats within 2 seconds)
    const dedupeKey = `view:${newsId}:${sessionId}`;
    const now = Date.now();
    const last = Number(sessionStorage.getItem(dedupeKey) || "0");
    if (last && now - last < 2000) return;
    sessionStorage.setItem(dedupeKey, String(now));

    const trackView = async () => {
      try {
        await axios.post("http://localhost:8081/api/interactions/track", {
          newsId,
          sessionId,
          userId,
          interactionType: "VIEW",
          referrerUrl: document.referrer,
          deviceType: getDeviceType(),
        });
        console.log("View tracked successfully");
      } catch (err) {
        console.error("Error tracking view:", err);
      }
    };

    trackView();
  }, [newsId, sessionId]);

  // Track read duration when user leaves
  useEffect(() => {
    if (!newsId) return;

    const userId = getUserId();

    const trackReadDuration = () => {
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

      if (durationSeconds >= 3) {
        const data = JSON.stringify({
          newsId,
          sessionId,
          userId,
          durationSeconds,
        });

        const blob = new Blob([data], { type: "application/json" });
        navigator.sendBeacon("http://localhost:8081/api/interactions/read-duration", blob);
      }
    };

    return () => {
      trackReadDuration();
    };
  }, [newsId, sessionId, startTime]);

  // Track visibility changes (user switches tabs)
  useEffect(() => {
    if (!newsId) return;

    const userId = getUserId();
    let visibilityStartTime = Date.now();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const durationSeconds = Math.floor((Date.now() - visibilityStartTime) / 1000);

        if (durationSeconds >= 3) {
          axios
            .post(`${API_BASE_URL}/api/interactions/read-duration`, {
              newsId,
              sessionId,
              userId,
              durationSeconds,
            })
            .catch((err) => console.error("Error tracking duration:", err));
        }
      } else {
        visibilityStartTime = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [newsId, sessionId]);

  // Fetch news details
  useEffect(() => {
    if (!newsId) return;

    const controller = new AbortController();
    setLoading(true);
    setError("");

    axios
      .get(`${API_BASE_URL}/public/api/news/${newsId}`, { signal: controller.signal })
      .then((res) => setNews(res.data))
      .catch((err) => {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        console.error("Error fetching news details:", err);
        setError(err?.response?.data?.message || "Failed to load news details");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
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
          if (path.startsWith("/")) return `${API_BASE_URL}${path}`;

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


// import React, { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./NewsDetails.css";
// import { API_BASE_URL } from '../../api/config';
// import axios from "axios";

// const MEDIA_PREFIX = "/media/newsBlog/";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "";
//   const d = new Date(dateStr);
//   if (Number.isNaN(d.getTime())) return dateStr;
//   return d.toLocaleString();
// };

// const NewsDetails = () => {
//   const { newsId } = useParams();
//   const [news, setNews] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!newsId) return;

//     const controller = new AbortController(); // cancels the duplicate call in StrictMode
//     setLoading(true);
//     setError("");
//     axios
//       .get(`${API_BASE_URL}/public/api/news/${newsId}`, {
//         signal: controller.signal,
//       })
//       .then((res) => {
//         setNews(res.data);
//       })
//       .catch((err) => {
//         //  ignore cancellation error
//         if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;

//         console.error("Error fetching news details:", err);
//         setError(err?.response?.data?.message || "Failed to load news details");
//       })
//       .finally(() => {
//         // if request was canceled, don't flip loading incorrectly
//         if (!controller.signal.aborted) setLoading(false);
//       });

//     return () => controller.abort(); // cleanup cancels in-flight request
//   }, [newsId]);

//   const images = useMemo(() => {
//     if (!news) return [];

//     if (Array.isArray(news.imageUrl) && news.imageUrl.length > 0) {
//       return news.imageUrl.filter(Boolean);
//     }
//     if (Array.isArray(news.images) && news.images.length > 0) {
//       return news.images
//         .map((img) => img?.imageUrl)
//         .filter(Boolean)
//         .map((path) => {
//           if (path.startsWith("data:image/")) return path;
//           if (path.startsWith("http://") || path.startsWith("https://")) return path;
//           if (path.startsWith("/")) return `${API_BASE_URL}${path}`; // already web path

//           const fileName = String(path).split("/").pop();
//           return `${API_BASE_URL}${MEDIA_PREFIX}${fileName}`;
//         });
//     }

//     return [];
//   }, [news]);

//   if (error) return <div className="nd-shell">{error}</div>;
//   if (loading || !news) return <div className="nd-shell">Loading...</div>;

//   return (
//     <div className="nd-shell">
//       <div className="nd-card">
//         <h1 className="nd-title">{news.textTitle}</h1>
//         <div className="nd-meta">Published: {formatDate(news.publishedDate)}</div>

//         {images.length > 0 && (
//           <div className="nd-gallery">
//             {images.map((src, i) => (
//               <div className="nd-imgWrap" key={`${i}-${src.slice(0, 40)}`}>
//                 <img src={src} alt={`news-${i}`} loading="lazy" />
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="nd-body" dangerouslySetInnerHTML={{ __html: news.textBody }} />
//       </div>
//     </div>
//   );
// };

// export default NewsDetails;

