import React from "react";

export default function Timeline({ items = [] }) {
  return (
    <section className="section py-5 bg-light">
      <div className="container">
        <div className="row text-center mb-4">
          <h2 className="fw-bold">Our Story</h2>
        </div>
        <div className="row">
          <div className="col-12">
            <ul className="list-unstyled">
              {items.map((it, idx) => (
                <li key={idx} className="d-flex flex-column flex-md-row align-items-start gap-3 py-3 border-bottom">
                  <div className="badge bg-success-subtle text-success fw-semibold" style={{ minWidth: 90 }}>{it.year}</div>
                  <div>
                    <h6 className="fw-semibold mb-1">{it.title}</h6>
                    <p className="text-muted mb-0">{it.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
