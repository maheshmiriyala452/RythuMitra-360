import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { farmerService } from '../../services/farmerService';

const Navbar = ({ onToggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await farmerService.getNotifications();
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter((n) => !n.isRead).length);
        }
      } catch (err) {
        console.error('Error fetching notifications in navbar:', err);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await farmerService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <header className="app-navbar">
      {/* Left: Mobile hamburger & search */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-light d-lg-none p-2 border"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
        >
          <i className="bi bi-list fs-5"></i>
        </button>

        <div className="nav-search-box d-none d-md-block">
          <i className="bi bi-search nav-search-icon"></i>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search crops, tasks, expenses, market rates..."
          />
        </div>
      </div>

      {/* Right: Quick shortcuts, Notifications, Farmer Profile */}
      <div className="d-flex align-items-center gap-2 gap-sm-3">
        {/* Quick link to Landing Page */}
        <Link to="/" className="btn btn-outline-success btn-sm rounded-pill d-none d-sm-inline-flex align-items-center gap-1">
          <i className="bi bi-house"></i>
          <span>Home</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="position-relative">
          <button
            type="button"
            className="nav-action-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
          >
            <i className="bi bi-bell"></i>
            {unreadCount > 0 && <span className="notification-badge"></span>}
          </button>

          {showNotifications && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-0"
              style={{ width: '320px', zIndex: 1050 }}
            >
              <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light rounded-top">
                <span className="fw-bold small text-dark">Notifications</span>
                <span className="badge bg-success rounded-pill small">
                  {unreadCount} new
                </span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div className="p-3 text-center text-muted small">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-bottom d-flex align-items-start gap-2 ${
                        !n.isRead ? 'bg-light-subtle' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                    >
                      <i
                        className={`bi ${
                          n.type === 'warning'
                            ? 'bi-exclamation-triangle-fill text-warning'
                            : n.type === 'success'
                            ? 'bi-arrow-up-circle-fill text-success'
                            : 'bi-info-circle-fill text-primary'
                        } mt-1`}
                      ></i>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-dark small">{n.title}</div>
                        <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
                          {n.message}
                        </div>
                      </div>
                      {!n.isRead && (
                        <span
                          className="bg-primary rounded-circle"
                          style={{ width: '6px', height: '6px', marginTop: '6px' }}
                        ></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 text-center border-top bg-light rounded-bottom">
                <Link
                  to="/activities"
                  className="small text-success fw-semibold text-decoration-none"
                  onClick={() => setShowNotifications(false)}
                >
                  View All Activities &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Farmer Profile Badge */}
        <Link to="/profile" className="profile-chip">
          <div className="profile-avatar">MK</div>
          <div className="d-none d-sm-block text-start">
            <div className="fw-bold small text-dark line-height-1">Mahesh Reddy</div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              15.5 Acres • Guntur
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
