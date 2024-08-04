import './NewsItem-style.css';

const NewsItem = ({ news }) => {
  return (
      <div className="news-item">
          {news.imageUrl && news.imageUrl.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`News Image ${index}`} />
          ))}
      </div>
  );
};

export default NewsItem;

  