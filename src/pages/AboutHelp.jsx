import React, { useState } from 'react';

const AboutHelp = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is the primary objective of RythuMitra 360?',
      a: 'RythuMitra 360 is a centralized, digital smart farming cockpit built to help Indian farmers track crop cycles, manage operational expenditures (fertilizers, seeds, labor, fuel), schedule vital farming tasks, monitor Mandi benchmark prices, and accurately determine true net profits per acre.'
    },
    {
      q: 'How does the Mock REST API backend work?',
      a: 'The application uses JSON Server on port 5001 paired with a persistent db.json file. It exposes full RESTful HTTP endpoints supporting standard CRUD (Create, Read, Update, Delete) methods (GET, POST, PUT, PATCH, DELETE) accessed via a dedicated Axios service layer.'
    },
    {
      q: 'Are the dashboard statistics hardcoded or dynamically calculated?',
      a: 'All dashboard statistics (total planted acres, cumulative expenses, gross sales revenue, net profit margin, and inventory alerts) are calculated dynamically on the client side from live responses fetched from JSON Server.'
    },
    {
      q: 'How does the system ensure form inputs are valid before saving?',
      a: 'RythuMitra 360 features client-side validation utilities that check required fields, enforce positive numerical amounts for expenses and harvest sales, validate valid phone numbers, and ensure expected harvest dates occur after planting dates.'
    },
    {
      q: 'Can RythuMitra 360 connect to real-world weather or government APMC APIs?',
      a: 'Yes! The architecture is modular: the weatherService.js and marketService.js files can be upgraded to point to actual Indian meteorological (IMD) or e-NAM / Agmarknet APIs without modifying the React view components.'
    }
  ];

  return (
    <div className="container-fluid px-0">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold font-heading mb-1 text-dark">About & System Documentation</h2>
        <p className="text-muted small mb-0">
          Learn about the architecture, technology stack, and user guidance for RythuMitra 360.
        </p>
      </div>

      <div className="row g-4 mb-4">
        {/* Project Profile Card */}
        <div className="col-lg-7">
          <div className="farm-card p-4 h-100 bg-white">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="brand-icon-box">
                <i className="bi bi-sprout-fill"></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-0 font-heading">RythuMitra 360</h4>
                <div className="text-success small fw-semibold">Smart Farming. Better Decisions. Higher Yields.</div>
              </div>
            </div>

            <p className="text-secondary small mb-3">
              RythuMitra 360 was developed as a frontend major project submission at <strong>Codegnan IT Solutions</strong>. 
              The application bridges the gap between traditional agricultural practices and modern data-driven farm management.
            </p>

            <h6 className="fw-bold text-dark mb-2">Core Technology Stack</h6>
            <div className="row g-2 mb-4">
              <div className="col-sm-6">
                <div className="p-2 border rounded-2 bg-light small">
                  <strong>Frontend Framework:</strong> React.js 18+ (Hooks & Functional Components)
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 border rounded-2 bg-light small">
                  <strong>Bundler & Dev Server:</strong> Vite 5+ (Fast ESM Build Engine)
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 border rounded-2 bg-light small">
                  <strong>Styling & Components:</strong> Bootstrap 5.3 + Bootstrap Icons
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 border rounded-2 bg-light small">
                  <strong>Routing:</strong> React Router DOM v6
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 border rounded-2 bg-light small">
                  <strong>Data Visualizations:</strong> Recharts (SVG Charts)
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 border rounded-2 bg-light small">
                  <strong>Mock REST Backend:</strong> JSON Server (Port 5001) + db.json
                </div>
              </div>
            </div>

            <div className="p-3 rounded-3 bg-success-subtle text-success-emphasis border border-success-subtle">
              <div className="fw-bold small mb-1"><i className="bi bi-award-fill me-1"></i> Institute Submission Metadata</div>
              <div className="small">
                <strong>Institution:</strong> Codegnan IT Solutions • Python Full Stack Specialization
              </div>
            </div>
          </div>
        </div>

        {/* Support & Quick Contact */}
        <div className="col-lg-5">
          <div className="farm-card p-4 h-100 bg-white">
            <h5 className="fw-bold text-dark mb-3 font-heading">Farmer Support & Helpline</h5>
            <p className="text-muted small mb-4">
              Need assistance setting up your crops or understanding mandi price trends? We are here to help.
            </p>

            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3 border">
              <div className="text-success fs-3">
                <i className="bi bi-telephone-outbound-fill"></i>
              </div>
              <div>
                <div className="small text-muted">Kisan Call Center (Toll Free)</div>
                <div className="fw-bold text-dark">1800-180-1551</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3 border">
              <div className="text-success fs-3">
                <i className="bi bi-envelope-check-fill"></i>
              </div>
              <div>
                <div className="small text-muted">Support Email</div>
                <div className="fw-bold text-dark">support@rythumitra360.in</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border">
              <div className="text-success fs-3">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <div className="small text-muted">Field Agro Center</div>
                <div className="fw-bold text-dark">Guntur District Yard, Andhra Pradesh</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <div className="farm-card p-4 bg-white mb-4">
        <h5 className="fw-bold text-dark mb-3 font-heading">Frequently Asked Questions (FAQ)</h5>
        
        <div className="d-flex flex-column gap-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-3 overflow-hidden">
              <button
                type="button"
                className="w-100 text-start p-3 bg-light border-0 d-flex align-items-center justify-content-between fw-semibold text-dark small"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.q}</span>
                <i className={`bi bi-chevron-${activeFaq === index ? 'up' : 'down'} text-success`}></i>
              </button>
              {activeFaq === index && (
                <div className="p-3 bg-white text-secondary small border-top">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutHelp;
