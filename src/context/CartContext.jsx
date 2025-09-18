import React, { createContext, useState, useMemo, useEffect } from "react";
import { bookingAPI } from '../api/axios'; // Import bookingAPI
import { useAuth } from '../auth/AuthContext'; // Import useAuth to check authentication status

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth(); // Get isAuthenticated and user from AuthContext

  // Helper function to get the localStorage key based on user presence
  const getCartStorageKey = (userId) => (userId ? `cartItems_${userId}` : "cartItems_guest");
  const getBookingInfoStorageKey = (userId) => (userId ? `bookingInfo_${userId}` : "bookingInfo_guest");
  const getBookingCountStorageKey = (userId) => (userId ? `bookingCount_${userId}` : "bookingCount_guest");

  // Initialize cartItems from localStorage or an empty array
  const [cartItems, setCartItems] = useState(() => {
    const initialUser = user; // Capture user state during initial render
    const storageKey = getCartStorageKey(initialUser?.id);
    try {
      const localData = localStorage.getItem(storageKey);
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error(`Failed to parse cart items from localStorage for key ${storageKey}`, error);
      return [];
    }
  });

  // Initialize bookingInfo from localStorage or default values
  const [bookingInfo, setBookingInfo] = useState(() => {
    const initialUser = user; // Capture user state during initial render
    const storageKey = getBookingInfoStorageKey(initialUser?.id);
    try {
      const localData = localStorage.getItem(storageKey);
      return localData ? JSON.parse(localData) : {
        checkInDate: "",
        checkOutDate: "",
        adults: 0,
        children: 0,
        tourGuide: "No",
      };
    } catch (error) {
      console.error(`Failed to parse booking info from localStorage for key ${storageKey}`, error);
      return {
        checkInDate: "",
        checkOutDate: "",
        adults: 0,
        children: 0,
        tourGuide: "No",
      };
    }
  });

  // Initialize bookingCount from localStorage or 0
  const [bookingCount, setBookingCount] = useState(() => {
    const initialUser = user;
    const storageKey = getBookingCountStorageKey(initialUser?.id);
    try {
      const localData = localStorage.getItem(storageKey);
      return localData ? JSON.parse(localData) : 0;
    } catch (error) {
      console.error(`Failed to parse booking count from localStorage for key ${storageKey}`, error);
      return 0;
    }
  });

  const [refreshBookings, setRefreshBookings] = useState(false); // New state to trigger booking refresh

  // Effect to load cart and bookingInfo when user logs in/out
  useEffect(() => {
    const loadUserData = async () => {
      const cartStorageKey = getCartStorageKey(user?.id);
      const bookingInfoStorageKey = getBookingInfoStorageKey(user?.id);
      const bookingCountStorageKey = getBookingCountStorageKey(user?.id);

      try {
        const localCartData = localStorage.getItem(cartStorageKey);
        setCartItems(localCartData ? JSON.parse(localCartData) : []);

        const localBookingInfoData = localStorage.getItem(bookingInfoStorageKey);
        setBookingInfo(localBookingInfoData ? JSON.parse(localBookingInfoData) : {
          checkInDate: "",
          checkOutDate: "",
          adults: 0,
          children: 0,
          tourGuide: "No",
        });

        // Fetch booking count from API if authenticated
        if (isAuthenticated) {
          try {
            const res = await bookingAPI.getCurrentUserBookings();
            const fetchedBookings = res?.data?.data?.data || res?.data?.data || [];
            setBookingCount(Array.isArray(fetchedBookings) ? fetchedBookings.length : 0);
          } catch (err) {
            console.error("Error fetching booking count:", err);
            setBookingCount(0);
          }
        } else {
          setBookingCount(0); // Reset booking count if not authenticated
        }

        const localBookingCountData = localStorage.getItem(bookingCountStorageKey);
        if (!isAuthenticated && localBookingCountData) { // Only load from local storage for guests if no API fetch happened
          setBookingCount(JSON.parse(localBookingCountData));
        }

      } catch (error) {
        console.error(`Failed to load data from localStorage for user ${user?.id}`, error);
        setCartItems([]);
        setBookingInfo({
          checkInDate: "",
          checkOutDate: "",
          adults: 0,
          children: 0,
          tourGuide: "No",
        });
        setBookingCount(0);
      }
    };

    const clearUserData = () => {
      // Clear current states and generic local storage entries
      setCartItems([]);
      setBookingInfo({
        checkInDate: "",
        checkOutDate: "",
        adults: 0,
        children: 0,
        tourGuide: "No",
      });
      setBookingCount(0); // Clear booking count on logout
      localStorage.removeItem("cartItems_guest"); // Clear guest cart as well
      localStorage.removeItem("bookingInfo_guest"); // Clear guest booking info as well
      localStorage.removeItem("bookingCount_guest"); // Clear guest booking count as well
    };

    if (isAuthenticated) {
      // When a user logs in, load their specific data
      loadUserData();
    } else {
      // When a user logs out, clear data and reset to guest state
      clearUserData();
      // Load guest data if any exists (e.g., if user logged out and then browse as guest)
      const guestCartData = localStorage.getItem(getCartStorageKey(null));
      setCartItems(guestCartData ? JSON.parse(guestCartData) : []);
      const guestBookingInfoData = localStorage.getItem(getBookingInfoStorageKey(null));
      setBookingInfo(guestBookingInfoData ? JSON.parse(guestBookingInfoData) : {
        checkInDate: "",
        checkOutDate: "",
        adults: 0,
        children: 0,
        tourGuide: "No",
      });
      const guestBookingCountData = localStorage.getItem(getBookingCountStorageKey(null));
      setBookingCount(guestBookingCountData ? JSON.parse(guestBookingCountData) : 0);
    }
  }, [isAuthenticated, user, refreshBookings]); // Depend on isAuthenticated, user, and refreshBookings

  // Effect to save cartItems to localStorage whenever they change (user-specific)
  useEffect(() => {
    const storageKey = getCartStorageKey(user?.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (error) {
      console.error(`Failed to save cart items to localStorage for key ${storageKey}`, error);
    }
  }, [cartItems, user]); // Depend on cartItems and user

  // Effect to save bookingInfo to localStorage whenever they change (user-specific)
  useEffect(() => {
    const storageKey = getBookingInfoStorageKey(user?.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify(bookingInfo));
    } catch (error) {
      console.error(`Failed to save booking info to localStorage for key ${storageKey}`, error);
    }
  }, [bookingInfo, user]); // Depend on bookingInfo and user

  // Effect to save bookingCount to localStorage whenever it changes (user-specific)
  useEffect(() => {
    const storageKey = getBookingCountStorageKey(user?.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify(bookingCount));
    } catch (error) {
      console.error(`Failed to save booking count to localStorage for key ${storageKey}`, error);
    }
  }, [bookingCount, user]); // Depend on bookingCount and user

  const calculateSubtotal = (items) =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0);


  const calculateTotal = (items) => {
    const subtotal = calculateSubtotal(items);
    const tax = subtotal * 0.15; // 15% VAT
    return subtotal + tax;
  };

  
  const subtotal = useMemo(() => calculateSubtotal(cartItems), [cartItems]);
  const total = useMemo(() => calculateTotal(cartItems), [cartItems]);

  
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        // If item exists, update its quantity and other booking details
        return prevItems.map((i) =>
          i.id === item.id
            ? { 
                ...i, 
                ...item, // Merge new item properties (title, image, price, maxGuests, startDate)
                quantity: (i.quantity || 0) + item.quantity // Sum quantities
              }
            : i
        );
      }
      // If item is new, add it to the cart
      return [...prevItems, { ...item }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setBookingInfo({
      checkInDate: "",
      checkOutDate: "",
      adults: 0,
      children: 0,
      tourGuide: "No",
    });
    const cartStorageKey = getCartStorageKey(user?.id);
    const bookingInfoStorageKey = getBookingInfoStorageKey(user?.id);
    const bookingCountStorageKey = getBookingCountStorageKey(user?.id);
    localStorage.removeItem(cartStorageKey);
    localStorage.removeItem(bookingInfoStorageKey);
  };
  
  const triggerBookingRefresh = () => {
    setRefreshBookings(prev => !prev);
  };
 
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart, // Expose clearCart function
        bookingInfo,
        setBookingInfo,
        subtotal,
        total,
        cartCount: cartItems.length, // Expose cartCount
        bookingCount, // Expose bookingCount
        triggerBookingRefresh, // Expose refresh function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};