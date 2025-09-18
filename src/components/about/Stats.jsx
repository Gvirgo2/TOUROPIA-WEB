import React from "react";

export default function Stats({ stats = [] }) {
  return (
    <section className="section py-5 bg-light">
      <div className="container">
        <div className="row g-4 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="display-6 fw-bold" aria-label={s.label}>{s.value}</div>
              <div className="text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
