import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Services
import { cropService } from '../services/cropService';
import { activityService } from '../services/activityService';
import { expenseService } from '../services/expenseService';
import { salesService } from '../services/salesService';
import { inventoryService } from '../services/inventoryService';
import { weatherService } from '../services/weatherService';
import { marketService } from '../services/marketService';

// Common Components
import StatCard from '../components/common/StatCard';
import Loader from '../components/common/Loader';
import AlertMessage from '../components/common/AlertMessage';

// Charts
import CropDistributionChart from '../components/charts/CropDistributionChart';
import MonthlyExpenseChart from '../components/charts/MonthlyExpenseChart';
import RevenueExpenseComparison from '../components/charts/RevenueExpenseComparison';

// Formatters
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Raw data from JSON Server
  const [crops, setCrops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [weather, setWeather] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);

  // Fetch all collections concurrently
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        cropsData,
        activitiesData,
        expensesData,
        salesData,
        inventoryData,
        weatherData,
        marketData
      ] = await Promise.all([
        cropService.getAll(),
        activityService.getAll(),
        expenseService.getAll(),
        salesService.getAll(),
        inventoryService.getAll(),
        weatherService.getWeather(),
        marketService.getAll()
      ]);

      setCrops(Array.isArray(cropsData) ? cropsData : []);
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setSales(Array.isArray(salesData) ? salesData : []);
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      setWeather(weatherData || null);
      setMarketPrices(Array.isArray(marketData) ? marketData : []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Could not load data from JSON Server. Make sure it is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate live statistics
  const totalCrops = crops.length;
  const growingCrops = crops.filter((c) => c.status === 'Growing').length;
  const totalAcres = crops.reduce((sum, c) => sum + (Number(c.areaAcres) || 0), 0);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalRevenue = sales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
  
  const pendingActivities = activities.filter((a) => a.status !== 'Completed').length;
  const lowStockItems = inventory.filter((i) => Number(i.quantity) <= Number(i.reorderLevel));

  // Quick activity status toggle
  const handleToggleActivity = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      await activityService.patchStatus(id, nextStatus);
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
      );
    } catch (err) {
      console.error('Failed to toggle activity:', err);
    }
  };

  if (loading) {
    return <Loader text="Loading farm operations metrics and charts..." />;
  }

  return (
    <div className="container-fluid px-0">
      {/* Error Alert with retry */}
      {error && (
        <AlertMessage
          type="danger"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Top Welcome & Quick Actions Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 small fw-bold">
              <i className="bi bi-geo-alt-fill me-1"></i>
              Guntur Agro Zone, AP
            </span>
            <span className="text-muted small">&bull;</span>
            <span className="text-muted small">Kharif Season 2026</span>
          </div>
          <h2 className="fw-bold font-heading mb-0 text-dark">
            Farmer Operations Cockpit
          </h2>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="d-flex flex-wrap gap-2">
          <Link to="/crops" className="btn btn-farm btn-sm px-3 rounded-pill shadow-sm">
            <i className="bi bi-plus-circle me-1"></i> Add Crop
          </Link>
          <Link to="/expenses" className="btn btn-outline-success btn-sm px-3 rounded-pill bg-white">
            <i className="bi bi-cash me-1"></i> Log Expense
          </Link>
          <Link to="/activities" className="btn btn-outline-secondary btn-sm px-3 rounded-pill bg-white">
            <i className="bi bi-calendar-plus me-1"></i> New Task
          </Link>
        </div>
      </div>

      {/* Section 1: KPI Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Registered Crops"
            value={totalCrops}
            icon="bi-flower1"
            colorClass="green"
            subtitle={`${growingCrops} currently growing in fields`}
            trend="+2 this season"
            trendType="up"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Farm Area"
            value={`${totalAcres.toFixed(1)} Acres`}
            icon="bi-pie-chart"
            colorClass="blue"
            subtitle="Under active crop cultivation"
            trend="100% utilized"
            trendType="neutral"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Cumulative Expenses"
            value={formatCurrency(totalExpenses)}
            icon="bi-cash-stack"
            colorClass="amber"
            subtitle={`${expenses.length} logged input transactions`}
            trend="Operational"
            trendType="down"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Gross Harvest Sales"
            value={formatCurrency(totalRevenue)}
            icon="bi-currency-rupee"
            colorClass="purple"
            subtitle={`${sales.length} verified produce sales`}
            trend="Monetized"
            trendType="up"
          />
        </div>
      </div>

      {/* Section 2: Visual Charts Row */}
      <div className="row g-4 mb-4">
        {/* Crop Distribution Donut */}
        <div className="col-12 col-lg-4">
          <div className="farm-card p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0 font-heading">Acreage by Crop</h6>
              <span className="badge bg-light text-muted small">{totalCrops} Crops</span>
            </div>
            <CropDistributionChart crops={crops} />
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="col-12 col-lg-4">
          <div className="farm-card p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0 font-heading">Expenses by Category</h6>
              <span className="badge bg-light text-muted small">{formatCurrency(totalExpenses)}</span>
            </div>
            <MonthlyExpenseChart expenses={expenses} />
          </div>
        </div>

        {/* Financial Health Comparison */}
        <div className="col-12 col-lg-4">
          <RevenueExpenseComparison
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
          />
        </div>
      </div>

      {/* Section 3: Operational Feeds & Widgets */}
      <div className="row g-4">
        {/* Left: Active Farm Activities Table */}
        <div className="col-12 col-lg-8">
          <div className="farm-card p-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold text-dark mb-1 font-heading">Active Farm Tasks & Schedule</h6>
                <small className="text-muted">
                  {pendingActivities} pending or in-progress operations
                </small>
              </div>
              <Link to="/activities" className="btn btn-outline-success btn-sm rounded-pill">
                View All Tasks &rarr;
              </Link>
            </div>

            <div className="table-responsive">
              <table className="farm-table">
                <thead>
                  <tr>
                    <th>Task & Crop</th>
                    <th>Category</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.slice(0, 5).map((act) => (
                    <tr key={act.id}>
                      <td>
                        <div className="fw-bold text-dark">{act.title}</div>
                        <small className="text-muted">{act.cropName}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">
                          {act.category}
                        </span>
                      </td>
                      <td className="small text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(act.dueDate)}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            act.priority === 'High'
                              ? 'bg-danger-subtle text-danger border border-danger-subtle'
                              : act.priority === 'Medium'
                              ? 'bg-warning-subtle text-warning border border-warning-subtle'
                              : 'bg-light text-muted border'
                          } small`}
                        >
                          {act.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge-status ${
                            act.status === 'Completed'
                              ? 'badge-completed'
                              : act.status === 'In Progress'
                              ? 'badge-in-progress'
                              : 'badge-pending'
                          }`}
                        >
                          <i
                            className={`bi ${
                              act.status === 'Completed'
                                ? 'bi-check2-circle'
                                : act.status === 'In Progress'
                                ? 'bi-hourglass-split'
                                : 'bi-dash-circle'
                            }`}
                          ></i>
                          {act.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            act.status === 'Completed'
                              ? 'btn-outline-secondary'
                              : 'btn-outline-success'
                          } px-2 py-1 rounded-pill`}
                          onClick={() => handleToggleActivity(act.id, act.status)}
                          title="Toggle Task Status"
                        >
                          <i
                            className={`bi ${
                              act.status === 'Completed' ? 'bi-arrow-counterclockwise' : 'bi-check2'
                            }`}
                          ></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Weather & Low-Stock Alerts */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
          {/* Weather Widget */}
          <div className="farm-card p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge bg-info-subtle text-info border border-info-subtle small fw-bold">
                <i className="bi bi-info-circle me-1"></i> Demo Weather Data
              </span>
              <small className="text-muted">Guntur Zone</small>
            </div>

            {weather ? (
              <div>
                <div className="d-flex align-items-center justify-content-between my-3">
                  <div>
                    <h2 className="display-5 fw-bold text-dark font-heading mb-0">
                      {weather.currentTemp}°C
                    </h2>
                    <small className="text-secondary fw-medium">
                      {weather.condition}
                    </small>
                  </div>
                  <div className="text-info fs-1">
                    <i className="bi bi-cloud-sun"></i>
                  </div>
                </div>

                <div className="row g-2 p-2 bg-light rounded-3 mb-3 small text-center">
                  <div className="col-4">
                    <span className="text-muted d-block">Humidity</span>
                    <strong className="text-dark">{weather.humidity}%</strong>
                  </div>
                  <div className="col-4">
                    <span className="text-muted d-block">Rain Chance</span>
                    <strong className="text-dark">{weather.rainfallProbability}%</strong>
                  </div>
                  <div className="col-4">
                    <span className="text-muted d-block">Wind</span>
                    <strong className="text-dark">{weather.windSpeed?.split(' ')[0]} km/h</strong>
                  </div>
                </div>

                <p className="small text-secondary mb-3 p-2 border-start border-3 border-success bg-light rounded-end">
                  <strong>Advisory:</strong> {weather.advisory}
                </p>

                <Link to="/weather" className="btn btn-outline-success btn-sm w-100 rounded-pill">
                  7-Day Agro Forecast &rarr;
                </Link>
              </div>
            ) : (
              <p className="text-muted small">Weather service unavailable.</p>
            )}
          </div>

          {/* Low Stock Warning Card */}
          <div className="farm-card p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0 font-heading d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                Inventory Alerts
              </h6>
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle small">
                {lowStockItems.length} Low Stock
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-success small mb-0">
                <i className="bi bi-check-circle me-1"></i> All farm inventory items are above safety thresholds.
              </p>
            ) : (
              <div className="d-flex flex-column gap-2 mb-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 border rounded-3 bg-light d-flex align-items-center justify-content-between small"
                  >
                    <div>
                      <div className="fw-semibold text-dark">{item.itemName}</div>
                      <small className="text-danger fw-bold">
                        Only {item.quantity} {item.unit} left
                      </small>
                    </div>
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                      Min: {item.reorderLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Link to="/inventory" className="btn btn-outline-secondary btn-sm w-100 rounded-pill">
              Manage Warehouse Stock &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
