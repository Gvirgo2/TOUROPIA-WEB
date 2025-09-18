import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import FAQ from '../components/about/FAQ'; // Adjust path if necessary

const faqItems = [
  {
    question: "How do I book a tour?",
    answer: "You can book a tour by navigating to the Tours page, selecting your desired tour, and clicking the 'Add to Cart' button. Follow the checkout process to complete your booking.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express) and other local payment options.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Booking modifications and cancellations are subject to our terms and conditions. Please refer to your booking confirmation or contact our support team for assistance.",
  },
  {
    question: "How can I review a tour, hotel, or restaurant?",
    answer: "After experiencing a tour, staying at a hotel, or dining at a restaurant, you can submit a review on the respective detail page. Your feedback is valuable to us!",
  },
  {
    question: "Do you offer tour guides?",
    answer: "Yes, for many of our tours, you have the option to include a professional tour guide during the booking process.",
  },
  {
    question: "What happens if my booking is not confirmed?",
    answer: "In the rare event that your booking isn't confirmed, we will notify you immediately and provide alternative options or a full refund.",
  },
];

const FAQPage = () => {
  return (
    <div className="container py-5" style={{ minHeight: "calc(100vh - 200px)" }}>
      <p className="fs-5 text-muted text-center">Making your travel dreams a reality, step by step.</p>
      <FAQ items={faqItems} />
      <div className="text-center mt-5">
        <p className="fs-5 text-dark">Still have questions? Don't hesitate to <Link to="/contact" className="text-decoration-none text-primary fw-semibold">Contact Us</Link>.</p>
      </div>
    </div>
  );
};

export default FAQPage;
