import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
  { path: '/crops', label: 'Crop Management', icon: 'bi-flower1' },
  { path: '/activities', label: 'Farm Activities', icon: 'bi-calendar-check' },
  { path: '/expenses', label: 'Expenses', icon: 'bi-cash-stack' },
  { path: '/sales', label: 'Sales & Revenue', icon: 'bi-currency-rupee' },
  { path: '/inventory', label: 'Inventory Stock', icon: 'bi-box-seam' },
  { path: '/market', label: 'Mandi Prices', icon: 'bi-graph-up-arrow' },
  { path: '/weather', label: 'Weather Forecast', icon: 'bi-cloud-sun' },
  { path: '/profile', label: 'Farmer Profile', icon: 'bi-person-badge' },
  { path: '/about', label: 'About & Help', icon: 'bi-question-circle' }
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className={`app-sidebar ${isOpen ? 'show-mobile' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div className="brand-icon-box">
              <i className="bi bi-sprout-fill"></i>
            </div>
            <div>
              <div className="brand-text-title">RythuMitra 360</div>
              <div className="brand-text-sub">Smart Farming</div>
            </div>
          </div>
          {/* Mobile close button */}
          <button 
            type="button" 
            className="btn btn-sm text-white d-lg-none p-1"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="sidebar-menu">
          <li className="sidebar-category">Operations Cockpit</li>
          {navItems.slice(0, 4).map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}

          <li className="sidebar-category mt-3">Commerce & Supplies</li>
          {navItems.slice(4, 7).map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}

          <li className="sidebar-category mt-3">Insights & System</li>
          {navItems.slice(7).map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bottom Status Card */}
        <div className="sidebar-footer-card">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success rounded-pill p-1">
              <i className="bi bi-dot"></i>
            </span>
            <span className="text-white-50 small fw-semibold">Guntur Agro Zone</span>
          </div>
          <div className="text-light small fw-bold">Kharif Season 2026</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
