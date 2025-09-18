import React from "react";

export default function CTABand({ title, text, primaryText, primaryHref, secondaryText, secondaryHref }) {
  return (
    <section className="py-5" style={{ background: '#23A16F' }}>
      <div className="container">
        <div className="row align-items-center g-3">
          <div className="col-lg-8 text-white">
            <h3 className="fw-bold mb-1">{title}</h3>
            <p className="mb-0">{text}</p>
          </div>
          <div className="col-lg-4 d-flex gap-2 justify-content-lg-end">
            {primaryHref && (
              <a href={primaryHref} className="btn btn-light">{primaryText}</a>
            )}
            {secondaryHref && (
              <a href={secondaryHref} className="btn btn-outline-light">{secondaryText}</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
