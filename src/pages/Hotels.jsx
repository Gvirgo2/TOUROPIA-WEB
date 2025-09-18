import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hotelAPI } from "../api/axios"; // Import reviewAPI
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../auth/AuthContext"; // Import useAuth
import HotelCard from "../components/HotelCard"; // Import HotelCard

const Hotels = () => {
const { cartItems, addToCart } = useContext(CartContext);

    // State to manage how many hotels to display
  const [visibleHotels, setVisibleHotels] = useState(6);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    destination: "",
    tourType: "",
    guests: 1,
    rating: null,
    offers: { likely: false, discount: false },
    dateFrom: "",
  });
  const navigate = useNavigate();
  const { user } = useAuth(); // Use useAuth to get user info
  const isAdmin = user?.role === "admin"; // Check if user is admin
  const location = useLocation(); // Initialize useLocation

  const handleBookRoom = (item) => {
    navigate(`/hotels/${item.id}`);
  };

  const handleLoadMore = () => {
    // Show 6 more hotels
    setVisibleHotels(prev => Math.min(prev + 6, filteredData.length));
    toast.success(`Showing ${Math.min(visibleHotels + 6, filteredData.length)} of ${filteredData.length} hotels`);
  };

  const fetchHotels = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await hotelAPI.getAllHotels();
      const payload = res?.data ?? {};
      const listCandidate =
        payload?.data?.data ||
        payload?.data?.hotels ||
        payload?.data ||
        payload?.hotels ||
        payload?.results ||
        [];

      const normalized = (Array.isArray(listCandidate) ? listCandidate : []).map((h, idx) => {
        const id = h._id || h.id || idx;
        const title = h.title || h.name || h.hotelName || "Untitled Hotel";
        const location = h.location || h.city || h.address || "";
        const rating = Number(h.rating || h.ratingsAverage || h.averageRating || 0);
        const reviews = Number(h.reviews || h.ratingsQuantity || 0);
        const price = Number(h.price || h.pricePerNight || h.startingPrice || 0);
        const tag = h.tag || h.category || h.type || "";
        const imagesArr = h.images || h.photos || h.gallery || [];
        const image =
          h.image ||
          h.coverImage ||
          h.imageUrl ||
          (Array.isArray(imagesArr) && imagesArr.length > 0 ? imagesArr[0] : undefined) ||
          "https://via.placeholder.com/600x400?text=Hotel";

        return { id, title, location, rating, reviews, price, tag, image };
      });

      setHotels(normalized);
      setFilteredData(normalized);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load hotels";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await hotelAPI.deleteHotel(id);
        toast.success("Hotel deleted successfully!");
        fetchHotels(); // Refresh the list
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Failed to delete hotel";
        toast.error(msg);
      }
    }
  };

  // Fetch hotels from backend and normalize
  useEffect(() => {
    if (location.state?.hotelCreated) {
        fetchHotels();
        navigate(location.pathname, { replace: true, state: {} }); // Clear the state after use
    } else if (!hotels.length || location.pathname === "/hotels") {
        fetchHotels();
    }
  }, [location.pathname, location.state, navigate, hotels.length]); // Add location.state and navigate to dependencies

  // Get only the hotels to display
  const displayedHotels = filteredData.slice(0, visibleHotels);

  // Apply filters similar to Tours page
  useEffect(() => {
    let results = [...hotels];

    if (filters.destination) {
      results = results.filter((h) =>
        (h.location || "").toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    if (filters.tourType) {
      results = results.filter(
        (h) => (h.type || h.tag || "").toLowerCase() === filters.tourType.toLowerCase()
      );
    }

    if (filters.guests > 1) {
      const guestsKey = (h) => h.guests || h.capacity || h.maxGuests || 0;
      results = results.filter((h) => guestsKey(h) >= filters.guests);
    }

    if (filters.rating) {
      results = results.filter((h) => Number(h.rating || 0) >= filters.rating);
    }

    if (filters.offers.likely) {
      results = results.filter((h) => h.likelyToSellOut);
    }

    if (filters.offers.discount) {
      results = results.filter((h) => h.discountAvailable);
    }

    if (filters.dateFrom) {
      results = results.filter((h) => new Date(h.dateFrom) >= new Date(filters.dateFrom));
    }

    setFilteredData(results);
    setVisibleHotels(6);
  }, [filters, hotels]);

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

  return (
    <div className="main-wrapper">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      <div className="container">
        {loading && <p className="text-center mt-4">Loading hotels...</p>}
        {error && !loading && <p className="text-center mt-4 text-danger">{error}</p>}
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-lg-3 mb-4">
            <div className="filter-sidebar shadow-sm p-3" style={{ backgroundColor: "var(--bs-body-bg)", borderRadius: "8px", border: "1px solid var(--bs-border-color)" }}>
             <h5 className="fw-bold mb-4 d-flex align-items-center text-success fs-4">
                   <i className="ri-filter-3-fill me-2"></i>
                      Advanced Filters
             </h5>

              {/* Destination Filter */}
              <fieldset className="filter-section mb-4">
  <legend
    className="d-flex align-items-center mb-2"
    style={{ color: "var(--bs-body-color)", fontWeight: "400", marginLeft: "1px" }}>
    <i className="ri-map-pin-line me-2" style={{ color: "#28a745", marginLeft: "5px" }}></i>
    Destination
  </legend>
  <select
    className="form-select shadow-sm"
    style={{ backgroundColor: "var(--bs-body-bg)", color: "var(--bs-body-color)", borderColor: "var(--bs-border-color)" }}
    name="destination"
    value={filters.destination}
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
  <legend className="d-flex align-items-center mb-2" style={{ color: "var(--bs-body-color)", fontWeight: "400" }}>
    <i className="ri-flight-takeoff-line me-2" style={{ color: "#28a745" }}></i>
    Tour Type
  </legend>
  <select
    className="form-select shadow-sm"
    style={{ backgroundColor: "var(--bs-body-bg)", color: "var(--bs-body-color)", borderColor: "var(--bs-border-color)" }}
    name="tourType"
    value={filters.tourType}
    onChange={handleChange}
  >
    <option value="">Select Tour Type</option>
    <option>Adventure</option>
    <option>Cultural</option>
    <option>Luxury</option>
    <option>Family</option>
    <option>Romantic</option>
    
  </select>
</fieldset>

              {/* Date Filter */}
              <fieldset className="filter-section">
                <legend style={{ color: "var(--bs-body-color)", fontWeight: "400" }}>
                  <i className="bi bi-calendar-date me-2" style={{ color: "#28a745" }}></i>Date From
                </legend>
                <input
                  type="date"
                  className="form-control"
                  style={{ backgroundColor: "var(--bs-body-bg)", color: "var(--bs-body-color)", borderColor: "var(--bs-border-color)" }}
                  name="dateFrom"
                  value={filters.dateFrom || ''}
                  onChange={handleChange}
                />
              </fieldset>

              {/* Guests Filter */}
              <fieldset className="filter-section" >
                <legend style={{ color: "var(--bs-body-color)", fontWeight: "400" }}>
                  <i className="bi bi-person me-2" style={{ color: "#28a745" }}></i>Guests
                </legend>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Number of Guests"
                  min={1}
                  style={{ backgroundColor: "var(--bs-body-bg)", color: "var(--bs-body-color)", borderColor: "var(--bs-border-color)" }}
                  name="guests"
                  value={filters.guests}
                  onChange={handleChange}
                />
              </fieldset>

              {/* Traveler Rating */}
             <fieldset className="filter-section mb-4">
  <legend
    className="d-flex align-items-center mb-2"
    style={{ color: "var(--bs-body-color)", fontWeight: "400" }}
  >
    <i className="ri-star-smile-line me-2" style={{ color: "#28a745" }}></i>
    Traveler Rating
  </legend>

  <div className="d-flex flex-wrap gap-2" style={{ color: "var(--bs-body-color)", fontWeight: "400" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px 10px",
          backgroundColor: (filters.rating === star) ? "var(--bs-primary)" : "var(--bs-secondary-bg)",
          color: (filters.rating === star) ? "#fff" : "var(--bs-body-color)",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500",
          border: "1px solid var(--bs-border-color)"
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
                <legend style={{ color: "var(--bs-body-color)", fontWeight: "400" }}>
                  <i className="bi bi-gift me-2" style={{ color: "#28a745" }}></i>Special Offers
                </legend>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="likely"
                    name="likely"
                    checked={filters.offers.likely}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="likely">
                    Likely to Sell Out
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

          {/* Hotel Cards */}
          <div className="col-lg-9">
            <h4 className="fw-bold mb-4 d-flex justify-content-between align-items-center">
              Available Hotels
              {isAdmin && (
                <Link to="/admin/hotels/new" className="btn btn-primary btn-sm">
                  Add New Hotel
                </Link>
              )}
            </h4>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {displayedHotels.map((item) => (
                <div key={item.id} className="col-md-6 col-xl-4 mb-4">
                  <HotelCard item={item} handleDeleteHotel={handleDeleteHotel} />
                </div>
              ))}
            </div>
            
            {/* Load More Button - Only show if there are more hotels to load */}
            {visibleHotels < hotels.length && (
              <div className="text-center mt-4">
                <button 
                  className="btn btn-success px-4 py-2" 
                  style={{ color: "#fff" }} 
                  onClick={handleLoadMore}
                >
                  Load More ({hotels.length - visibleHotels} more)
                </button>
              </div>
            )}

            {/* Show message when all hotels are displayed */}
            {visibleHotels >= hotels.length && (
              <div className="text-center mt-4">
                <p className="text-muted">All {hotels.length} hotels are now displayed</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
