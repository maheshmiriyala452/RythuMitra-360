import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <div className="brand-icon-box" style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}>
              <i className="bi bi-sprout-fill"></i>
            </div>
            <span className="fw-bold fs-4 text-dark font-heading">RythuMitra 360</span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#landingNav"
            aria-controls="landingNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="landingNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-semibold">
              <li className="nav-item">
                <a className="nav-link px-3" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#benefits">Farmer Benefits</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#modules">System Modules</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#tech">Tech Stack</a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <Link to="/about" className="btn btn-outline-secondary btn-sm px-3 rounded-pill">
                Help & Docs
              </Link>
              <Link to="/dashboard" className="btn btn-farm btn-sm px-4 rounded-pill">
                <i className="bi bi-speedometer2 me-1"></i>
                Launch Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 py-lg-6" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success-subtle text-success border border-success-subtle small fw-bold mb-3">
                <i className="bi bi-stars"></i>
                Advanced Major Project • Codegnan IT Solutions
              </div>
              <h1 className="display-4 fw-extrabold text-dark font-heading mb-3" style={{ letterSpacing: '-0.5px' }}>
                Smart Farming. <br />
                <span className="text-success">Better Decisions.</span> <br />
                Higher Yields.
              </h1>
              <p className="lead text-secondary mb-4">
                <strong>RythuMitra 360 (రైతు మిత్ర 360)</strong> is an all-in-one Smart Agriculture Management 
                Platform designed for Indian farmers to effortlessly track crops, monitor expenses, schedule farm activities, 
                check real-time mandi prices, and maximize profit margins.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-4">
                <Link to="/dashboard" className="btn btn-farm btn-lg px-4 py-3 rounded-3 shadow-sm d-inline-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-grid-fill"></i>
                  Enter Farmer Cockpit
                </Link>
                <Link to="/crops" className="btn btn-outline-success btn-lg px-4 py-3 rounded-3 d-inline-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-flower1"></i>
                  Manage Crops
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="row g-3 pt-3 border-top text-start">
                <div className="col-4">
                  <div className="fw-bold fs-5 text-dark">15.5+</div>
                  <div className="small text-muted">Acres Managed</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-5 text-dark">7 APMC</div>
                  <div className="small text-muted">Mandi Feeds</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-5 text-dark">100%</div>
                  <div className="small text-muted">REST API Driven</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Main Card */}
                <div className="farm-card p-4 shadow-lg border-2" style={{ borderColor: '#86efac' }}>
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success p-2 rounded-circle">
                        <i className="bi bi-check-lg"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Active Farm Overview</h6>
                        <small className="text-muted">Guntur Agro Zone (Kharif 2026)</small>
                      </div>
                    </div>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                      Healthy Yield
                    </span>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-light border">
                        <small className="text-muted d-block mb-1">Total Crop Revenue</small>
                        <h4 className="fw-bold text-success mb-0">₹9,63,400</h4>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-light border">
                        <small className="text-muted d-block mb-1">Total Farm Expenses</small>
                        <h4 className="fw-bold text-danger mb-0">₹66,400</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-3 bg-success-subtle text-success-emphasis border border-success-subtle d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-bold small">Current Top Produce Rate</div>
                      <div className="small">Guntur Red Chilli (Teja 441)</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold fs-5">₹21,500 / Qtl</div>
                      <small className="text-success"><i className="bi bi-arrow-up-right"></i> +₹450 today</small>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="farm-card p-3 position-absolute d-none d-md-flex align-items-center gap-3 shadow-md" style={{ bottom: '-20px', left: '-20px', maxWidth: '240px' }}>
                  <div className="rounded-circle bg-warning-subtle text-warning p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-bell-fill fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-bold small">Low Stock Alert</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Urea Fertilizer (6 bags left)</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="farm-card p-3 position-absolute d-none d-md-flex align-items-center gap-3 shadow-md" style={{ top: '-15px', right: '-15px', maxWidth: '220px' }}>
                  <div className="rounded-circle bg-info-subtle text-info p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-cloud-sun-fill fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-bold small">Weather Advisory</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>29°C • Partly Cloudy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-5 bg-light border-top border-bottom">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-success fw-bold text-uppercase small tracking-wider">Comprehensive Agro Toolkit</span>
            <h2 className="display-6 fw-bold text-dark mt-1 font-heading">Everything a Modern Farmer Needs</h2>
            <p className="text-muted">
              Built with precision to replace physical paper diaries with seamless digital intelligence.
            </p>
          </div>

          <div className="row g-4" id="modules">
            {/* Feature 1 */}
            <div className="col-md-6 col-lg-4">
              <div className="farm-card p-4 h-100 bg-white">
                <div className="stat-card-icon icon-bg-green mb-3">
                  <i className="bi bi-flower1"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Crop Management</h5>
                <p className="text-muted small mb-3">
                  Log sown acreages, varieties, sowing dates, and harvest estimates. Filter crops by season and monitor growth cycles.
                </p>
                <Link to="/crops" className="text-success small fw-semibold text-decoration-none">
                  Open Crops &rarr;
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-6 col-lg-4">
              <div className="farm-card p-4 h-100 bg-white">
                <div className="stat-card-icon icon-bg-blue mb-3">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Task & Activity Scheduler</h5>
                <p className="text-muted small mb-3">
                  Stay on top of irrigation schedules, fertilizer broadcasts, pesticide sprays, and weeding with priority tracking.
                </p>
                <Link to="/activities" className="text-success small fw-semibold text-decoration-none">
                  Open Activities &rarr;
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-6 col-lg-4">
              <div className="farm-card p-4 h-100 bg-white">
                <div className="stat-card-icon icon-bg-amber mb-3">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Expense Tracking</h5>
                <p className="text-muted small mb-3">
                  Track every rupee spent on seeds, fertilizers, labor, diesel, and machinery. View instant category-wise breakdowns.
                </p>
                <Link to="/expenses" className="text-success small fw-semibold text-decoration-none">
                  Open Expenses &rarr;
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-md-6 col-lg-4">
              <div className="farm-card p-4 h-100 bg-white">
                <div className="stat-card-icon icon-bg-purple mb-3">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Sales & Revenue Ledger</h5>
                <p className="text-muted small mb-3">
                  Log produce sales to APMC traders and mill syndicates. Automatic calculation of quantity multiplied by unit price.
                </p>
                <Link to="/sales" className="text-success small fw-semibold text-decoration-none">
                  Open Sales &rarr;
                </Link>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-md-6 col-lg-4">
              <div className="farm-card p-4 h-100 bg-white">
                <div className="stat-card-icon icon-bg-green mb-3">
                  <i className="bi bi-box-seam"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Inventory Stock & Alerts</h5>
                <p className="text-muted small mb-3">
                  Never run out of fertilizer or pesticide during critical growth phases. Automatic alerts trigger when items hit reorder thresholds.
                </p>
                <Link to="/inventory" className="text-success small fw-semibold text-decoration-none">
                  Open Inventory &rarr;
                </Link>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="col-md-6 col-lg-4">
              <div className="farm-card p-4 h-100 bg-white">
                <div className="stat-card-icon icon-bg-blue mb-3">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Mandi Prices & Weather</h5>
                <p className="text-muted small mb-3">
                  Benchmark rates across major regional yards (Guntur, Warangal, Khammam, Nizamabad) plus localized 7-day agro forecasts.
                </p>
                <Link to="/market" className="text-success small fw-semibold text-decoration-none">
                  Open Mandi Rates &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Benefits Section */}
      <section id="benefits" className="py-5 bg-white">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-lg-2">
              <span className="text-success fw-bold text-uppercase small tracking-wider">Why RythuMitra 360</span>
              <h2 className="display-6 fw-bold text-dark mt-1 font-heading mb-4">
                Designed to Solve Real Ground-Level Farming Challenges
              </h2>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="badge bg-success-subtle text-success p-2 rounded-circle fs-5">
                  <i className="bi bi-wallet2"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Know Your True Net Profit Per Acre</h6>
                  <p className="text-muted small mb-0">
                    Traditional farmers struggle to calculate whether a crop yielded real net profits after factoring in labor, machinery, and fertilizer inputs. RythuMitra 360 does it automatically.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="badge bg-success-subtle text-success p-2 rounded-circle fs-5">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Prevent Costly Irrigation & Spray Delays</h6>
                  <p className="text-muted small mb-0">
                    A missed pest spray can ruin an entire chili or cotton crop. The interactive calendar ensures critical agro-tasks are executed on time.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="badge bg-success-subtle text-success p-2 rounded-circle fs-5">
                  <i className="bi bi-cash-coin"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Bargain Better at APMC Yards</h6>
                  <p className="text-muted small mb-0">
                    With modal and maximum rate transparency across neighboring districts, middlemen cannot undervalue your harvest produce.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 order-lg-1">
              <div className="p-4 rounded-4" style={{ background: '#f4fbf4', border: '2px dashed #a7f3d0' }}>
                <h5 className="fw-bold text-success mb-3">Farm Economics at a Glance</h5>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                  <li className="d-flex justify-content-between p-3 bg-white rounded-3 shadow-sm">
                    <span className="fw-medium text-secondary">Total Produce Sales Revenue</span>
                    <span className="fw-bold text-success">₹9,63,400</span>
                  </li>
                  <li className="d-flex justify-content-between p-3 bg-white rounded-3 shadow-sm">
                    <span className="fw-medium text-secondary">Total Operational Expenses</span>
                    <span className="fw-bold text-danger">- ₹66,400</span>
                  </li>
                  <li className="d-flex justify-content-between p-3 bg-success text-white rounded-3 shadow-sm">
                    <span className="fw-bold">Estimated Net Farm Profit</span>
                    <span className="fw-bold fs-5">₹8,97,000</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section id="tech" className="py-5 bg-light border-top">
        <div className="container text-center py-3">
          <span className="text-muted small fw-bold text-uppercase tracking-wider">Built With Modern Industry Standards</span>
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 mt-3">
            <span className="badge bg-white text-dark border p-2 px-3 fw-semibold shadow-sm">
              <i className="bi bi-filetype-jsx text-primary me-1"></i> React 18+ with Vite
            </span>
            <span className="badge bg-white text-dark border p-2 px-3 fw-semibold shadow-sm">
              <i className="bi bi-bootstrap-fill text-purple me-1" style={{ color: '#7952b3' }}></i> Bootstrap 5.3
            </span>
            <span className="badge bg-white text-dark border p-2 px-3 fw-semibold shadow-sm">
              <i className="bi bi-signpost-split-fill text-danger me-1"></i> React Router DOM v6
            </span>
            <span className="badge bg-white text-dark border p-2 px-3 fw-semibold shadow-sm">
              <i className="bi bi-arrow-left-right text-info me-1"></i> Axios REST Client
            </span>
            <span className="badge bg-white text-dark border p-2 px-3 fw-semibold shadow-sm">
              <i className="bi bi-pie-chart-fill text-warning me-1"></i> Recharts
            </span>
            <span className="badge bg-white text-dark border p-2 px-3 fw-semibold shadow-sm">
              <i className="bi bi-database-fill text-success me-1"></i> JSON Server
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-4 bg-dark text-white-50 border-top border-secondary">
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-md-6 text-center text-md-start">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                <i className="bi bi-sprout-fill text-success fs-5"></i>
                <span className="fw-bold text-white fs-5">RythuMitra 360</span>
              </div>
              <p className="small mb-0">
                Major Frontend Project Submission • <strong>Codegnan IT Solutions</strong>
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <Link to="/dashboard" className="btn btn-outline-success btn-sm px-3 rounded-pill me-2">
                Open Dashboard
              </Link>
              <Link to="/about" className="btn btn-secondary btn-sm px-3 rounded-pill">
                About & Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
