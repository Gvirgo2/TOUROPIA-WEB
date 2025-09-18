import React from "react";

function Stars({ count = 5 }) {
  return (
    <span aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </span>
  );
}

export default function Testimonials({ items = [] }) {
  return (
    <section className="section py-5">
      <div className="container">
        <div className="row text-center mb-4">
          <h2 className="fw-bold">What Travelers Say</h2>
        </div>
        <div className="row g-4">
          {items.map((t, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-4">
              <div className="h-100 p-4 border rounded-3">
                <div className="d-flex align-items-center mb-3 gap-3">
                  <img src={t.avatar} alt={t.name} width={48} height={48} className="rounded-circle" />
                  <div>
                    <div className="fw-semibold">{t.name}</div>
                    <div className="text-muted small"><Stars count={t.stars || 5} /></div>
                  </div>
                </div>
                <p className="mb-0 text-muted">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
