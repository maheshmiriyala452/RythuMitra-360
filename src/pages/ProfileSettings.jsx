import React, { useState, useEffect } from 'react';
import { farmerService } from '../services/farmerService';

// Common Components
import AlertMessage from '../components/common/AlertMessage';
import Loader from '../components/common/Loader';

// Validation & Formatting
import { validateRequired, validatePositiveNumber, validatePhone, validateEmail } from '../utils/validators';
import { formatDate } from '../utils/formatters';

const initialProfileState = {
  id: '1',
  name: '',
  phone: '',
  email: '',
  farmName: '',
  location: '',
  totalArea: '',
  soilType: '',
  preferredLanguage: 'Telugu & English',
  irrigationType: 'Drip Irrigation & Borewell',
  joinedDate: ''
};

const ProfileSettings = () => {
  const [profile, setProfile] = useState(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialProfileState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await farmerService.getProfile();
      if (data) {
        setProfile(data);
        setFormData(data);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to load farmer profile.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const nameErr = validateRequired(formData.name, 'Farmer Name');
    if (nameErr) errors.name = nameErr;

    const farmErr = validateRequired(formData.farmName, 'Farm Estate Name');
    if (farmErr) errors.farmName = farmErr;

    const areaErr = validatePositiveNumber(formData.totalArea, 'Total Farm Area');
    if (areaErr) errors.totalArea = areaErr;

    const locErr = validateRequired(formData.location, 'Farm Location / District');
    if (locErr) errors.location = locErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errors.phone = phoneErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) errors.email = emailErr;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const updated = await farmerService.updateProfile(profile.id || '1', formData);
      setProfile(updated || formData);
      setIsEditing(false);
      setAlert({ type: 'success', message: 'Farmer profile and settings updated successfully in backend!' });
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to save profile changes.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setFormErrors({});
    setIsEditing(false);
  };

  if (loading && !profile.name) {
    return <Loader text="Loading farmer profile..." />;
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
          <h2 className="fw-bold font-heading mb-1 text-dark">Farmer Profile & Farm Settings</h2>
          <p className="text-muted small mb-0">
            Manage your personal contact details, land holding size, soil classification, and system preferences.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            className="btn btn-farm btn-sm px-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            <i className="bi bi-pencil-square"></i>
            Edit Profile
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-light btn-sm px-3 rounded-pill"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-farm btn-sm px-4 rounded-pill d-inline-flex align-items-center gap-1 shadow-sm"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting && <span className="spinner-border spinner-border-sm me-1" role="status"></span>}
              <i className="bi bi-check2"></i>
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Left Column: Avatar & Quick Info */}
        <div className="col-12 col-lg-4">
          <div className="farm-card p-4 bg-white text-center mb-4">
            <div
              className="rounded-circle mx-auto mb-3 text-white fw-bold d-flex align-items-center justify-content-center shadow"
              style={{
                width: '90px',
                height: '90px',
                fontSize: '2.2rem',
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
              }}
            >
              MK
            </div>

            <h4 className="fw-bold font-heading text-dark mb-1">{profile.name}</h4>
            <div className="text-success small fw-semibold mb-2">{profile.farmName}</div>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 small rounded-pill">
              Registered Farmer Member
            </span>

            <hr className="my-4" />

            <div className="text-start d-flex flex-column gap-3 small">
              <div className="d-flex align-items-center gap-2 text-secondary">
                <i className="bi bi-geo-alt-fill text-success fs-5"></i>
                <span>{profile.location}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-secondary">
                <i className="bi bi-telephone-fill text-success fs-5"></i>
                <span>+91 {profile.phone}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-secondary">
                <i className="bi bi-envelope-fill text-success fs-5"></i>
                <span>{profile.email}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-secondary">
                <i className="bi bi-calendar-check-fill text-success fs-5"></i>
                <span>Member since: {formatDate(profile.joinedDate)}</span>
              </div>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="farm-card p-4 bg-white">
            <h6 className="fw-bold text-dark mb-3 font-heading">Farm Characteristics</h6>
            <div className="p-3 rounded-3 bg-light border mb-2">
              <span className="text-muted small d-block">Land Size</span>
              <strong className="text-dark fs-5">{profile.totalArea} Acres</strong>
            </div>
            <div className="p-3 rounded-3 bg-light border mb-2">
              <span className="text-muted small d-block">Soil Classification</span>
              <strong className="text-dark">{profile.soilType}</strong>
            </div>
            <div className="p-3 rounded-3 bg-light border">
              <span className="text-muted small d-block">Irrigation Infrastructure</span>
              <strong className="text-dark">{profile.irrigationType}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Form / Details View */}
        <div className="col-12 col-lg-8">
          <div className="farm-card p-4 bg-white">
            <h5 className="fw-bold text-dark mb-4 font-heading border-bottom pb-3">
              {isEditing ? 'Edit Profile & Agricultural Details' : 'Farmer & Land Particulars'}
            </h5>

            <form onSubmit={handleSave} noValidate>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Farmer Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    disabled={!isEditing}
                    className={`form-control form-control-sm ${formErrors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Farm Estate / Land Holding Name *</label>
                  <input
                    type="text"
                    name="farmName"
                    disabled={!isEditing}
                    className={`form-control form-control-sm ${formErrors.farmName ? 'is-invalid' : ''}`}
                    value={formData.farmName}
                    onChange={handleInputChange}
                  />
                  {formErrors.farmName && <div className="invalid-feedback">{formErrors.farmName}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Mobile Number *</label>
                  <input
                    type="text"
                    maxLength="10"
                    name="phone"
                    disabled={!isEditing}
                    className={`form-control form-control-sm ${formErrors.phone ? 'is-invalid' : ''}`}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    disabled={!isEditing}
                    className={`form-control form-control-sm ${formErrors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Location / District, State *</label>
                  <input
                    type="text"
                    name="location"
                    disabled={!isEditing}
                    className={`form-control form-control-sm ${formErrors.location ? 'is-invalid' : ''}`}
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  {formErrors.location && <div className="invalid-feedback">{formErrors.location}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Total Land Holding Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    name="totalArea"
                    disabled={!isEditing}
                    className={`form-control form-control-sm ${formErrors.totalArea ? 'is-invalid' : ''}`}
                    value={formData.totalArea}
                    onChange={handleInputChange}
                  />
                  {formErrors.totalArea && <div className="invalid-feedback">{formErrors.totalArea}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Dominant Soil Types</label>
                  <input
                    type="text"
                    name="soilType"
                    disabled={!isEditing}
                    className="form-control form-control-sm"
                    value={formData.soilType}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Irrigation Infrastructure</label>
                  <input
                    type="text"
                    name="irrigationType"
                    disabled={!isEditing}
                    className="form-control form-control-sm"
                    value={formData.irrigationType}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Preferred Language</label>
                  <select
                    name="preferredLanguage"
                    disabled={!isEditing}
                    className="form-select form-select-sm"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                  >
                    <option value="Telugu & English">Telugu & English (తెలుగు & English)</option>
                    <option value="Telugu Only">Telugu Only (తెలుగు)</option>
                    <option value="English Only">English Only</option>
                    <option value="Hindi & English">Hindi & English (हिन्दी & English)</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Registration / Enrollment Date</label>
                  <input
                    type="date"
                    name="joinedDate"
                    disabled
                    className="form-control form-control-sm bg-light"
                    value={formData.joinedDate}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
