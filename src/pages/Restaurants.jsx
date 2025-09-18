import React, { useState, useEffect, useContext } from "react";
// import restaurantData from "../Data/Restaurant.json"; // Remove this line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "../context/CartContext";   
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../auth/AuthContext"; // Import useAuth
import { restaurantAPI } from "../api/axios"; // Import restaurantAPI
import RestaurantCard from "../components/RestaurantCard"; // Import RestaurantCard

function Restaurants() {
  const { addToCart } = useContext(CartContext);  

  const [filters, setFilters] = useState({
    location: "",
    cuisine: "",
    date: "",
    guests: 1,
    rating: null,
    offers: { popular: false, discount: false },
    dateFrom: "",
  });

  // const [filteredData, setFilteredData] = useState(restaurantData); // Remove or comment out this line
  const [restaurants, setRestaurants] = useState([]); // New state for fetched restaurants
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filteredData, setFilteredData] = useState([]); // Initialize filteredData for API use
  const [visibleCount, setVisibleCount] = useState(9);
  const navigate = useNavigate();
  const { user } = useAuth(); // Use useAuth to get user info
  const isAdmin = user?.role === "admin"; // Check if user is admin
  const location = useLocation(); // Initialize useLocation

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        offers: { ...prev.offers, [name]: checked },
      }));
    } else if (type === "number") {
      setFilters((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await restaurantAPI.getAllRestaurants();
      const payload = res?.data ?? {};
      const listCandidate = payload?.data?.data || payload?.data?.restaurants || payload?.data || payload?.restaurants || payload?.results || [];
      
      const normalized = (Array.isArray(listCandidate) ? listCandidate : []).map((r, idx) => {
        const id = r._id || r.id || idx;
        const title = r.title || r.name || r.restaurantName || "Untitled Restaurant";
        const location = r.location || r.city || r.address || "";
        const cuisine = r.cuisine || r.type || "";
        const rating = Number(r.rating || r.ratingsAverage || r.averageRating || 0);
        const reviews = Number(r.reviews || r.ratingsQuantity || 0);
        const price = Number(r.price || r.pricePerMeal || r.startingPrice || 0);
        const tag = r.tag || r.category || r.type || "";
        const imagesArr = r.images || r.photos || r.gallery || [];
        const image =
          r.image ||
          r.coverImage ||
          r.imageUrl ||
          (Array.isArray(imagesArr) && imagesArr.length > 0 ? imagesArr[0] : undefined) ||
          "https://via.placeholder.com/600x400?text=Restaurant";

        return { id, title, location, cuisine, rating, reviews, price, tag, image };
      });

      setRestaurants(normalized);
      setFilteredData(normalized); // Initialize filteredData with all restaurants
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError(err.response?.data?.message || 'Failed to load restaurants');
      toast.error(err.response?.data?.message || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [location.pathname]); // Fetch on component mount and path changes

  useEffect(() => {
    let results = [...restaurants]; // Use fetched restaurants for filtering

    if (filters.location) {
      results = results.filter((item) =>
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.cuisine) {
      results = results.filter((item) =>
        item.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }
    if (filters.guests > 1) {
      results = results.filter((item) => item.capacity >= filters.guests);
    }
    if (filters.rating) {
      results = results.filter((item) => item.rating >= filters.rating);
    }
    if (filters.offers.popular) {
      results = results.filter((item) => item.popularChoice);
    }
    if (filters.offers.discount) {
      results = results.filter((item) => item.discountAvailable);
    }
    if (filters.dateFrom) {
      results = results.filter((item) => new Date(item.dateFrom) >= new Date(filters.dateFrom));
    }

    setFilteredData(results);
    setVisibleCount(9);
  }, [filters, restaurants]); // Add restaurants to dependencies

  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  // When user clicks Book Table → go to detail (cart action can be from detail)
  const handleBookTable = (item) => {
    navigate(`/restaurants/${item.id}`);
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await restaurantAPI.deleteRestaurant(restaurantId);
        toast.success("Restaurant deleted successfully!");
        fetchRestaurants(); // Refresh the list
      } catch (err) {
        console.error("Error deleting restaurant:", err);
        toast.error(err.response?.data?.message || 'Failed to delete restaurant');
      }
    }
  };

  return (
    <div className="main-wrapper">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      <div className="container">
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-lg-3 mb-4">
            <div className="filter-sidebar shadow-sm p-3"style={{ backgroundColor: "#fff", borderRadius: "8px", borderColor: "white"}}>
             <h5 className="fw-bold mb-4 d-flex align-items-center text-light-green fs-4">
                   <i className="ri-filter-3-fill me-2"></i>
                      Advanced Filters
             </h5>



              {/* Destination Filter */}
              <fieldset className="filter-section mb-4">
  <legend
    className="d-flex align-items-center mb-2"
    style={{ color: "#000", fontWeight: "400", marginLeft: "1px" }}>
    <i className="ri-map-pin-line me-2" style={{ color: "#28a745", marginLeft: "5px" }}></i>
    Destination
  </legend>
  <select
    className="form-select shadow-sm"
    name="location"
    value={filters.location}
    onChange={handleChange}
  >
    <option value="">Select Destination</option>
    <option>Addis Ababa</option>
    <option>Hawassa</option>
    <option>Adama</option>
    <option>Gondar</option>
  </select>
</fieldset>

              <fieldset className="filter-section mb-4">
  <legend className="d-flex align-items-center mb-2">
    <i className="ri-flight-takeoff-line me-2"></i>
    Tour Type
  </legend>
  <select
    className="form-select shadow-sm"
    name="cuisine"
    value={filters.cuisine}
    onChange={handleChange}
  >
    <option value="">Select Cuisine Type</option>
    <option>Ethiopian</option>
    <option>Italian</option>
    <option>Indian</option>
    <option>Chinese</option>
    <option>Continental</option>
  </select>
</fieldset>



              {/* Date Filter */}
              <fieldset className="filter-section">
                <legend>
                  <i className="bi bi-calendar-date me-2"></i>Date From
                </legend>
                <input
                  type="date"
                  className="form-control"
                  name="dateFrom"
                  value={filters.dateFrom || ''}
                  onChange={handleChange}
                />
              </fieldset>

              {/* Guests Filter */}
              <fieldset className="filter-section" >
                <legend>
                  <i className="bi bi-person me-2"></i>Guests
                </legend>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Number of Guests"
                  min={1}
                  name="guests"
                  value={filters.guests}
                  onChange={handleChange}
                />
              </fieldset>

              {/* Traveler Rating */}
             <fieldset className="filter-section mb-4">
  <legend
    className="d-flex align-items-center mb-2"
    style={{ color: "#000", fontWeight: "400" }}
  >
    <i className="ri-star-smile-line me-2" style={{ color: "#000" }}></i>
    Traveler Rating
  </legend>

  <div className="d-flex flex-wrap gap-2" style={{ color: "#000", fontWeight: "400" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px 10px",
          backgroundColor: (filters.rating === star) ? "var(--bs-primary)" : "#f8f9fa",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500"
        }}
        onClick={() => setFilters(prev => ({ ...prev, rating: star }))}
      >
        <i className="ri-star-fill text-warning me-1"></i>
        {star}
      </span>
    ))}
  </div>
</fieldset>


              {/* Special Offers */}
              <fieldset className="filter-section">
                <legend>
                  <i className="bi bi-gift me-2"style={{ color: "#000", fontWeight: "400" }}></i>Special Offers
                </legend>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="popular"
                    name="popular"
                    checked={filters.offers.popular}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="popular">
                    Popular Choice
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="discount"
                    name="discount"
                    checked={filters.offers.discount}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="discount">
                    Winter Discounts
                  </label>
                </div>
              </fieldset>

            </div>
        </div>

          {/* Restaurant Cards */}
          <div className="col-lg-9">
            <h4 className="fw-bold mb-4 d-flex justify-content-between align-items-center">
              Available Restaurants
              {isAdmin && (
                <Link to="/admin/restaurants/new" className="btn btn-primary btn-sm">
                  Add New Restaurant
                </Link>
              )}
            </h4>
            {loading && <p className="text-center mt-4">Loading restaurants...</p>}
            {error && !loading && <p className="text-center mt-4 text-danger">Error: {error}</p>}
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {!loading && !error && filteredData.slice(0, visibleCount).map((item) => (
                <RestaurantCard key={item.id} item={item} onBookTable={handleBookTable} onDelete={handleDeleteRestaurant} isAdmin={isAdmin} />
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-success px-4 py-2"
                style={{ color: "#fff" }}
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Restaurants;
