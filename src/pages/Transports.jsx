import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom"; // Import useLocation
import star from '../assets/star.svg';
import carNotFoundImg from '../assets/carNotFound.svg';
// import {carData} from '../data.js';
import '../Transport.css'; 
import { useAuth } from "../auth/AuthContext"; 
import { transportAPI } from "../api/axios"; // Import transportAPI
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS


function genNewSearchParamString(key, value, searchParams) {
    const sp = new URLSearchParams(searchParams)
    if (value === null) {
      sp.delete(key)
    } else {
      sp.set(key, value)
    }
    return `?${sp.toString()}`
}

function handleLocationChange(e , setSearchParams) {
    setSearchParams(prevParams => {
      if (e.target.value === "") {
        prevParams.delete(e.target.name)
      } else {
        prevParams.set(e.target.name, e.target.value)
      }
      return prevParams
    })
}

function handleInputChange(e, setQuery, setSearchParams) {
  e.preventDefault();
  carData.forEach(car => {  
    Object.entries(car).map(([key, value]) => {
      const capitalized = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
      console.log(e.target.value);
      
      if (String(value) === capitalized && (key === 'brand' || key === 'model' || key === 'category')) {
        setQuery(`?${key}=${capitalized}`);
      } else if (e.target.value === "") {
        setSearchParams("")
      }
    });
  });
}

function handleInputClick(query, setSearchParams, e) {
  e.preventDefault()
  query !== "" && setSearchParams(query) 
}

function Header({handleInputChange, setSearchParams, isAdmin}) {
  const [query, setQuery] = useState("")
  return (
    <header className="transport-header">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Available Cars</h1>
        {isAdmin && (
          <Link to="/admin/transports/new" className="btn btn-primary btn-sm">
            Add New Transport
          </Link>
        )}
      </div>
      <p>Browse our selection of premium vehicles available for your next adventure</p>
      <form className="search-form">
        <button className="search-button" onClick={(e) => handleInputClick(query, setSearchParams, e)}>
          <i className="bi bi-search search-icon"></i>
        </button>
        <input type="text" placeholder="Search by brand, model, or category" onChange={(e) => handleInputChange(e,setQuery,setSearchParams)}/>
      </form>
    </header>
  )
}

function FilterToggle({setIsFilterAvailable}) {
  return (
    <button 
      className="filter-toggle" 
      onClick={() => setIsFilterAvailable(prev => !prev)}>
      <p>Advanced Filters</p>
      <i className="bi bi-funnel"></i>
    </button>
  )
}

function FilterBtn({link, content ,filterKey, isRating, value, filterValues}) {
  const isActive = filterValues?.some(filterObj => {
    return filterObj[filterKey] === value;
  });
  return (
    <Link 
      key={`${filterKey}-${value}-${content}`}
      to={link} 
      className={`filter-btn ${isRating ? 'rating' : ''} ${isActive ? 'active' : ''}`}>
      {isRating ?  
      <>
        <img src={star} alt={`${content} stars`} />
        <span>{content}</span>
      </> : content}
    </Link>
  ); 
}

