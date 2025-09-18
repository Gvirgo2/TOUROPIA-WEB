import React, { useState } from "react";
import { contactAPI } from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Valid email is required";
    if (!form.message.trim()) return "Message is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login or sign up to submit a message.");
      navigate("/login");
      return;
    }
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      setSubmitting(true);
      await contactAPI.submit(form);
      toast.success("Message sent successfully");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Failed to send message";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <div className="contact-section main-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-9">
              <div className="contact-card">
                <h4 className="contact-heading">
                  Feel Free to Write Us Anytime{" "}
                </h4>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="row g-4">
                    <div className="col-sm-6">
                      <input
                        type="text"
                        name="name"
                        className="form-control custom-input "
                        placeholder="Enter Your Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="email"
                        name="email"
                        className="form-control custom-input "
                        placeholder="Enter Your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        name="phone"
                        className="form-control custom-input "
                        placeholder="Enter Your phone"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        name="subject"
                        className="form-control custom-input "
                        placeholder="Select your subject"
                        value={form.subject}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-12">
                      <textarea
                        className="form-control custom-textarea"
                        name="message"
                        rows="5"
                        placeholder="Enter Your Message..."
                        value={form.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn send-btn" disabled={submitting}>
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="map-container">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1744109.3371823528!2d37.809148448513206!3d9.07628738068407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1756666902007!5m2!1sen!2set"
            allowFullScreen
            loading="lazy"
            className="map-frame"
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default ContactSection;
