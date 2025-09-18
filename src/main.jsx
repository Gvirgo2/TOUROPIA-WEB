import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap's JavaScript bundle
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'remixicon/fonts/remixicon.css'
import './index.css'
// import { CartProvider } from '../src/context/CartContext.jsx'; // Removed

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  {/* <CartProvider> */}
      <App />
    {/* </CartProvider> */}
  </React.StrictMode>,
) 