function Filter({filterValues, searchParams, setSearchParams, setDisplayPage, setIsFilterAvailable}) {
  return (
    <aside className="transport-filter">
      <button 
        className="close-btn" 
        onClick={() => setIsFilterAvailable(prev => !prev)}>
        <i className="bi bi-x-lg"></i>
      </button>
      <div className="filter-header">
        <h2>Filters</h2>
        <Link to=".">Reset Filters</Link>
      </div>
      <form>
        <label>
          Pickup Location
          <select name="pickupLocation" id="pickupLocation" onChange={(e) => {
            handleLocationChange(e, setSearchParams);
          }}>
            <option value="">Select a place</option>
            <option value="Addis Ababa">Addis Ababa</option>
            <option value="Lalibela">Lalibela</option>
            <option value="Gondar">Gondar</option>
            <option value="Axum">Axum</option>
          </select>
        </label>
        <label>
          Price Range
          <div className="filter-btn-container">
            <FilterBtn link={genNewSearchParamString('pricePerDay', null, searchParams, setDisplayPage)} content="Any" value="" filterKey="pricePerDay" filterValues={filterValues} />
            <FilterBtn link={genNewSearchParamString('pricePerDay', 200, searchParams, setDisplayPage)} content="Under $200/day" value="200" filterKey="pricePerDay" filterValues={filterValues} />
            <FilterBtn link={genNewSearchParamString('pricePerDay', 150, searchParams, setDisplayPage)} content="Under $150/day" value="150" filterKey="pricePerDay" filterValues={filterValues} />
            <FilterBtn link={genNewSearchParamString('pricePerDay', 100, searchParams, setDisplayPage)} content="Under $100/day" value="100" filterKey="pricePerDay" filterValues={filterValues} />
            <FilterBtn link={genNewSearchParamString('pricePerDay', 50, searchParams, setDisplayPage)} content="Under $50/day" value="50" filterKey="pricePerDay" filterValues={filterValues} />
          </div>
        </label>
        <label>
          Transmission
          <div className="filter-btn-container">
            <FilterBtn link={genNewSearchParamString('transmission', null, searchParams, setDisplayPage)} content="Any" value="" filterKey="transmission" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('transmission', 'Manual', searchParams, setDisplayPage)} content="Manual" value="Manual" filterKey="transmission" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('transmission', 'Automatic', searchParams, setDisplayPage)} content="Automatic" value="Automatic" filterKey="transmission" filterValues={filterValues}/>
          </div>
        </label>
        <label>
          Fuel Type
          <div className="filter-btn-container">
            <FilterBtn link={genNewSearchParamString('fuelType', null, searchParams, setDisplayPage)} content="Any" value="" filterKey="fuelType" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('fuelType', 'Petrol', searchParams, setDisplayPage)} content="Petrol" value="Petrol" filterKey="fuelType" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('fuelType', 'Diesel', searchParams, setDisplayPage)} content="Diesel" value="Diesel" filterKey="fuelType" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('fuelType', 'Electric', searchParams, setDisplayPage)} content="Electric" value="Electric" filterKey="fuelType" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('fuelType', 'Hybrid', searchParams, setDisplayPage)} content="Hybrid" value="Hybrid" filterKey="fuelType" filterValues={filterValues}/>
          </div>
        </label>
        <label>
          Seating Capacity
          <div className="filter-btn-container">
            <FilterBtn link={genNewSearchParamString('seatingCapacity', null, searchParams, setDisplayPage)} content="Any" value="" filterKey="seatingCapacity" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('seatingCapacity', 2, searchParams, setDisplayPage)} content="2 Seater" value="2" filterKey="seatingCapacity" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('seatingCapacity', 4, searchParams, setDisplayPage)} content="4 Seater" value="4" filterKey="seatingCapacity" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('seatingCapacity', 5, searchParams, setDisplayPage)} content="5 Seater" value="5" filterKey="seatingCapacity" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('seatingCapacity', 7, searchParams, setDisplayPage)} content="7 Seater" value="7" filterKey="seatingCapacity" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('seatingCapacity', 11, searchParams, setDisplayPage)} content="11 Seater" value="11" filterKey="seatingCapacity" filterValues={filterValues}/>
          </div>
        </label>
        <label>
          Rating
          <div className="filter-btn-container">
            <FilterBtn link={genNewSearchParamString('rating', null, searchParams, setDisplayPage)} content="Any" value="" filterKey="rating" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('rating', 1, searchParams, setDisplayPage)} content="1" value="1" isRating={true} filterKey="rating" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('rating', 2, searchParams, setDisplayPage)} content="2" value="2" isRating={true} filterKey="rating" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('rating', 3, searchParams, setDisplayPage)} content="3" value="3" isRating={true} filterKey="rating" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('rating', 4, searchParams, setDisplayPage)} content="4" value="4" isRating={true} filterKey="rating" filterValues={filterValues}/>
            <FilterBtn link={genNewSearchParamString('rating', 5, searchParams, setDisplayPage)} content="5" value="5" isRating={true} filterKey="rating" filterValues={filterValues}/>
          </div>
        </label>
      </form>
    </aside>
  )
}

