import React from "react";

export default function Partners({ logos = [] }) {
  return (
    <section className="section py-4 bg-light">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-4">
          {logos.map((src, idx) => (
            <img key={idx} src={src} alt={`Partner ${idx + 1}`} style={{ maxHeight: 40, objectFit: 'contain' }} />
          ))}
        </div>
      </div>
    </section>
  );
}
