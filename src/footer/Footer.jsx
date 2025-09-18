import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>
        <footer className='footer-section text-white pt-5' style={{ backgroundColor: '#23A16F' }}>
            <div className="container">
                <div className="row gy-4">
                    <div className="col-lg-3 col-md-6">
                        <h4 className='mb-3'>Company</h4>
                        <ul className="list-unstyled">
                            <li><Link to="/about" className='footer-link text-white text-decoration-none'><i className="ri-arrow-right-s-line"></i>About us</Link></li>
                            <li><Link to="/news" className='footer-link text-white text-decoration-none'><i className="ri-arrow-right-s-line"></i>News</Link></li>
                            <li><Link to="/faq" className='footer-link text-white text-decoration-none'><i className="ri-arrow-right-s-line"></i>FAQ</Link></li>
                            <li><Link to="/contact" className='footer-link text-white text-decoration-none'><i className="ri-arrow-right-s-line"></i>Contact</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h4 className='mb-3'>Explore</h4>
                        <ul className="list-unstyled">
                            <li><Link to="/tours" className='footer-link text-white text-decoration-none'><i className="ri-map-pin-line"></i>Tour Listings</Link></li>
                            <li><Link to="/destinations" className='footer-link text-white text-decoration-none'><i className="ri-map-pin-line"></i>Destination</Link></li>
                            <li><Link to="/faq" className='footer-link text-white text-decoration-none'><i className="ri-question-line"></i>FAQ</Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className='mb-3'>Quick links</h4>
                        <ul className="list-unstyled">
                            <li><Link to="/" className='footer-link text-white text-decoration-none'><i className="ri-home-4-line"></i>Home</Link></li>
                            <li><Link to="/about" className='footer-link text-white text-decoration-none'><i className="ri-information-line"></i>About us</Link></li>
                            <li><Link to="/contact" className='footer-link text-white text-decoration-none'><i className="ri-phone-line"></i>Contact us</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h4 className='mb-3'>Contact</h4>
                        <p className='small'><i className="ri-map-pin-line me-2"></i>2nd Floor Elilta real estate</p>
                        <p className='small'><i className="ri-phone-line me-2"></i>(+251) 123456</p>
                        <p className='small'><i className="ri-mail-line me-2"></i>Eaglelionteam@gmail.com</p>
                    </div>
                </div>

                <div className="footer-middle mt-5 px-4 py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h2 className='navbar-brand text-white fs-2 text-uppercase'>Tour<span style={{color:"#dfef09ff"}}>o</span>pia</h2>
                            <p className='small mt-2 w-50'>
                                Travel is a transformative and enriching experience that allows individuals to explore new destinations
                            </p>
                            <div className="d-flex flex-wrap gap-3 mt-3">
                                <Link to="/terms" className='footer-link text-white text-decoration-none'>Terms of use</Link>
                                <Link to="/privacy" className='footer-link text-white text-decoration-none'>Privacy & cookies</Link>
                                <Link to="/how-it-works" className='footer-link text-white text-decoration-none'>How the site works</Link>
                            </div>
                        </div>

                        <div className="col-lg-4 mt-4 mt-lg-0">
                            <h5 className='fw-bold mb-3'>Subscribe to our Newsletter</h5>
                            <form>
                                <input type="email" className='form-control mb-2' placeholder='Enter your email'/>
                                <button type='submit' className='btn w-100' style={{ backgroundColor: '#dfef09ff', color: '#23A16F' }}>
                                    <i className="ri-send-plane-line me-2"></i>Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
}

export default Footer;
