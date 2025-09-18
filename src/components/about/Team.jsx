import React from "react";

export default function Team({ members = [] }) {
  return (
    <section className="section py-5">
      <div className="container">
        <div className="row text-center mb-4">
          <h2 className="fw-bold">Meet the Team</h2>
          <p className="text-muted">The people behind your journey</p>
        </div>
        <div className="row g-4">
          {members.map((m, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-lg-3">
              <div className="h-100 p-3 border rounded-3 text-center">
                <img src={m.photo} alt={m.name} className="rounded-circle mb-3" width={96} height={96} />
                <h6 className="fw-semibold mb-1">{m.name}</h6>
                <div className="text-muted small mb-2">{m.role}</div>
                {m.social && (
                  <div className="d-flex gap-2 justify-content-center">
                    {m.social.linkedin && (
                      <a href={m.social.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none">LinkedIn</a>
                    )}
                    {m.social.twitter && (
                      <a href={m.social.twitter} target="_blank" rel="noreferrer" className="text-decoration-none">Twitter</a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
