import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tourAPI } from "../api/axios"; // Make sure this path is correct, import reviewAPI
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../auth/AuthContext"; // Import useAuth
import TourCard from "../components/TourCard"; // Import TourCard
import AngledCard from "../components/AngledCard"; // Import AngledCard
 
function Tours() {
  const [tours, setTours] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardStyle, setCardStyle] = useState("default"); // New state for card style
  const [filters, setFilters] = useState({
    destination: "",
    tourType: "",
    guests: 1,
    rating: null,
    offers: { likely: false, discount: false },
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Use useAuth to get user info
  const isAdmin = user?.role === "admin"; // Check if user is admin
  const location = useLocation(); // Initialize useLocation
 
  // Hydrate filters from URL query
  useEffect(() => {
    const qDest = searchParams.get("destination") || "";
    const qType = searchParams.get("tourType") || "";
    const qGuests = Number(searchParams.get("guests") || 1);
    const qRating = searchParams.get("rating");
    setFilters((prev) => ({
      ...prev,
      destination: qDest,
      tourType: qType,
      guests: isNaN(qGuests) ? 1 : qGuests,
      rating: qRating ? Number(qRating) : null,
    }));
  }, [searchParams]);
 
  // Fetch tours
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await tourAPI.getAllTours();
 
        // Normalize various possible backend shapes
        const payload = res?.data ?? {};
        const listCandidate =
          payload?.data?.data ||
          payload?.data?.tours ||
          payload?.data ||
          payload?.tours ||
          payload?.results ||
          [];
 
        const normalized = (Array.isArray(listCandidate) ? listCandidate : []).map((t, idx) => {
          const id = t._id || t.id || idx;
          const title = t.title || t.name || t.tourTitle || "Untitled Tour";
          const location = t.location || t.city || t.destination || t.area || "";
          const type = t.type || t.category || t.tourType || "general";
          const rating = Number(
            t.rating || t.ratingsAverage || t.averageRating || t.stars || 0
          );
          const price = Number(t.price || t.startingPrice || t.fromPrice || 0);
          const imagesArr = t.images || t.photos || t.gallery || [];
          const image =
            t.image ||
            t.coverImage ||
            t.imageUrl ||
            (Array.isArray(imagesArr) && imagesArr.length > 0 ? imagesArr[0] : undefined) ||
            "https://via.placeholder.com/600x400?text=Tour";
          const status = (t.status || t.state || "active").toString().toLowerCase();
 
          return { id, title, location, type, rating, price, image, status };
        });
 
        const activeTours = normalized.filter((t) => t.status === "active");
 
        setTours(activeTours);
        setFilteredData(activeTours);
      } catch (err) {
        console.error("Error fetching tours:", err);
        const msg = err?.response?.data?.message || err?.message || "Failed to load tours";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    
    if (location.state?.tourCreated) {
      fetchTours();
      navigate(location.pathname, { replace: true, state: {} }); // Clear the state after use
    } else if (!tours.length || location.pathname === "/tours") { // Also fetch if tours list is empty or directly on /tours
      fetchTours();
    }
  }, [location.pathname, location.state, navigate]);
 
  const handleDeleteTour = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await tourAPI.deleteTour(id);
        toast.success("Tour deleted successfully!");
        // Re-fetch tours to update the list
        const res = await tourAPI.getAllTours();
        const payload = res?.data ?? {};
        const listCandidate =
          payload?.data?.data ||
          payload?.data?.tours ||
          payload?.data ||
          payload?.tours ||
          payload?.results ||
          [];
 
        const normalized = (Array.isArray(listCandidate) ? listCandidate : []).map((t, idx) => {
          const id = t._id || t.id || idx;
          const title = t.title || t.name || t.tourTitle || "Untitled Tour";
          const location = t.location || t.city || t.destination || t.area || "";
          const type = t.type || t.category || t.tourType || "general";
          const rating = Number(
            t.rating || t.ratingsAverage || t.averageRating || t.stars || 0
          );
          const price = Number(t.price || t.startingPrice || t.fromPrice || 0);
          const imagesArr = t.images || t.photos || t.gallery || [];
          const image =
            t.image ||
            t.coverImage ||
            t.imageUrl ||
            (Array.isArray(imagesArr) && imagesArr.length > 0 ? imagesArr[0] : undefined) ||
            "https://via.placeholder.com/600x400?text=Tour";
          const status = (t.status || t.state || "active").toString().toLowerCase();
 
          return { id, title, location, type, rating, price, image, status };
        });
        const activeTours = normalized.filter((t) => t.status === "active");
        setTours(activeTours);
        setFilteredData(activeTours);
      } catch (err) {
        console.error("Error deleting tour:", err);
        toast.error(err.response?.data?.message || 'Failed to delete tour.');
      }
    }
  };
 
  // Apply filters (aligned with Hotels logic)
  useEffect(() => {
    let results = [...tours];
 
    if (filters.destination) {
      results = results.filter((t) =>
        (t.location || "").toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
 
    if (filters.tourType) {
      results = results.filter(
        (t) => t.type.toLowerCase() === filters.tourType.toLowerCase()
      );
    }
 
    if (filters.guests > 1) {
      const getGuests = (tour) => tour.guests || tour.capacity || tour.maxGuests || 0;
      results = results.filter((t) => getGuests(t) >= filters.guests);
    }
 
    if (filters.rating) {
      results = results.filter((t) => Number(t.rating || 0) >= filters.rating);
    }
 
    if (filters.offers.likely) {
      results = results.filter((t) => t.likelyToSellOut);
    }
 
    if (filters.offers.discount) {
      results = results.filter((t) => t.discountAvailable);
    }
 
    setFilteredData(results);
    setVisibleCount(9);
  }, [filters, tours]);
 
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
 
  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);
  // const handleView = (item) => navigate(`/tours/${item.id}`); // Remove this line
 
  if (loading) return <p className="text-center mt-4">Loading tours...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
 
  return (
    <div className="main-wrapper">
      <div className="container">
        <ToastContainer />
        <div className="row">
          {/* Filters */}
          <div className="col-lg-3 mb-4">
            <div className="filter-sidebar shadow-sm p-3" style={{ backgroundColor: "var(--bs-body-bg)", borderRadius: "8px", border: "1px solid var(--bs-border-color)" }}>
              <h5 className="fw-bold mb-4 d-flex align-items-center text-success fs-4">
                <i className="ri-filter-3-fill me-2"></i>
                Advanced Filters
              </h5>

              {/* Destination */}
              <fieldset className="filter-section mb-4">
                <legend className="d-flex align-items-center mb-2" style={{ color: "var(--bs-body-color)", fontWeight: 400 }}>
                  <i className="ri-map-pin-line me-2" style={{ color: "#28a745" }}></i>
                  Destination
                </legend>
                <input
                  type="text"
                  name="destination"
                  className="form-control"
                  placeholder="Search destination..."
                  value={filters.destination}
                  onChange={handleChange}
                />
              </fieldset>

              {/* Tour Type */}
              <fieldset className="filter-section mb-4">
                <legend className="d-flex align-items-center mb-2" style={{ color: "var(--bs-body-color)", fontWeight: 400 }}>
                  <i className="ri-flight-takeoff-line me-2" style={{ color: "#28a745" }}></i>
                  Tour Type
                </legend>
                <select
                  name="tourType"
                  className="form-select shadow-sm"
                  style={{ backgroundColor: "var(--bs-body-bg)", color: "var(--bs-body-color)", borderColor: "var(--bs-border-color)" }}
                  value={filters.tourType}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option value="adventure">Adventure</option>
                  <option value="cultural">Cultural</option>
                  <option value="luxury">Luxury</option>
                  <option value="family">Family</option>
                  <option value="romantic">Romantic</option>
                </select>
              </fieldset>

              {/* Date From (visual only) */}
              <fieldset className="filter-section">
                <legend style={{ color: "var(--bs-body-color)", fontWeight: 400 }}>
                  <i className="bi bi-calendar-date me-2" style={{ color: "#28a745" }}></i>
                  Date From
                </legend>
                <input type="date" className="form-control" style={{ backgroundColor: "var(--bs-body-bg)", color: "var(--bs-body-color)", borderColor: "var(--bs-border-color)" }} />
              </fieldset>

              {/* Guests */}
              <fieldset className="filter-section">
                <legend style={{ color: "var(--bs-body-color)", fontWeight: 400 }}>
                  <i className="bi bi-person me-2" style={{ color: "#28a745" }}></i>
                  Guests
                </legend>
                <input
                  type="number"
                  name="guests"
                  min={1}
                  className="form-control"
                  placeholder="Number of Guests"
                  style={{ backgroundColor: "var(--bs-body-bg)", color: "var(--bs-body-color)", borderColor: "var(--bs-border-color)" }}
                  value={filters.guests}
                  onChange={handleChange}
                />
              </fieldset>

              {/* Rating */}
              <fieldset className="filter-section mb-4">
                <legend className="d-flex align-items-center mb-2" style={{ color: "var(--bs-body-color)", fontWeight: 400 }}>
                  <i className="ri-star-smile-line me-2" style={{ color: "#28a745" }}></i>
                  Traveler Rating
                </legend>
                <div className="d-flex flex-wrap gap-2" style={{ color: "var(--bs-body-color)", fontWeight: 400 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setFilters((prev) => ({ ...prev, rating: star }))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 10px",
                        backgroundColor: "var(--bs-secondary-bg)",
                        color: "var(--bs-body-color)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 500,
                        border: "1px solid var(--bs-border-color)",
                      }}
                    >
                      <i className="ri-star-fill text-warning me-1"></i>
                      {star}
                    </span>
                  ))}
                </div>
              </fieldset>

              {/* Special Offers */}
              <fieldset className="filter-section mb-2">
                <legend className="form-label fw-bold">Offers</legend>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="likely"
                    className="form-check-input"
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Likely to Sell Out</label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="discount"
                    className="form-check-input"
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Discounts</label>
                </div>
              </fieldset>

            </div>
          </div>
 
          {/* Tours List */}
          <div className="col-lg-9">
            <h4 className="fw-bold mb-4 d-flex justify-content-between align-items-center">
              Available Tours
              {isAdmin && (
                <Link to="/admin/tours/new" className="btn btn-success btn-sm d-flex align-items-center">
                  <i className="bi bi-plus-circle-fill me-2"></i> Add New Tour
                </Link>
              )}
            </h4>
            <div className="row">
              {filteredData.length > 0 ? (
                filteredData.slice(0, visibleCount).map((item) => (
                  <div key={item.id} className="col-md-6 col-lg-4 mb-4">
                    <TourCard item={item} handleDeleteTour={handleDeleteTour} />
                  </div>
                ))
              ) : (
                <p className="text-center fs-5 text-muted w-100">No tours found.</p>
              )}
            </div>
 
            {visibleCount < filteredData.length && (
              <div className="text-center">
                <button className="btn btn-success px-4" onClick={handleLoadMore}>
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Tours;