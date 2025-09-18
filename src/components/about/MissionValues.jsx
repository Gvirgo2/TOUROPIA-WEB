import React from "react";

export default function MissionValues({ items = [] }) {
  return (
    <section className="section py-5">
      <div className="container">
        <div className="row text-center mb-4">
          <h2 className="fw-bold">Our Mission & Values</h2>
          <p className="text-muted">What drives Touropia to create unforgettable journeys</p>
        </div>
        <div className="row g-4">
          {items.map((it, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-4">
              <div className="h-100 p-4 border rounded-3">
                <div className="fs-1 mb-3" aria-hidden>
                  <i className={it.icon || "ri-earth-fill"}></i>
                </div>
                <h5 className="fw-semibold">{it.title}</h5>
                <p className="text-muted mb-0">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
