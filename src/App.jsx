import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './nav/Navbar';
import Footer from './footer/Footer';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import EmailVerification from './auth/EmailVerification';
import Logout from './auth/Logout';
import Dashboard from './pages/Dashboard';
import Tours from './pages/Tours';
import Hotels from './pages/Hotels';
import Restaurants from './pages/Restaurants';
import Transports from './pages/Transports';
import TransportDetails from './components/TransportDetails';
import TransportReviews from './components/TransportReviews'; // Import the new component
import TransportDetailsFeatures from './components/TransportDetailsFeatures';
import TransportDetailsInfo from './components/TransportDetailsInfo';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail'
import Contact from './pages/Contact';
import ProtectedRoute from './auth/ProtectedRoute';
import Cart from './pages/Cart';
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import TourDetail from './pages/TourDetail.jsx';
import HotelDetail from './pages/HotelDetail.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx'; // Import AdminUsers component
import EditUser from './pages/admin/EditUser.jsx'; // Import EditUser component
import UserProfile from './pages/UserProfile.jsx'; // Import UserProfile component
// Admin New Entry Components
import NewTour from './pages/admin/NewTour.jsx';
import NewHotel from './pages/admin/NewHotel.jsx';
import NewRestaurant from './pages/admin/NewRestaurant.jsx';
import NewTransport from './pages/admin/NewTransport.jsx';
import NewNews from './pages/admin/NewNews.jsx'; // Import NewNews component
import AdminContacts from './pages/admin/AdminContacts.jsx'; // Import AdminContacts component
import AdminContactDetail from './pages/admin/AdminContactDetail.jsx'; // Import AdminContactDetail component
import AdminBookings from './pages/admin/AdminBookings.jsx'; // Import AdminBookings component
import AdminBookingDetail from './pages/admin/AdminBookingDetail.jsx'; // New: Import AdminBookingDetail
import AdminLayout from './components/AdminLayout.jsx'; // Import AdminLayout
import AdminTransports from './pages/admin/AdminTransports.jsx'; // Import AdminTransports component
import MyBookings from './pages/MyBookings.jsx'; // Re-import MyBookings component
import BookingSummary from './pages/BookingSummary.jsx'; // Import BookingSummary component
import BookingDetailsForm from './pages/BookingDetailsForm.jsx'; // Renamed ConfirmYourBooking
import BookingReviewAndPayment from './pages/BookingReviewAndPayment.jsx'; // New component
import PaymentProcessing from './pages/PaymentProcessing.jsx'; // New component
import { CartProvider } from './context/CartContext'; // Import CartProvider
import AdminReviews from './pages/admin/AdminReviews.jsx'; // Import AdminReviews component
import MyReviews from './pages/MyReviews.jsx'; // Import MyReviews component
import UserSidebar from './components/UserSidebar.jsx'; // Import UserSidebar
import HowItWorks from './pages/HowItWorks.jsx'; // Import HowItWorks component
import FAQPage from './pages/FAQPage.jsx'; // Import FAQPage component

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>{/* CartProvider now wraps Router and is inside AuthProvider */}
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="App d-flex flex-column min-vh-100">
              <Navbar toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to Navbar */}
              <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Render UserSidebar */}
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<EmailVerification />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/tours" element={<Tours />} />
                  <Route path="/tours/:id" element={<TourDetail />} />
                  <Route path="/hotels" element={<Hotels />} />
                  <Route path="/hotels/:id" element={<HotelDetail />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                  <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                  <Route path="/transports" element={<Transports />} />
                  <Route path="/transports/:carId" element={<TransportDetails />}>
                    <Route index element={<TransportDetailsInfo />} />
                    <Route path="features" element={<TransportDetailsFeatures />} />
                    <Route path="reviews" element={<TransportReviews />} /> {/* New route for reviews */}
                  </Route>
                  <Route path="/about" element={<About />} />
                  <Route path="/news" element={<News />} />
                  <Route path='news/:newsId' element={<NewsDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/faq" element={<FAQPage />} />
                  
                  {/* User Profile Route (Protected for all authenticated users) */}
                  <Route 
                    path="/profile" 
                    element={<ProtectedRoute><UserProfile /></ProtectedRoute>}
                  />
                  {/* My Bookings Route (Protected for authenticated users) */}
                  <Route 
                    path="/my-bookings" 
                    element={<ProtectedRoute><MyBookings /></ProtectedRoute>}
                  />
                  {/* My Reviews Route (Protected for authenticated users) */}
                  <Route 
                    path="/my-reviews" 
                    element={<ProtectedRoute><MyReviews /></ProtectedRoute>}
                  />
                  {/* Booking Summary Route (Protected for authenticated users) */}
                  <Route 
                    path="/booking-summary" 
                    element={<ProtectedRoute><BookingSummary /></ProtectedRoute>}
                  />
                  {/* Booking Details Form Route (Protected for authenticated users) */}
                  <Route 
                    path="/booking-details-form" 
                    element={<ProtectedRoute><BookingDetailsForm /></ProtectedRoute>}
                  />
                  {/* Booking Review and Payment Route (Protected for authenticated users) */}
                  <Route 
                    path="/booking-review-and-payment" 
                    element={<ProtectedRoute><BookingReviewAndPayment /></ProtectedRoute>}
                  />
                  {/* Payment Processing Route (Protected for authenticated users) */}
                  <Route 
                    path="/payment-processing" 
                    element={<ProtectedRoute><PaymentProcessing /></ProtectedRoute>}
                  />
                  
                  {/* Admin routes with AdminLayout */}
                  <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="edit-user/:id" element={<EditUser />} /> {/* Route for editing a specific user */}
                    <Route path="tours/new" element={<NewTour />} />
                    <Route path="tours/:id" element={<NewTour />} />
                    <Route path="hotels/new" element={<NewHotel />} />
                    <Route path="hotels/:id" element={<NewHotel />} />
                    <Route path="restaurants/new" element={<NewRestaurant />} />
                    <Route path="restaurants/:id" element={<NewRestaurant />} />
                    <Route path="transports/new" element={<NewTransport />} />
                    <Route path="transports/:id" element={<NewTransport />} />
                    <Route path="transports" element={<AdminTransports />} />
                    <Route path="news/new" element={<NewNews />} />
                    <Route path="news/:id" element={<NewNews />} />
                    <Route path="contacts" element={<AdminContacts />} />
                    <Route path="contacts/:id" element={<AdminContactDetail />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="bookings/:id" element={<AdminBookingDetail />} /> {/* New route for single booking detail */}
                    <Route path="reviews" element={<AdminReviews />} /> {/* New route for pending reviews */}
                  </Route>
                  <Route path="/bookings/:id" element={<ProtectedRoute><AdminBookingDetail /></ProtectedRoute>} /> {/* New route for single booking detail */}
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 