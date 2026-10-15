import React, { useState, useEffect, useMemo } from 'react';
import { cropService } from '../services/cropService';

// Common Components
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AlertMessage from '../components/common/AlertMessage';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

// Helpers & Constants
import { formatDate, getDaysRemaining } from '../utils/formatters';
import { validateRequired, validatePositiveNumber } from '../utils/validators';
import { CROP_SEASONS, CROP_STATUS } from '../utils/constants';

const initialFormState = {
  name: '',
  variety: '',
  season: 'Kharif (Monsoon)',
  areaAcres: '',
  plantingDate: '',
  expectedHarvestDate: '',
  status: CROP_STATUS.GROWING,
  notes: ''
};

const CropManagement = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [seasonFilter, setSeasonFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCropId, setCurrentCropId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, crop: null, isDeleting: false });

  // Fetch Crops
  const fetchCrops = async () => {
    try {
      setLoading(true);
      const data = await cropService.getAll();
      setCrops(Array.isArray(data) ? data : []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to load crops.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Filtered & Searched crops
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch =
        crop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || crop.status === statusFilter;
      const matchesSeason = seasonFilter === 'ALL' || crop.season === seasonFilter;
      return matchesSearch && matchesStatus && matchesSeason;
    });
  }, [crops, searchTerm, statusFilter, seasonFilter]);

  // Paginated crops
  const paginatedCrops = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCrops.slice(startIndex, startIndex + pageSize);
  }, [filteredCrops, currentPage]);

  // Form Handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const nameErr = validateRequired(formData.name, 'Crop Name');
    if (nameErr) errors.name = nameErr;

    const varietyErr = validateRequired(formData.variety, 'Crop Variety');
    if (varietyErr) errors.variety = varietyErr;

    const areaErr = validatePositiveNumber(formData.areaAcres, 'Area in Acres');
    if (areaErr) errors.areaAcres = areaErr;

    const plantDateErr = validateRequired(formData.plantingDate, 'Planting Date');
    if (plantDateErr) errors.plantingDate = plantDateErr;

    const harvestDateErr = validateRequired(formData.expectedHarvestDate, 'Expected Harvest Date');
    if (harvestDateErr) errors.expectedHarvestDate = harvestDateErr;

    if (formData.plantingDate && formData.expectedHarvestDate) {
      if (new Date(formData.expectedHarvestDate) <= new Date(formData.plantingDate)) {
        errors.expectedHarvestDate = 'Harvest date must be after planting date.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentCropId(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (crop) => {
    setIsEditing(true);
    setCurrentCropId(crop.id);
    setFormData({
      name: crop.name || '',
      variety: crop.variety || '',
      season: crop.season || 'Kharif (Monsoon)',
      areaAcres: crop.areaAcres || '',
      plantingDate: crop.plantingDate || '',
      expectedHarvestDate: crop.expectedHarvestDate || '',
      status: crop.status || CROP_STATUS.GROWING,
      notes: crop.notes || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      if (isEditing) {
        await cropService.update(currentCropId, formData);
        setAlert({ type: 'success', message: `Crop "${formData.name}" updated successfully!` });
      } else {
        await cropService.create(formData);
        setAlert({ type: 'success', message: `New crop "${formData.name}" added successfully!` });
      }
      setIsModalOpen(false);
      fetchCrops();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Operation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handling
  const handleOpenDelete = (crop) => {
    setDeleteDialog({ isOpen: true, crop, isDeleting: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.crop) return;
    try {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
      await cropService.delete(deleteDialog.crop.id);
      setAlert({ type: 'success', message: `Crop "${deleteDialog.crop.name}" deleted successfully.` });
      setDeleteDialog({ isOpen: false, crop: null, isDeleting: false });
      fetchCrops();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to delete crop.' });
      setDeleteDialog({ isOpen: false, crop: null, isDeleting: false });
    }
  };

  if (loading && crops.length === 0) {
    return <Loader text="Loading registered crops from backend..." />;
  }

  return (
    <div className="container-fluid px-0">
      {/* Notifications */}
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header & Controls */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold font-heading mb-1 text-dark">Crop Management</h2>
          <p className="text-muted small mb-0">
            Monitor crop acreage, varietal performance, and harvest timelines across seasons.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-farm btn-sm px-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <i className="bi bi-plus-circle-fill"></i>
          Register New Crop
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="farm-card p-3 mb-4 bg-white">
        <div className="row g-2 align-items-center">
          {/* Search */}
          <div className="col-12 col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by crop or variety name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value={CROP_STATUS.GROWING}>Growing</option>
              <option value={CROP_STATUS.HARVESTED}>Harvested</option>
              <option value={CROP_STATUS.PLANNED}>Planned</option>
            </select>
          </div>

          {/* Season Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={seasonFilter}
              onChange={(e) => {
                setSeasonFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Seasons</option>
              {CROP_SEASONS.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="col-12 col-md-2 text-md-end">
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn ${viewMode === 'cards' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('cards')}
                title="Card Grid View"
              >
                <i className="bi bi-grid-fill"></i>
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'table' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <i className="bi bi-list-ul"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredCrops.length === 0 ? (
        <EmptyState
          icon="bi-flower1"
          title="No crops match your filters"
          description="Try adjusting your search criteria or register a new crop to get started."
          actionText="Register Crop"
          onAction={handleOpenAddModal}
        />
      ) : viewMode === 'cards' ? (
        /* Card Grid View */
        <div className="row g-3 mb-4">
          {paginatedCrops.map((crop) => {
            const daysLeft = getDaysRemaining(crop.expectedHarvestDate);
            return (
              <div key={crop.id} className="col-12 col-md-6 col-xl-4">
                <div className="farm-card p-4 h-100 bg-white d-flex flex-column justify-content-between">
                  <div>
                    {/* Header */}
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <div>
                        <span className="badge bg-light text-secondary border small mb-1">
                          {crop.season}
                        </span>
                        <h5 className="fw-bold text-dark font-heading mb-0">{crop.name}</h5>
                        <small className="text-success fw-semibold">{crop.variety}</small>
                      </div>

                      <span
                        className={`badge-status ${
                          crop.status === CROP_STATUS.GROWING
                            ? 'badge-growing'
                            : crop.status === CROP_STATUS.HARVESTED
                            ? 'badge-harvested'
                            : 'badge-planned'
                        }`}
                      >
                        <i
                          className={`bi ${
                            crop.status === CROP_STATUS.GROWING
                              ? 'bi-activity'
                              : crop.status === CROP_STATUS.HARVESTED
                              ? 'bi-check2-all'
                              : 'bi-calendar-event'
                          }`}
                        ></i>
                        {crop.status}
                      </span>
                    </div>

                    {/* Metric Pills */}
                    <div className="row g-2 my-3">
                      <div className="col-6">
                        <div className="p-2 rounded bg-light border text-center">
                          <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                            Cultivated Area
                          </small>
                          <span className="fw-bold text-dark">{crop.areaAcres} Acres</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2 rounded bg-light border text-center">
                          <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                            Harvest Timeline
                          </small>
                          <span
                            className={`fw-bold ${
                              daysLeft !== null && daysLeft <= 15 ? 'text-warning' : 'text-dark'
                            }`}
                          >
                            {daysLeft !== null && daysLeft > 0
                              ? `In ${daysLeft} Days`
                              : daysLeft === 0
                              ? 'Today'
                              : 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dates & Notes */}
                    <div className="small text-secondary mb-3">
                      <div className="d-flex justify-content-between py-1 border-bottom">
                        <span className="text-muted">Planting Date:</span>
                        <span className="fw-semibold text-dark">{formatDate(crop.plantingDate)}</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom">
                        <span className="text-muted">Est. Harvest:</span>
                        <span className="fw-semibold text-dark">
                          {formatDate(crop.expectedHarvestDate)}
                        </span>
                      </div>
                      {crop.notes && (
                        <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
                          <i className="bi bi-info-circle me-1"></i>
                          {crop.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-auto">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm px-3 rounded-pill"
                      onClick={() => handleOpenEditModal(crop)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm px-2 rounded-pill"
                      onClick={() => handleOpenDelete(crop)}
                      title="Delete Crop"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="farm-card bg-white mb-4">
          <div className="table-responsive">
            <table className="farm-table">
              <thead>
                <tr>
                  <th>Crop & Variety</th>
                  <th>Season</th>
                  <th>Area</th>
                  <th>Planting Date</th>
                  <th>Expected Harvest</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCrops.map((crop) => (
                  <tr key={crop.id}>
                    <td>
                      <div className="fw-bold text-dark">{crop.name}</div>
                      <small className="text-success">{crop.variety}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">
                        {crop.season}
                      </span>
                    </td>
                    <td className="fw-semibold text-dark">{crop.areaAcres} Acres</td>
                    <td className="small text-muted">{formatDate(crop.plantingDate)}</td>
                    <td className="small text-muted">{formatDate(crop.expectedHarvestDate)}</td>
                    <td>
                      <span
                        className={`badge-status ${
                          crop.status === CROP_STATUS.GROWING
                            ? 'badge-growing'
                            : crop.status === CROP_STATUS.HARVESTED
                            ? 'badge-harvested'
                            : 'badge-planned'
                        }`}
                      >
                        {crop.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-light border"
                          onClick={() => handleOpenEditModal(crop)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil text-secondary"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-light border text-danger"
                          onClick={() => handleOpenDelete(crop)}
                          title="Delete"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredCrops.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Crop Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Crop Details' : 'Register New Crop'}
        size="lg"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button
              type="button"
              className="btn btn-light btn-sm px-3"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-farm btn-sm px-4 d-flex align-items-center gap-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && <span className="spinner-border spinner-border-sm me-1" role="status"></span>}
              <i className="bi bi-check2-circle"></i>
              {isEditing ? 'Save Changes' : 'Register Crop'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Crop Name *</label>
              <input
                type="text"
                name="name"
                className={`form-control form-control-sm ${formErrors.name ? 'is-invalid' : ''}`}
                placeholder="e.g. Paddy (Rice), Guntur Red Chilli"
                value={formData.name}
                onChange={handleInputChange}
              />
              {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Variety / Hybrid *</label>
              <input
                type="text"
                name="variety"
                className={`form-control form-control-sm ${formErrors.variety ? 'is-invalid' : ''}`}
                placeholder="e.g. BPT 5204, Teja 441"
                value={formData.variety}
                onChange={handleInputChange}
              />
              {formErrors.variety && <div className="invalid-feedback">{formErrors.variety}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Season</label>
              <select
                name="season"
                className="form-select form-select-sm"
                value={formData.season}
                onChange={handleInputChange}
              >
                {CROP_SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Area (Acres) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                name="areaAcres"
                className={`form-control form-control-sm ${formErrors.areaAcres ? 'is-invalid' : ''}`}
                placeholder="e.g. 3.5"
                value={formData.areaAcres}
                onChange={handleInputChange}
              />
              {formErrors.areaAcres && <div className="invalid-feedback">{formErrors.areaAcres}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Current Status</label>
              <select
                name="status"
                className="form-select form-select-sm"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value={CROP_STATUS.GROWING}>Growing</option>
                <option value={CROP_STATUS.HARVESTED}>Harvested</option>
                <option value={CROP_STATUS.PLANNED}>Planned</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Planting Date *</label>
              <input
                type="date"
                name="plantingDate"
                className={`form-control form-control-sm ${formErrors.plantingDate ? 'is-invalid' : ''}`}
                value={formData.plantingDate}
                onChange={handleInputChange}
              />
              {formErrors.plantingDate && <div className="invalid-feedback">{formErrors.plantingDate}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Expected Harvest Date *</label>
              <input
                type="date"
                name="expectedHarvestDate"
                className={`form-control form-control-sm ${formErrors.expectedHarvestDate ? 'is-invalid' : ''}`}
                value={formData.expectedHarvestDate}
                onChange={handleInputChange}
              />
              {formErrors.expectedHarvestDate && (
                <div className="invalid-feedback">{formErrors.expectedHarvestDate}</div>
              )}
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Farming Notes & Observations</label>
              <textarea
                name="notes"
                rows="2"
                className="form-control form-control-sm"
                placeholder="e.g. Drip fertigation scheduled weekly, organic neem oil applied."
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, crop: null, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Crop Record"
        message={`Are you sure you want to delete crop "${deleteDialog.crop?.name}" (${deleteDialog.crop?.variety})? All associated records will remain, but this crop entry will be removed.`}
        confirmText="Yes, Delete"
        confirmVariant="danger"
        isLoading={deleteDialog.isDeleting}
      />
    </div>
  );
};

export default CropManagement;
