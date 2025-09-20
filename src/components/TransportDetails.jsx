import React, { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  useParams,
  useLocation,
  Outlet,
} from "react-router-dom";
import { transportAPI, reviewAPI } from "../api/axios"; // Corrected path and import reviewAPI
import { toast } from "react-toastify";
import "../TransportDetail.css";
import BookingForm from "./BookingForm"; // Import BookingForm
import ReviewForm from "./ReviewForm"; // Import ReviewForm

export default function TransportDetails() {
  const { carId } = useParams();
  const location = useLocation();
  const type = location.state?.type || "all";

  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransportDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await transportAPI.getTransportById(carId);
        // const fetchedTransport = res?.data?.data?.data || res?.data?.data || res?.data;
        // ✅ correct
        const fetchedTransport = res?.data?.data?.data || {};

        console.log("Fetched transport details:", fetchedTransport);
        if (fetchedTransport) {
          console.log(fetchedTransport);
          setTransport(fetchedTransport);
        } else {
          setError("Transport not found.");
          toast.error("Transport not found.");
        }
      } catch (err) {
        console.error("Error fetching transport details:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch transport details."
        );
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch transport details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchTransportDetails();
    }
  }, [carId]);

  const activeStyles = {
    fontWeight: "bold",
    color: "#017b6e",
    borderBottom: "2px solid #017b6e",
    backgroundColor: "inherit",
  };

  if (loading)
    return <p className="text-center mt-4">Loading transport details...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return transport ? (
    <main className="transport-detail-main-container container py-5">
      <div className="car-details-container">
        <Link
          to="/transports"
          className="back-link text-decoration-none d-inline-flex align-items-center mb-4 text-primary fw-bold"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to {type} transports
        </Link>
        <img
          src={transport.imageUrl || "https://via.placeholder.com/800x500"}
          alt={`${transport.brand} ${transport.model} image`}
          className="car-detail-image"
        />
        <div className="mt-4">
          <h1 className="fw-bold mb-2 text-primary">
            {transport.brand} {transport.model}
          </h1>
          <p className="text-muted fs-5">Category: {transport.category}</p>
          <p className="text-muted fs-5">
            Capacity: {transport.seatingCapacity} passengers
          </p>
          <p className="text-success fs-4">
            Price per day: ${transport.pricePerDay}
          </p>
        </div>
        <nav className="car-details-nav nav nav-tabs mt-4">
          <NavLink
            to="."
            end
            className="nav-link"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Description
          </NavLink>

          <NavLink
            to={`/transports/${transport._id || transport.id}/features`}
            className="nav-link"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Features
          </NavLink>

          <NavLink
            to={`/transports/${transport._id || transport.id}/reviews`}
            className="nav-link"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Reviews
          </NavLink>
        </nav>
        <div className="mt-4">
          <Outlet context={{ transport }} />
        </div>
      </div>
      {/* Replace the existing rental form with BookingForm */}
      <BookingForm
        entityId={transport._id || transport.id}
        entityType="transport"
        price={transport.pricePerDay}
        maxGuests={transport.seatingCapacity || 99} // Use transport.seatingCapacity if available, otherwise default to 99
        title={`${transport.brand} ${transport.model}`}
        image={transport.imageUrl || "https://via.placeholder.com/400x300"}
      />
    </main>
  ) : (
    <p className="text-center mt-4">Transport not found</p>
  );
}
