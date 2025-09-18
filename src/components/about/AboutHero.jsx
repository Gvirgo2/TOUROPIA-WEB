import React from "react";

export default function AboutHero({ title, subtitle, image, ctaText = "Learn More", onCta }) {
  return (
    <section className="section py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h1 className="fw-bold mb-3">{title}</h1>
            <p className="lead text-muted">{subtitle}</p>
            <button className="btn btn-success mt-3" onClick={onCta}>{ctaText}</button>
          </div>
          <div className="col-lg-6">
            {image && (
              <img src={image} alt="About hero" className="img-fluid rounded-4 w-100" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
