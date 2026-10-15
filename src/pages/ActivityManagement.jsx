import React, { useState, useEffect, useMemo } from 'react';
import { activityService } from '../services/activityService';
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
import { validateRequired } from '../utils/validators';
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_STATUS,
  TASK_PRIORITY
} from '../utils/constants';

const initialFormState = {
  cropId: '',
  cropName: '',
  title: '',
  category: 'Irrigation',
  dueDate: '',
  status: ACTIVITY_STATUS.PENDING,
  priority: TASK_PRIORITY.MEDIUM,
  notes: ''
};

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null, isDeleting: false });

  // Fetch Activities and Crops
  const fetchData = async () => {
    try {
      setLoading(true);
      const [acts, crps] = await Promise.all([
        activityService.getAll(),
        cropService.getAll()
      ]);
      setActivities(Array.isArray(acts) ? acts : []);
      setCrops(Array.isArray(crps) ? crps : []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to fetch tasks.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch =
        act.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.cropName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || act.status === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || act.category === categoryFilter;
      const matchesPriority = priorityFilter === 'ALL' || act.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [activities, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  // Paginated Activities
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredActivities.slice(startIndex, startIndex + pageSize);
  }, [filteredActivities, currentPage]);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cropId') {
      const selectedCrop = crops.find((c) => String(c.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        cropId: value,
        cropName: selectedCrop ? selectedCrop.name : ''
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const titleErr = validateRequired(formData.title, 'Task Title');
    if (titleErr) errors.title = titleErr;

    const cropErr = validateRequired(formData.cropName, 'Target Crop');
    if (cropErr) errors.cropId = 'Please select a crop for this activity.';

    const dateErr = validateRequired(formData.dueDate, 'Due Date');
    if (dateErr) errors.dueDate = dateErr;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      ...initialFormState,
      cropId: crops[0]?.id || '',
      cropName: crops[0]?.name || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (act) => {
    setIsEditing(true);
    setCurrentId(act.id);
    setFormData({
      cropId: act.cropId || '',
      cropName: act.cropName || '',
      title: act.title || '',
      category: act.category || 'Irrigation',
      dueDate: act.dueDate || '',
      status: act.status || ACTIVITY_STATUS.PENDING,
      priority: act.priority || TASK_PRIORITY.MEDIUM,
      notes: act.notes || ''
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
        await activityService.update(currentId, formData);
        setAlert({ type: 'success', message: 'Activity updated successfully!' });
      } else {
        await activityService.create(formData);
        setAlert({ type: 'success', message: 'New farm activity scheduled!' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Operation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      await activityService.patchStatus(id, nextStatus);
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
      );
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update task status.' });
    }
  };

  // Delete
  const handleOpenDelete = (item) => {
    setDeleteDialog({ isOpen: true, item, isDeleting: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.item) return;
    try {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
      await activityService.delete(deleteDialog.item.id);
      setAlert({ type: 'success', message: 'Farm activity removed.' });
      setDeleteDialog({ isOpen: false, item: null, isDeleting: false });
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to delete activity.' });
      setDeleteDialog({ isOpen: false, item: null, isDeleting: false });
    }
  };

  if (loading && activities.length === 0) {
    return <Loader text="Loading farm calendar activities..." />;
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
          <h2 className="fw-bold font-heading mb-1 text-dark">Farm Activities & Calendar</h2>
          <p className="text-muted small mb-0">
            Schedule, monitor, and execute field operations: irrigation, spraying, fertilization, and weeding.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-farm btn-sm px-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <i className="bi bi-calendar-plus"></i>
          Schedule New Task
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="farm-card p-3 mb-4 bg-white">
        <div className="row g-2 align-items-center">
          {/* Search */}
          <div className="col-12 col-md-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search tasks or crops..."
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
              <option value={ACTIVITY_STATUS.PENDING}>Pending</option>
              <option value={ACTIVITY_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={ACTIVITY_STATUS.COMPLETED}>Completed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Categories</option>
              {ACTIVITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="col-12 col-md-3">
            <select
              className="form-select form-select-sm"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Priorities</option>
              <option value={TASK_PRIORITY.HIGH}>High Priority</option>
              <option value={TASK_PRIORITY.MEDIUM}>Medium Priority</option>
              <option value={TASK_PRIORITY.LOW}>Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon="bi-calendar-check"
          title="No farm activities found"
          description="You have no scheduled activities matching your filters. Add a task to keep your farm on track."
          actionText="Schedule Task"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="farm-card bg-white mb-4">
          <div className="table-responsive">
            <table className="farm-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Done</th>
                  <th>Task Title & Notes</th>
                  <th>Target Crop</th>
                  <th>Category</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedActivities.map((act) => {
                  const daysLeft = getDaysRemaining(act.dueDate);
                  const isDone = act.status === 'Completed';

                  return (
                    <tr key={act.id} className={isDone ? 'opacity-75 bg-light-subtle' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isDone}
                          onChange={() => handleToggleStatus(act.id, act.status)}
                          title="Mark task completed"
                        />
                      </td>
                      <td>
                        <div className={`fw-bold text-dark ${isDone ? 'text-decoration-line-through' : ''}`}>
                          {act.title}
                        </div>
                        {act.notes && (
                          <small className="text-muted d-block" style={{ fontSize: '0.8rem' }}>
                            {act.notes}
                          </small>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          {act.cropName}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">
                          {act.category}
                        </span>
                      </td>
                      <td>
                        <div className="small fw-semibold text-dark">
                          {formatDate(act.dueDate)}
                        </div>
                        {!isDone && daysLeft !== null && (
                          <small
                            className={
                              daysLeft < 0
                                ? 'text-danger fw-bold'
                                : daysLeft <= 2
                                ? 'text-warning fw-bold'
                                : 'text-muted'
                            }
                          >
                            {daysLeft < 0
                              ? `${Math.abs(daysLeft)}d overdue`
                              : daysLeft === 0
                              ? 'Due today'
                              : `${daysLeft}d remaining`}
                          </small>
                        )}
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
                          {act.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-light border"
                            onClick={() => handleOpenEditModal(act)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil text-secondary"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-light border text-danger"
                            onClick={() => handleOpenDelete(act)}
                            title="Delete"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredActivities.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Farming Activity' : 'Schedule New Activity'}
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
              {isEditing ? 'Save Changes' : 'Schedule Task'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-bold">Task Title *</label>
              <input
                type="text"
                name="title"
                className={`form-control form-control-sm ${formErrors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Apply MOP Fertilizer top dressing, Spray Neem oil for thrips"
                value={formData.title}
                onChange={handleInputChange}
              />
              {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Target Crop *</label>
              <select
                name="cropId"
                className={`form-select form-select-sm ${formErrors.cropId ? 'is-invalid' : ''}`}
                value={formData.cropId}
                onChange={handleInputChange}
              >
                <option value="">-- Select Crop --</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.variety})
                  </option>
                ))}
              </select>
              {formErrors.cropId && <div className="invalid-feedback">{formErrors.cropId}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Activity Category</label>
              <select
                name="category"
                className="form-select form-select-sm"
                value={formData.category}
                onChange={handleInputChange}
              >
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Due Date *</label>
              <input
                type="date"
                name="dueDate"
                className={`form-control form-control-sm ${formErrors.dueDate ? 'is-invalid' : ''}`}
                value={formData.dueDate}
                onChange={handleInputChange}
              />
              {formErrors.dueDate && <div className="invalid-feedback">{formErrors.dueDate}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Priority</label>
              <select
                name="priority"
                className="form-select form-select-sm"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value={TASK_PRIORITY.HIGH}>High Priority</option>
                <option value={TASK_PRIORITY.MEDIUM}>Medium Priority</option>
                <option value={TASK_PRIORITY.LOW}>Low Priority</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Current Status</label>
              <select
                name="status"
                className="form-select form-select-sm"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value={ACTIVITY_STATUS.PENDING}>Pending</option>
                <option value={ACTIVITY_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={ACTIVITY_STATUS.COMPLETED}>Completed</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Instructions & Notes</label>
              <textarea
                name="notes"
                rows="2"
                className="form-control form-control-sm"
                placeholder="Dosage details, labor requirements, or equipment instructions..."
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, item: null, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Remove Farm Task"
        message={`Are you sure you want to remove the activity "${deleteDialog.item?.title}"?`}
        confirmText="Remove Task"
        confirmVariant="danger"
        isLoading={deleteDialog.isDeleting}
      />
    </div>
  );
};

export default ActivityManagement;
