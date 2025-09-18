import { useState, useEffect} from 'react'
import { Link, useSearchParams} from "react-router-dom";
// import newsData from "../Data/News.json" // Remove this line
import '../News.css'
import { newsAPI } from "../api/axios"; // Import newsAPI
import { useAuth } from "../auth/AuthContext"; // Import useAuth
import { toast } from 'react-toastify'; // Import toast for success/error messages

function Filter({category}) {
  return(
    <section className="filter-container">
      <Link to="" className='clear-filter-btn'>
        Clear Filter
      </Link>
      <Link
        className={`filter-btn ${category === "Cultural Heritage" ? 'active' : "" }`}
       to="?category=Cultural Heritage"
      >
        Cultural Heritage
      </Link>

      <Link
        className={`filter-btn ${category === "Adventure" ? 'active' : "" }`}
       to="?category=Adventure"
      >
        Adventure
      </Link>

      <Link
        className={`filter-btn ${category === "Food and Drink" ? 'active' : "" }`}
       to="?category=Food and Drink"
      >
        Food & Drink
      </Link>

      <Link
        className={`filter-btn ${category === "Cultural Events" ? 'active' : "" }`}
       to="?category=Cultural Events"
      >
        Cultural Events
      </Link>

      <Link
        className={`filter-btn ${category === "Wildlife" ? 'active' : "" }`}
       to="?category=Wildlife"
      >
        Wildlife
      </Link>

      <Link
        className={`filter-btn ${category === "Historical Sites" ? 'active' : "" }`}
       to="?category=Historical Sites"
      >
        Historical Sites
      </Link>

      <Link
        className={`filter-btn ${category === "Travel Tips" ? 'active' : "" }`}
       to="?category=Travel Tips"
      >
        Travel Tips
      </Link>

      <Link
        className={`filter-btn ${category === "Cultural Experiences" ? 'active' : "" }`}
       to="?category=Cultural Experiences"
      >
        Cultural Experiences
      </Link>

      <Link
        className={`filter-btn ${category === "Urban Exploration" ? 'active' : "" }`}
       to="?category=Urban Exploration"
      >
        Urban Exploration
      </Link>

      <Link
        className={`filter-btn ${category === "Cultural Insights" ? 'active' : "" }`}
       to="?category=Cultural Insights"
      >
        Cultural Insights
      </Link>

    </section>
  )
}

function NewsCard({news, isAdmin, handleDeleteNews}) {
  const date = new Date(news.date);
  news.date = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return(
    <div className='news-card'>
      <img src={news.image} alt={`${news.title} image`} />
      <div>
        <div className="news-info">
          <p className="article-author">{news.author}</p>
          <p className='published-date'>{news.date}</p>
        </div>
        <h3>{news.title}</h3>
        <p className="article-content">{news.content[0].substring(0,100)}...</p>
        <Link 
          to={`${news.id}`}
          className="read-more-btn"
        >
          Read More
          <i className="bi bi-arrow-right"></i>        
        </Link>
        {isAdmin && (
          <Link to={`/admin/news/${news.id}`} className="ms-2 action-icon-btn edit-icon-btn">
            <i className="bi bi-pencil"></i>
          </Link>
        )}
        {isAdmin && (
          <button
            className="ms-2 action-icon-btn delete-icon-btn"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigating to detail page
              handleDeleteNews(news.id);
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        )}
      </div>
    </div>
  )
}

function Pagination({displayPage,setDisplayPage, articles, category, isAdmin, handleDeleteNews}) {
  // const totalArticles = category ? articles.length : newsData.length; // Remove or comment out this line
  const totalArticles = articles.length; // Use articles length for pagination

  const totalPages = Math.ceil(totalArticles / 6);
  const currentPage = Math.floor(displayPage[0] / 6) + 1;
  
  const PageNO = []
  for (let i = 1; i <= totalPages; i++) {
    PageNO.push(i);
  }
  
  const pageNoEl = PageNO.map((number) => (
    <span 
      key={number} 
      className={`page-number ${currentPage === number ? 'active' : ''}`}
    >
      {number}
    </span>
  ));
  
  return (
    <div className="pagination-container">
      <button
        disabled={displayPage[0] === 0}
        onClick={() => setDisplayPage([displayPage[0] - 6, displayPage[1] - 6])}
      >
        <i className="bi bi-arrow-left"></i>
        <p>Previous</p>
      </button>
      <div className="pagination-numbers">
        {pageNoEl}
      </div>
      <button
        disabled={displayPage[1] >= totalArticles}
        onClick={() => {
          setDisplayPage([displayPage[0] + 6, displayPage[1] + 6])
        }}
      >
        <p>Next</p>
        <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  );
}


