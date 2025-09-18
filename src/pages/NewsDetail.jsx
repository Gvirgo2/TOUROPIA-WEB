import { Link, useParams} from "react-router-dom";
import '../News.css'
import { newsAPI } from "../api/axios"; // Import newsAPI
import React, { useState, useEffect } from 'react'; // Import useState and useEffect


function SimilarArticles({article}) {
  return (
    <div className="similarArticle">
      <img src={article.image} alt={`${article.image} image`} />
      <div>
        <h3>{article.title.substring(0,50)}...</h3>
        <p>{article.content[0].substring(0,50)}...</p>
        <Link 
          to={`/news/${article._id}`}
          className="read-more-btn"
        >
          Read More
          <i className="bi bi-arrow-right"></i>        
        </Link>
      </div>
    </div>
  )       
}
 
export default function NewsDetail() {
  const { newsId } = useParams();
  const [news, setNews] = useState(null);
  const [similarArticles, setSimilarArticles] = useState([]); // New state for similar articles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (newsId) { // Only fetch if newsId is available
          const res = await newsAPI.getNewsById(newsId);
          const newsData = res?.data?.data?.data || res?.data?.data || res?.data;
          setNews(newsData);
          console.log(newsData);
          
          setLoading(false);
        } else {
          setLoading(false);
          setError('News ID is missing.');
        }
      } catch (err) {
        console.error("Error fetching news details:", err);
        setError(err.response?.data?.message || 'Failed to load news details');
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  useEffect(() => {
    const fetchSimilarArticles = async () => {
      try {
        if (news) {
          const res = await newsAPI.getByCategory(news.category);
          const articles = await res?.data?.data?.data;
          // Exclude the current article from similar articles
          const filteredArticles = articles.filter(article => article.id !== news.id);
          setSimilarArticles(filteredArticles);
        }
      } catch (err) {
        console.error("Error fetching similar articles:", err);
      }
    };
    fetchSimilarArticles();
  }, [news]);

  if (loading) {
    return (
      <div className="container py-5">
        <p>Loading news details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <p className="text-danger">Error: {error}</p>
        <Link to="/news" className="btn btn-success">Back to News</Link>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container py-5">
        <p>News item not found.</p>
        <Link to="/news" className="btn btn-success">Back to News</Link>
      </div>
    );
  }

  const paragraphEl = news.content.map((paragraph, index) => (<p key={index}>{paragraph}</p>));
  const similarArticlesEl = similarArticles.length ? similarArticles.map(article => (<SimilarArticles key={article.id} article={article}/>)) : null;
  console.log(similarArticles);
  
  return(
    <>
    {news ? 
      <main className="news-detail-main">
        <section className="news-detail-container">
          <div className="news">
            <Link to="/news" className="back-link">
              <i className="bi bi-arrow-left"></i>
              Back to all articles
            </Link>
            <img src={news.image} alt={`${news.title} image`} className="news-detail-img"/>
            <div className="news-info">
              <p>{news.author.FirstName} {news.author.LastName}</p>
              <p>{news.formattedDate}</p>
            </div>
            <h1>{news.title}</h1>
            <div>
              {paragraphEl}
            </div>
          </div>
          <div className="similar-articles-container">
            {similarArticles.length !== 0 ? <h2>Similar Articles</h2> : ""}
            {similarArticlesEl}
          </div>
        </section>
        <section className="news-cta-section">
          <h2>Ready to start your journey?</h2>
          <Link to="/tours">Book Now</Link>
        </section>
      </main> : 
      <p>Loading ...</p>}
    </>
  )
}