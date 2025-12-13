import "./NewsItem-style.css";

const NewsItem = ({ news }) => {
  const cover =
    Array.isArray(news?.imageUrl) && news.imageUrl.length > 0
      ? news.imageUrl[0]
      : null;

  if (!cover) return null;

  return (
    <div className="news-item">
      <img className="news-item-img" src={cover} alt={news?.textTitle || "News"} />
    </div>
  );
};

export default NewsItem;


  