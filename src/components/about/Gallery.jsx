import React from "react";

export default function Gallery({ images = [] }) {
  return (
    <section className="section py-5">
      <div className="container">
        <div className="row text-center mb-4">
          <h2 className="fw-bold">Gallery</h2>
          <p className="text-muted">A glimpse into our destinations</p>
        </div>
        <div className="row g-3">
          {images.map((src, idx) => (
            <div key={idx} className="col-6 col-md-4 col-lg-3">
              <a href={src} target="_blank" rel="noreferrer" className="d-block">
                <img src={src} alt={`Gallery ${idx + 1}`} className="img-fluid rounded-3 w-100" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