function CarCard({car, searchParams, isAdmin, handleDeleteTransport}) {
  return (
    <Link to={`${car.id}`} state={{ search: searchParams ? `?${searchParams.toString()}` : undefined }} className="car-card">
      <div>
        <img src={car.imageUrl} alt="car-image" className="car-image"/>
        <div className="car-rating">
          <img src={star} alt="star" />
          <span>{car.averageRating || car.rating} ({car.reviewCount || 0})</span>
        </div>

        <div className="car-price">
          <p>${car.pricePerDay} <span>/day</span></p>
        </div>
      </div>
      <div className="car-info">
        <div>
          <h3 className="car-title">{car.brand} {car.model}</h3>
          <p className="car-category">{car.category}</p>
        </div>
        <div className="car-details">
          <div>
            <i className="bi bi-people"></i>
            <span>{car.seatingCapacity} Seats</span>
          </div>
          <div>
            <i className="bi bi-car-front"></i>
            <span>{car.transmission}</span>
          </div>
          <div>
            <i className="bi bi-fuel-pump"></i>
            <span>{car.fuelType}</span>
          </div>
          <div>
            <i className="bi bi-geo-alt"></i>
            <span>{car.pickupLocation}</span>
          </div>
        </div>
        {isAdmin && (
          <Link to={`/admin/transports/${car.id}`} className="ms-2 action-icon-btn edit-icon-btn">
            <i className="bi bi-pencil"></i>
          </Link>
        )}
        {isAdmin && (
            <button
              className="ms-2 action-icon-btn delete-icon-btn"
              onClick={(e) => {
                e.preventDefault(); // Prevent navigating to detail page
                handleDeleteTransport(car._id);
              }}
            >
              <i className="bi bi-trash3"></i>
            </button>
        )}
      </div>
    </Link>
  );
}

function CarNotFound() {
  return (
    <div className="car-not-found-container">
      <img src={carNotFoundImg} alt="car not found" />
      <h3>No cars match your filters.</h3>
      <p>We couldn't find any vehicles that meet all your current criteria. Try broadening your search by adjusting your filters, selecting more models, or removing some filters.</p>
      <Link to=".">Reset All Filters</Link> 
    </div>
  )
}

function Pagination({displayPage,handleClick, filteredCars, typeFilter, transports}) {
  const pageEl = typeFilter.length ? Math.ceil(filteredCars.length / 9) : Math.ceil(transports.length / 9);
  const PageNO = []
  for (let i = 1; i <= pageEl; i++) {
    PageNO.push(i);
  }
  const pageNoEl = PageNO.map((number) => (
    <span 
      key={number} 
      className={`page-number ${(displayPage[1]) / 9 === number ? 'active' : ''}`}
    >
      {number}
    </span>
  ));
  return (
    <div className="pagination-container">
      <button
        disabled={displayPage[0] === 0 || typeFilter.length && filteredCars.length <= 9}
        onClick={() => handleClick([displayPage[0] - 9, displayPage[1] - 9])}
      >
        <i className="bi bi-arrow-left"></i>
        <p>Previous</p>
      </button>
      <div className="pagination-numbers">
        {pageNoEl}
      </div>
      <button
        disabled={transports.length < displayPage[1] || typeFilter.length && filteredCars.length <= 9}
        onClick={() => {
          handleClick([displayPage[0] + 9, displayPage[1] + 9])
        }}
      >
        <p>Next</p>
        <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  );
}


