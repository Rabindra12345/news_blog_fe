import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './NewsList.css';
import ContentGrid from '../contentgrid/ContentGrid';
import NewsItem from '../NewsItem/NewsItem';
import PopularPost from '../popularpost/PopularPost';
// import NewsDetails from '../newsdetails/NewsDetails';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 3;

    useEffect(() => {
        axios.get('http://localhost:8081/api/news')
            .then(response => {
                console.log('Fetched news data:', response.data);
                setNews(response.data);
            })
            .catch(error => {
                console.error('Error fetching news:', error);
            });
    }, []);

    const createParagraphs = (text, charLimit = 500) => {
        const sentences = text.split('. ');
        let paragraphs = [];
        let currentParagraph = '';

        sentences.forEach(sentence => {
            if (currentParagraph.length + sentence.length < charLimit) {
                currentParagraph += `${sentence}. `;
            } else {
                paragraphs.push(currentParagraph);
                currentParagraph = `${sentence}. `;
            }
        });

        if (currentParagraph) paragraphs.push(currentParagraph);
        return paragraphs;
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = news.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="App">
            <div className="grid-container">
                <div className="advertisement left-ad">Left Ad</div>
                <div className="content">
                    <main>
                        <h1 className="headlines">मुख्य हेडलाईनस् !!</h1>
                        <div className="posts">
                            {currentPosts.length ? (
                                currentPosts.map(post => (
                                    <div key={post.newsId} className="post">
                                        <h3 className="post-title">{post.textTitle}</h3>
                                        <p className="post-date">Published Date: {post.publishedDate}</p>
                                        <div className="post-body">
                                            {post.textBody.length > 300 ? (
                                                <p>
                                                    {post.textBody.substring(0, 300)}...
                                                    <Link to={`/news/${post.newsId}`} className="see-more-btn">
                                                        See more
                                                    </Link>
                                                </p>
                                            ) : (
                                                <p>{post.textBody}</p>
                                            )}
                                        </div>
                                        <NewsItem news={post} />
                                    </div>
                                ))
                            ) : (
                                <p>No posts available</p>
                            )}


                        </div>
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={news.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                        <ContentGrid />
                    </main>
                </div>
                <PopularPost />
                <div className="advertisement right-ad">Right Ad</div>
            </div>
        </div>
    );
};

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="pagination-container">
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NewsList;
