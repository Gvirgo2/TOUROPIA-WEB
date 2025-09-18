import axios from "axios";

// Base URL configuration
// In development, use relative "/api/v1" so Vite proxy handles CORS
// In production, use env or default absolute backend URL
const isDev = import.meta.env.DEV;
const DEV_BASE = "/api/v1";
const PROD_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://visit-ethiopia-backend-3a56.onrender.com/api/v1";

const SELECTED_BASE = isDev ? DEV_BASE : PROD_BASE;
const normalizedBaseURL = SELECTED_BASE.endsWith("/") ? SELECTED_BASE : SELECTED_BASE + "/";

const api = axios.create({
  baseURL: normalizedBaseURL,
  headers: { "Content-Type": "application/json" },
  // Disable credentials unless you specifically need cookies; avoids many CORS issues
  withCredentials: false,
});

// Request interceptor (add token if exists)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Axios Request Interceptor:", { url: config.url, method: config.method, headers: config.headers }); // Add this line
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  signup: (data) => api.post("/users/signup", data),
  login: (data) => api.post("/users/login", data),
  logout: () => api.post("/users/logout"),
  // Added endpoints used by AuthContext and routes
  forgotPassword: (email) => api.post("/users/forgotPassword", { email }),
  resetPassword: (token, data) => api.patch(`/users/resetPassword/${token}`, data),
  verifyEmail: (token) => api.get(`/users/verify-email/${token}`),
  getAllUsers: () => api.get("/users"), // Admin only: Get all users
  getUserProfile: () => api.get("/users/profile"),
  updateUserProfile: (data) => api.patch("/users/profile", data),
  deleteUserProfile: () => api.delete("/users/profile"),
  getUserById: (id) => api.get(`/users/${id}`), // Admin only
  updateUserRole: (id, data) => api.patch(`/users/${id}`, data), // Admin only
  deleteUser: (id) => api.delete(`/users/${id}`), // Admin only
};

// Tours API
export const tourAPI = {
  getAllTours: () => api.get("/tours"),
  getTourById: (id) => api.get(`/tours/${id}`),
  createTour: (data) => api.post("/tours", data), // Admin only
  updateTour: (id, data) => api.patch(`/tours/${id}`, data), // Admin only
  deleteTour: (id) => api.delete(`/tours/${id}`), // Admin only
  getTourReviews: (id) => api.get(`/tours/${id}/reviews`), // Get reviews for a tour
};

// Hotels API
export const hotelAPI = {
  getAllHotels: () => api.get("/hotels"),
  getHotelById: (id) => api.get(`/hotels/${id}`),
  createHotel: (data) => api.post("/hotels", data), // Admin only
  updateHotel: (id, data) => api.patch(`/hotels/${id}`, data), // Admin only
  deleteHotel: (id) => api.delete(`/hotels/${id}`), // Admin only
  getHotelReviews: (id) => api.get(`/hotels/${id}/reviews`), // Get reviews for a hotel
};

// Restaurants API
export const restaurantAPI = {
  getAllRestaurants: () => api.get("/restaurants"),
  getRestaurantById: (id) => api.get(`/restaurants/${id}`),
  createRestaurant: (data) => api.post("/restaurants", data), // Admin only
  updateRestaurant: (id, data) => api.patch(`/restaurants/${id}`, data), // Admin only
  deleteRestaurant: (id) => api.delete(`/restaurants/${id}`), // Admin only
  getRestaurantReviews: (id) => api.get(`/restaurants/${id}/reviews`), // Get reviews for a restaurant
};

// Transports API
export const transportAPI = {
  getAllTransports: () => api.get("/transports"),
  getTransportById: (id) => api.get(`/transports/${id}`),
  createTransport: (data) => api.post("/transports", data), // Admin only
  updateTransport: (id, data) => api.patch(`/transports/${id}`, data), // Admin only
  deleteTransport: (id) => api.delete(`/transports/${id}`), // Admin only
  getTransportReviews: (id) => api.get(`/transports/${id}/reviews`), // Get reviews for a transport
  createTransportReview: (id, data) => api.post(`/transports/${id}/reviews`, data), // Create a review for a transport
};

export const bookingAPI = {
  getAllBookings: () => api.get("/bookings"), // Admin only
  createBooking: (data) => api.post("/bookings", data),
  getBookingById: (id) => api.get(`/bookings/${id}`), // Owner or Admin
  getCurrentUserBookings: () => api.get("/bookings/me"),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
  updateBookingStatus: (id, data) => api.patch(`/bookings/${id}/status`, data), // Admin only
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post("/contacts", data),
  getAllContacts: () => api.get("/contacts"), // Admin only
  getContactById: (id) => api.get(`/contacts/${id}`), // Admin only
  updateContactStatus: (id, data) => api.patch(`/contacts/${id}/status`, data), // Admin only
};

export const newsAPI = {
  createNews: (data) => api.post("/news", data), // Admin only
  getAllNews: () => api.get("/news"), // New: Get all news items
  getNewsById: (id) => api.get(`/news/${id}`), // New: Get news item by ID
  getFeaturedNews: () => api.get("/news/featured"), // New: Get featured news
  updateNews: (id, data) => api.patch(`/news/${id}`, data), // Admin only
  deleteNews: (id) => api.delete(`/news/${id}`), // Admin only
  getByCategory: (category) => api.get('/news', { params: { category } }),// Get news articles by category - GET /news?category={category}
};

export const reviewAPI = {
  createReview: (data) => api.post("/reviews", data),
  getReviewById: (id) => api.get(`/reviews/${id}`), // Potentially admin only or owner
  updateReview: (id, data) => api.patch(`/reviews/${id}`, data), // Owner or Admin
  deleteReview: (id) => api.delete(`/reviews/${id}`), // Owner or Admin
  getCurrentUserReviews: () => api.get("/reviews/me"), // New: Get current user's reviews
  getPendingReviews: () => api.get("/reviews/pending"), // New: Admin only - Get pending reviews
  approveReview: (id) => api.patch(`/reviews/${id}/approve`), // New: Admin only - Approve a review
  getAllReviews: (status = 'all') => api.get(`/reviews${status !== 'all' ? `?status=${status}` : ''}`), // New: Admin only - Get all reviews with optional status filter
};

export default api;
