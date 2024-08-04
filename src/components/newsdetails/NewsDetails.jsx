import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NewsDetails = () => {
    const { newsId } = useParams(); // Getting the newsId from the URL
    const [news, setNews] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/api/news/${newsId}`)
            .then(response => {
                setNews(response.data);
            })
            .catch(error => {
                console.error('Error fetching news details:', error);
            });
    }, [newsId]);

    const createParagraphs = (text, charLimit = 500) => {
        const sentences = text.split('. ');
        let paragraphs = [];
        let currentParagraph = '';

        sentences.forEach(sentence => {
            if (currentParagraph.length + sentence.length < charLimit) {
                currentParagraph += `${sentence}. `;
            } else {
                paragraphs.push(currentParagraph.trim());
                currentParagraph = `${sentence}. `;
            }
        });

        if (currentParagraph) paragraphs.push(currentParagraph.trim());
        return paragraphs;
    };

    if (!news) {
        return <div>Loading...</div>;
    }

    const paragraphs = createParagraphs(news.textBody);

    return (
        <div>
            <h1>{news.textTitle}</h1>
            <p>{news.publishedDate}</p>
            {paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
            ))}
        </div>
    );
};

export default NewsDetails;
