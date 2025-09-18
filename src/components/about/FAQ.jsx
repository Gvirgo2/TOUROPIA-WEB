import React from "react";

export default function FAQ({ items = [] }) {
  const idBase = "faq-acc";
  return (
    <section className="section py-5">
      <div className="container">
        <div className="row text-center mb-4">
          <h2 className="fw-bold">Frequently Asked Questions</h2>
        </div>
        <div className="accordion" id={`${idBase}`}>
          {items.map((q, idx) => {
            const headingId = `${idBase}-h-${idx}`;
            const collapseId = `${idBase}-c-${idx}`;
            return (
              <div className="accordion-item" key={idx}>
                <h2 className="accordion-header" id={headingId}>
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseId}`} aria-expanded="false" aria-controls={collapseId}>
                    {q.question}
                  </button>
                </h2>
                <div id={collapseId} className="accordion-collapse collapse" aria-labelledby={headingId} data-bs-parent={`#${idBase}`}>
                  <div className="accordion-body text-muted">{q.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