export default function News() {
  const [displayPage, setDisplayPage] = useState([0,6])
  const [isFilterOn, setIsFilterOn] = useState(true)
  const [searchParam, setSearchParam] = useSearchParams()
  const displayedArticles = []
  const category = searchParam.get("category") 
  const { user } = useAuth(); // Get user info
  const isAdmin = user?.role === "admin"; // Check if user is admin
  const [newsList, setNewsList] = useState([]); // State for fetched news
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [featuredNews, setFeaturedNews] = useState(null); // State for featured news
  
  // Fetch news from API
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allNewsRes, featuredNewsRes] = await Promise.all([
        newsAPI.getAllNews(),
        // newsAPI.getFeaturedNews(), // Fetch featured news concurrently
      ]);

      const allNewsPayload = allNewsRes?.data ?? {};
      const allNewsListCandidate = allNewsPayload?.data?.data || allNewsPayload?.data?.news || allNewsPayload?.data || allNewsPayload?.news || allNewsPayload?.results || [];

      const normalizedAllNews = (Array.isArray(allNewsListCandidate) ? allNewsListCandidate : []).map((n, idx) => {
        const id = n._id || n.id || idx;
        const title = n.title || n.newsTitle || "Untitled News";
        const date = n.date || n.publishedDate || '';
        const category = n.category || '';
        const image = n.image || n.imageUrl || "https://via.placeholder.com/600x400?text=News";
        const content = Array.isArray(n.content) ? n.content : [n.content || ''];
        const author = typeof n.author === 'object' && n.author !== null
          ? `${n.author.FirstName || ''} ${n.author.LastName || ''}`.trim()
          : n.author || 'Admin';
        const isFeatured = n.isFeatured || false;
        const status = n.status || 'published';

        return { id, title, date, category, image, content, author, isFeatured, status };
      });
      setNewsList(normalizedAllNews);
      console.log(normalizedAllNews);
      

      // const featuredNewsPayload = featuredNewsRes?.data ?? {};
      // const featuredNewsData = featuredNewsPayload?.data?.data || featuredNewsPayload?.data?.news || featuredNewsPayload?.data || featuredNewsPayload?.news || featuredNewsPayload?.results || null;
      // setFeaturedNews(featuredNewsData); // Set the featured news

    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.response?.data?.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await newsAPI.deleteNews(id);
        toast.success("News item deleted successfully!");
        fetchNews(); // Refresh the list
      } catch (err) {
        console.error("Error deleting news item:", err);
        toast.error(err.response?.data?.message || 'Failed to delete news item.');
      }
    }
  };

  // Fetch news on component mount and filter changes
  useEffect(() => {
    fetchNews();
  }, []); // Empty dependency array to fetch only once on mount

  // Reset pagination when filters change
    useEffect(() => {
      setDisplayPage([0, 6]);
    }, [category]);

  // Find the earliest article (now use featuredNews state)
  let earliestArticleToDisplay = featuredNews; // Use fetched featured news

  // If no specific featured news, fallback to the first item in the list (if any)
  if (!earliestArticleToDisplay && newsList.length > 0) {
    earliestArticleToDisplay = newsList[0];
  }
  
  // Filter articles based on category (now from newsList)
  const articles = newsList.filter(news => {
    const isFeaturedInList = earliestArticleToDisplay ? news.id === earliestArticleToDisplay.id : false;
    if (category) {
      return news.category === category && !isFeaturedInList;
    } else {
      return !isFeaturedInList;
    }
  })

  for (let i = displayPage[0]; i < displayPage[1] + 1; i++) {
    articles[i] && displayedArticles.push(articles[i])
  }

  const newsEl= displayedArticles.map(news => (
    <NewsCard key={news.id} news={news} isAdmin={isAdmin} handleDeleteNews={handleDeleteNews} />
  ))

  console.log("News List:", newsList);
  console.log("Featured News:", featuredNews);
  console.log("Loading:", loading);
  console.log("Error:", error);

  if (loading) return <p className="text-center mt-4">Loading news...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error}</p>;

  return(
    <main className='news-container-main'>
      <h1>Latest News
        {isAdmin && (
          <Link to="/admin/news/new" className="btn btn-primary btn-sm ms-3">
            Add New News
          </Link>
        )}
      </h1>
      {earliestArticleToDisplay && (
        <div className="latest-article-container">
          <img 
            src={earliestArticleToDisplay.image && !earliestArticleToDisplay.image.startsWith("file:///")
              ? earliestArticleToDisplay.image
              : "https://placehold.co/600x400?text=Image+Not+Available"}
            alt={`${earliestArticleToDisplay.title} image`} />
          <div>
            <p className="article-category">{earliestArticleToDisplay.category}</p>
            <h3>{earliestArticleToDisplay.title}</h3>
            <p className="article-content">
              {earliestArticleToDisplay.content && earliestArticleToDisplay.content.length > 0
                ? `${earliestArticleToDisplay.content[0].substring(0, 120)}...`
                : ''}
            </p>
            <Link 
              to={`${earliestArticleToDisplay.id}`}
              className="read-more-btn">
              Read More
              <i className="bi bi-arrow-right"></i>        
            </Link>
          </div>
        </div>
      )}
      <h2>Our Recent News</h2>
      {isFilterOn ? <button 
        className="news-filter-off" 
        onClick={() => setIsFilterOn(prev => !prev)}>
        <i className="bi bi-x-lg"></i>
      </button> : <button 
        className='news-filter-on' 
        onClick={() => setIsFilterOn(prev => !prev)}>
        <i className="bi bi-funnel"></i>
      </button>}
      {isFilterOn && <Filter category={category}/>}
      <div className="news-container">
        {newsEl}
      </div>
      <Pagination 
        displayPage={displayPage}
        setDisplayPage={setDisplayPage}
        articles={articles}
        category={category}
        isAdmin={isAdmin}
        handleDeleteNews={handleDeleteNews}
      />
    </main>
    
  )
}