export default function Transports() { 
  const [displayPage, setDisplayPage] = useState([0,9]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterAvailable, setIsFilterAvailable] = useState(true)
  const allFilters = ["seatingCapacity", "brand", "transmission", "fuelType","pickupLocation","model","category","pricePerDay","rating"];
  const typeFilter = allFilters.filter(filter => searchParams.get(filter) !== null);
  const filterValues = typeFilter.map(filter => ({[filter]: searchParams.get(filter)}));
  const { user } = useAuth(); // Use useAuth to get user info
  const isAdmin = user?.role === "admin"; // Check if user is admin
  const location = useLocation(); // Initialize useLocation
  const [transports, setTransports] = useState([]); // State for fetched transports
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch transports from API
  useEffect(() => {
    const fetchTransports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await transportAPI.getAllTransports();
        const normalized = (res?.data?.data.data || res?.data?.transports || []).map(t => ({
          ...t,
          id: t._id || t.id,
          imageUrl: t.image || t.imageUrl || "https://via.placeholder.com/300x200?text=Transport",
          averageRating: 0, // Initialize
          reviewCount: 0,   // Initialize
        }));
        setTransports(normalized);
        console.log(normalized);
        
      } catch (err) {
        console.error("Error fetching transports:", err);
        toast.error(err.response?.data?.message || 'Failed to load transports');
      } finally {
        setLoading(false);
      }
    };
    fetchTransports();
  }, [location.pathname]); // Re-fetch on path change

  const handleDeleteTransport = async (id) => {
    console.log(id);
    
    if (window.confirm("Are you sure you want to delete this transport?")) {
      try {
        await transportAPI.deleteTransport(id);
        toast.success("Transport deleted successfully!");
        // Re-fetch transports to update the list
        const res = await transportAPI.getAllTransports();
        const normalized = res?.data?.data.data || res?.data?.transports || [];
        setTransports(normalized);
      } catch (err) {
        console.error("Error deleting transport:", err);
        toast.error(err.response?.data?.message || 'Failed to delete transport.');
      }
    }
  };

  const filters = {
    seatingCapacity: searchParams.get("seatingCapacity"),
    transmission: searchParams.get("transmission"),
    fuelType: searchParams.get("fuelType"),
    pickupLocation: searchParams.get("pickupLocation"),
    pricePerDay: searchParams.get("pricePerDay"),
    rating: searchParams.get("rating"),
  };

  let filteredCars = [];
  const displayedCars = [];
  
  if (typeFilter.length) {    
    filterValues.forEach(filter => {
      const key = Object.keys(filter)[0];
      const value = filter[key];
      for (let i = 0; i < transports.length; i++) { // Use transports instead of carData
        const car = transports[i]; // Use transports instead of carData
        if (key === 'rating') {
          if (String(Math.round(car[key])) === value && !filteredCars.includes(transports[i])) {
            filteredCars.push(car);
          }
        } else if (key === 'pricePerDay') {
          if (Math.round(car[key]) < Number(value) && !filteredCars.includes(transports[i])) {
            filteredCars.push(car);
          }
        } else {
          if (String(car[key]) === value && !filteredCars.includes(transports[i])) {
            filteredCars.push(car);
          }
        }
      }
    });

    filteredCars = filteredCars.filter(({fuelType, seatingCapacity, transmission, pickupLocation, pricePerDay, rating}) => {
      return (filters.fuelType === null || filters.fuelType === fuelType) && (filters.seatingCapacity === null || filters.seatingCapacity === String(seatingCapacity)) && (filters.transmission === null || filters.transmission === transmission) && (filters.pickupLocation === null || filters.pickupLocation === pickupLocation) && (filters.pricePerDay === null || Number(filters.pricePerDay) > pricePerDay) && (filters.rating === null || filters.rating === String(Math.round(rating)));
    });
      
    for (let i = displayPage[0]; i < displayPage[1]; i++) {
        filteredCars[i] && displayedCars.push(filteredCars[i]);
    }
  } else {
      for (let i = displayPage[0]; i < displayPage[1]; i++) {
          transports[i] && displayedCars.push(transports[i]); // Use transports instead of carData
      }
    }
  
  const carCardEl = displayedCars.length ? displayedCars.map((car) => (<CarCard car={car} key={car.id} searchParams={searchParams} isAdmin={isAdmin} handleDeleteTransport={handleDeleteTransport} />)) : <CarNotFound />

  if (loading) return <p className="text-center mt-4">Loading transports...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error}</p>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" /> {/* Add ToastContainer */}
      <main className="transport-main">
        {isFilterAvailable ? 
        <FilterToggle setIsFilterAvailable={setIsFilterAvailable}/> :
        <Filter filterValues={filterValues} searchParams={searchParams} setSearchParams={setSearchParams} setDisplayPage={setDisplayPage} setIsFilterAvailable={setIsFilterAvailable}/>
        }
        <section>
          <Header handleInputChange={handleInputChange} setSearchParams={setSearchParams} isAdmin={isAdmin} />
          <div className="car-list-container">
            {carCardEl}
          </div>
          <Pagination 
            displayPage={displayPage} 
            handleClick={setDisplayPage}
            filteredCars={filteredCars}
            typeFilter={typeFilter}
            transports={transports}
          />
        </section>
      </main>
    </>
  );
} 
  