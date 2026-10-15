import React, { useState, useEffect, useMemo } from 'react';
import { marketService } from '../services/marketService';

// Common Components
import Loader from '../components/common/Loader';
import AlertMessage from '../components/common/AlertMessage';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

// Helpers
import { formatCurrency, formatDate } from '../utils/formatters';

const MarketPrices = () => {
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [trendFilter, setTrendFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const data = await marketService.getAll();
      setMarketPrices(Array.isArray(data) ? data : []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to fetch market rates.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // Filtered
  const filteredPrices = useMemo(() => {
    return marketPrices.filter((item) => {
      const matchesSearch =
        item.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.marketName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = stateFilter === 'ALL' || item.state === stateFilter;
      const matchesTrend = trendFilter === 'ALL' || item.priceTrend === trendFilter;
      return matchesSearch && matchesState && matchesTrend;
    });
  }, [marketPrices, searchTerm, stateFilter, trendFilter]);

  // Paginated
  const paginatedPrices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPrices.slice(startIndex, startIndex + pageSize);
  }, [filteredPrices, currentPage]);

  if (loading && marketPrices.length === 0) {
    return <Loader text="Fetching APMC Mandi commodity rates..." />;
  }

  return (
    <div className="container-fluid px-0">
      {/* Alert Banner */}
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold font-heading mb-1 text-dark">APMC Mandi Market Prices</h2>
          <p className="text-muted small mb-0">
            Daily regional wholesale benchmark rates across agricultural market yards in AP & Telangana.
          </p>
        </div>

        {/* Live-like Demo Badge */}
        <span className="badge bg-info-subtle text-info border border-info-subtle px-3 py-2 small fw-semibold">
          <i className="bi bi-info-circle-fill me-1"></i>
          Sample Demonstration Mandi Rates
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="farm-card p-3 mb-4 bg-white">
        <div className="row g-2 align-items-center">
          {/* Search */}
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search crop, mandi yard, or district..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* State Filter */}
          <div className="col-6 col-md-4">
            <select
              className="form-select form-select-sm"
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All States (AP & Telangana)</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>

          {/* Trend Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={trendFilter}
              onChange={(e) => {
                setTrendFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Price Trends</option>
              <option value="up">Price Rising (&uarr;)</option>
              <option value="down">Price Falling (&darr;)</option>
              <option value="stable">Stable Price (&mdash;)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Prices Grid */}
      {filteredPrices.length === 0 ? (
        <EmptyState
          icon="bi-graph-up-arrow"
          title="No mandi rates match your query"
          description="Try broadening your search term or selecting 'All States'."
        />
      ) : (
        <div className="row g-3 mb-4">
          {paginatedPrices.map((item) => {
            const isUp = item.priceTrend === 'up';
            const isDown = item.priceTrend === 'down';

            return (
              <div key={item.id} className="col-12 col-md-6 col-xl-4">
                <div className="farm-card p-4 h-100 bg-white d-flex flex-column justify-content-between">
                  <div>
                    {/* Top Yard Info */}
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <div>
                        <span className="badge bg-light text-secondary border small mb-1">
                          {item.district}, {item.state}
                        </span>
                        <h5 className="fw-bold text-dark font-heading mb-0">{item.cropName}</h5>
                        <small className="text-muted">{item.marketName}</small>
                      </div>

                      {/* Trend Pill */}
                      <span
                        className={`badge ${
                          isUp
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : isDown
                            ? 'bg-danger-subtle text-danger border border-danger-subtle'
                            : 'bg-light text-muted border'
                        } small`}
                      >
                        <i
                          className={`bi bi-arrow-${
                            isUp ? 'up-right' : isDown ? 'down-right' : 'right'
                          } me-1`}
                        ></i>
                        {isUp ? 'Gaining' : isDown ? 'Softening' : 'Steady'}
                      </span>
                    </div>

                    {/* Modal Price Highlight */}
                    <div className="p-3 my-3 rounded-3 bg-light border text-center">
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                        Modal Price (Most Traded Rate)
                      </small>
                      <h3 className="fw-bold text-success mb-0 font-heading">
                        {formatCurrency(item.modalPricePerQuintal)}
                        <span className="fs-6 text-muted fw-normal"> / Quintal</span>
                      </h3>
                    </div>

                    {/* Min & Max Range */}
                    <div className="d-flex align-items-center justify-content-between small text-secondary py-1 border-bottom">
                      <span className="text-muted">Minimum Mandi Bid:</span>
                      <strong className="text-dark">{formatCurrency(item.minPrice)} / Qtl</strong>
                    </div>
                    <div className="d-flex align-items-center justify-content-between small text-secondary py-1 border-bottom">
                      <span className="text-muted">Maximum Mandi Bid:</span>
                      <strong className="text-dark">{formatCurrency(item.maxPrice)} / Qtl</strong>
                    </div>
                  </div>

                  {/* Footer Timestamp */}
                  <div className="pt-3 border-top mt-3 d-flex align-items-center justify-content-between small text-muted">
                    <span>
                      <i className="bi bi-clock-history me-1"></i>
                      Updated: {formatDate(item.date)}
                    </span>
                    <span className="text-success fw-semibold">APMC Verified</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredPrices.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default MarketPrices;
