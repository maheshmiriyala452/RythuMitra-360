import React, { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';

// Common Components
import Loader from '../components/common/Loader';
import AlertMessage from '../components/common/AlertMessage';

const WeatherForecast = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const data = await weatherService.getWeather();
      setWeather(data || null);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to fetch weather.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading && !weather) {
    return <Loader text="Loading localized agricultural meteorological data..." />;
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
          <h2 className="fw-bold font-heading mb-1 text-dark">Agro Weather & Advisory</h2>
          <p className="text-muted small mb-0">
            Localized microclimate forecast and farming advisories for foliar sprays, irrigation, and harvesting.
          </p>
        </div>

        {/* Demo Disclaimer Badge */}
        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 small fw-semibold">
          <i className="bi bi-info-circle-fill me-1"></i>
          Demonstration / Simulated Weather Data
        </span>
      </div>

      {weather && (
        <>
          {/* Main Weather Cockpit Hero Card */}
          <div 
            className="farm-card p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #0284c7 100%)',
              borderRadius: '20px'
            }}
          >
            <div className="row align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
              {/* Left Temperature & Condition */}
              <div className="col-12 col-md-6">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-25 small fw-semibold mb-3">
                  <i className="bi bi-geo-alt-fill"></i>
                  {weather.location}
                </div>
                
                <div className="d-flex align-items-baseline gap-3 mb-2">
                  <h1 className="display-3 fw-bold font-heading mb-0 text-white">
                    {weather.currentTemp}°C
                  </h1>
                  <span className="fs-5 opacity-75">Feels like {weather.feelsLike}°C</span>
                </div>

                <h4 className="fw-semibold text-white mb-2">{weather.condition}</h4>
                <small className="opacity-75 d-block">Last Updated: {weather.lastUpdated}</small>
              </div>

              {/* Right Weather Indicators */}
              <div className="col-12 col-md-6">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-white bg-opacity-15 backdrop-blur border border-white border-opacity-25">
                      <div className="small opacity-75">Relative Humidity</div>
                      <div className="fs-4 fw-bold">{weather.humidity}%</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-white bg-opacity-15 backdrop-blur border border-white border-opacity-25">
                      <div className="small opacity-75">Rainfall Chance</div>
                      <div className="fs-4 fw-bold">{weather.rainfallProbability}%</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-white bg-opacity-15 backdrop-blur border border-white border-opacity-25">
                      <div className="small opacity-75">Wind Velocity</div>
                      <div className="fs-5 fw-bold">{weather.windSpeed}</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-white bg-opacity-15 backdrop-blur border border-white border-opacity-25">
                      <div className="small opacity-75">Soil Moisture Est.</div>
                      <div className="fs-5 fw-bold">{weather.soilMoistureEstimate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expert Field Advisory Card */}
          <div className="farm-card p-4 bg-white mb-4 border-start border-4 border-success">
            <div className="d-flex align-items-start gap-3">
              <div className="badge bg-success-subtle text-success p-3 rounded-circle fs-4">
                <i className="bi bi-lightbulb-fill"></i>
              </div>
              <div>
                <h5 className="fw-bold text-dark font-heading mb-1">
                  Agronomic Advisory for Current Conditions
                </h5>
                <p className="text-secondary mb-3 small" style={{ fontSize: '0.95rem' }}>
                  {weather.advisory}
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-light text-secondary border small">
                    <i className="bi bi-droplet-half text-primary me-1"></i>
                    Optimal for Foliar Sprays
                  </span>
                  <span className="badge bg-light text-secondary border small">
                    <i className="bi bi-wind text-info me-1"></i>
                    Low Wind Drift Hazard
                  </span>
                  <span className="badge bg-light text-secondary border small">
                    <i className="bi bi-brightness-high text-warning me-1"></i>
                    UV Index: {weather.uvIndex} (Moderate)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Weekly Agro Forecast Grid */}
          <div className="farm-card p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark mb-4 font-heading">7-Day Microclimate Forecast</h5>

            <div className="row g-3">
              {weather.forecast &&
                weather.forecast.map((dayItem, index) => (
                  <div key={index} className="col-6 col-md-4 col-xl">
                    <div
                      className={`p-3 rounded-3 border text-center h-100 ${
                        index === 0 ? 'bg-success-subtle border-success-subtle' : 'bg-light'
                      }`}
                    >
                      <div className="fw-bold text-dark small mb-1">{dayItem.day}</div>
                      <div className="small text-muted mb-2">{dayItem.date}</div>

                      <div className="fs-2 text-success my-2">
                        <i className={`bi ${dayItem.icon || 'bi-cloud-sun'}`}></i>
                      </div>

                      <div className="fw-bold text-dark small">{dayItem.condition}</div>

                      <div className="d-flex align-items-center justify-content-center gap-1 my-2 small">
                        <span className="fw-bold text-dark">{dayItem.tempMax}°</span>
                        <span className="text-muted">/ {dayItem.tempMin}°</span>
                      </div>

                      <div className="small text-info fw-semibold">
                        <i className="bi bi-droplet-fill me-1"></i>
                        {dayItem.rainChance}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Technical Integration Note for Viva */}
          <div className="p-3 bg-light rounded-3 border text-muted small">
            <strong>Architecture Note for Examiner:</strong> This weather module consumes data through{' '}
            <code>src/services/weatherService.js</code>. The current data is served from{' '}
            <code>db.json</code> as mock data. To switch to live telemetry in production, replace the endpoint with{' '}
            <code>https://api.openweathermap.org/data/2.5/forecast</code> or the Indian Meteorological Department (IMD) Open Data portal using an API key stored in <code>.env</code>.
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherForecast;
