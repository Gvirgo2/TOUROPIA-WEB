import React, { useState, useEffect } from 'react';
import { newsAPI } from '../../api/axios'; // Adjust path as necessary
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

const NewNews = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for editing
  const newId = Math.random(); // Initialize newId
  const [formData, setFormData] = useState({
    id: newId,
    title: '',
    date: '',
    category: '',
    image: '',
    content: [''], // Array of strings for paragraphs
    isFeatured: false,
    status: 'published',
  });
  const [loading, setLoading] = useState(false);

  // Fetch news data if ID is present (for editing)
  useEffect(() => {
    if (id) {
      const fetchNews = async () => {
        try {
          const res = await newsAPI.getNewsById(id); // Assuming getNewsById will be implemented later
          const newsData = res?.data?.data?.data || res?.data?.data || res?.data;
          if (newsData) {
            setFormData({
              title: newsData.title || '',
              date: newsData.date ? new Date(newsData.date).toISOString().split('T')[0] : '',
              category: newsData.category || '',
              image: newsData.image || '',
              content: Array.isArray(newsData.content) ? newsData.content : [''],
              isFeatured: newsData.isFeatured || false,
              status: newsData.status || 'published',
            });
          }
        } catch (error) {
          console.error('Error fetching news:', error);
          toast.error('Failed to load news data.');
          navigate('/admin/news/new'); // Redirect to create if fetching fails
        }
      };
      fetchNews();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'content') {
      // Handle content array updates: split by newline
      setFormData((prev) => ({
        ...prev,
        content: value.split('\n'), // Split textarea value by newlines
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        // Update existing news item (assuming updateNews will be implemented later)
        await newsAPI.updateNews(id, formData); 
        toast.success('News item updated successfully!');
      } else {
        // Create new news item
        await newsAPI.createNews(formData);
        toast.success('News item created successfully!');
      }
      navigate('/news', { state: { newsCreated: true } }); // Redirect to news list
    } catch (error) {
      console.error(id ? 'Error updating news item:' : 'Error creating news item:', error);
      toast.error(error.response?.data?.message || (id ? 'Failed to update news item.' : 'Failed to create news item.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <h2 className="mb-4 text-center">{id ? 'Edit News Item' : 'Create New News Item'}</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="image" className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            value={formData.content.join('\n')}
            onChange={handleChange}
            rows="10" // Increased rows
            required
          ></textarea>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3 form-check d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isFeatured">Is Featured</label>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update News' : 'Create News')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewNews;
