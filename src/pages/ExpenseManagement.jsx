import React, { useState, useEffect, useMemo } from 'react';
import { expenseService } from '../services/expenseService';
import { cropService } from '../services/cropService';

// Common Components
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AlertMessage from '../components/common/AlertMessage';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

// Helpers & Constants
import { formatCurrency, formatDate } from '../utils/formatters';
import { validateRequired, validatePositiveNumber } from '../utils/validators';
import { EXPENSE_CATEGORIES } from '../utils/constants';

const initialFormState = {
  cropId: '',
  cropName: '',
  category: 'Fertilizers',
  amount: '',
  date: '',
  paymentMode: 'Cash',
  notes: ''
};

const PAYMENT_MODES = ['Cash', 'UPI / PhonePe', 'UPI / Google Pay', 'Bank Transfer', 'Credit / Kisan Card'];

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [cropFilter, setCropFilter] = useState('ALL');

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

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null, isDeleting: false });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expList, cropList] = await Promise.all([
        expenseService.getAll(),
        cropService.getAll()
      ]);
      setExpenses(Array.isArray(expList) ? expList : []);
      setCrops(Array.isArray(cropList) ? cropList : []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to load expenses.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch =
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesCrop = cropFilter === 'ALL' || item.cropId === cropFilter;
      return matchesSearch && matchesCategory && matchesCrop;
    });
  }, [expenses, searchTerm, categoryFilter, cropFilter]);

  // Paginated Expenses
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredExpenses.slice(startIndex, startIndex + pageSize);
  }, [filteredExpenses, currentPage]);

  // Financial Aggregations
  const totalExpenseSum = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

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
    const amtErr = validatePositiveNumber(formData.amount, 'Expense Amount');
    if (amtErr) errors.amount = amtErr;

    const cropErr = validateRequired(formData.cropName, 'Associated Crop');
    if (cropErr) errors.cropId = 'Please select an associated crop.';

    const dateErr = validateRequired(formData.date, 'Date of Expense');
    if (dateErr) errors.date = dateErr;

    const notesErr = validateRequired(formData.notes, 'Expense Description / Purpose');
    if (notesErr) errors.notes = notesErr;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      ...initialFormState,
      cropId: crops[0]?.id || '',
      cropName: crops[0]?.name || '',
      date: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({
      cropId: item.cropId || '',
      cropName: item.cropName || '',
      category: item.category || 'Fertilizers',
      amount: item.amount || '',
      date: item.date || '',
      paymentMode: item.paymentMode || 'Cash',
      notes: item.notes || ''
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
        await expenseService.update(currentId, formData);
        setAlert({ type: 'success', message: 'Expense record updated successfully!' });
      } else {
        await expenseService.create(formData);
        setAlert({ type: 'success', message: 'New farm expense logged successfully!' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Operation failed.' });
    } finally {
      setIsSubmitting(false);
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
      await expenseService.delete(deleteDialog.item.id);
      setAlert({ type: 'success', message: 'Expense record deleted.' });
      setDeleteDialog({ isOpen: false, item: null, isDeleting: false });
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to delete expense.' });
      setDeleteDialog({ isOpen: false, item: null, isDeleting: false });
    }
  };

  if (loading && expenses.length === 0) {
    return <Loader text="Loading farm expenditure records..." />;
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
          <h2 className="fw-bold font-heading mb-1 text-dark">Farm Expense Tracking</h2>
          <p className="text-muted small mb-0">
            Log and audit all agricultural input expenditures: seeds, fertilizers, labor, diesel, and machinery.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-farm btn-sm px-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <i className="bi bi-cash-stack"></i>
          Log New Expense
        </button>
      </div>

      {/* Financial Summary Top Card */}
      <div className="farm-card p-3 mb-4 bg-white border-start border-4 border-danger">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
          <div>
            <span className="text-muted small fw-semibold text-uppercase tracking-wider">
              Total Filtered Expenditures
            </span>
            <div className="display-6 fw-bold text-danger font-heading">
              {formatCurrency(totalExpenseSum)}
            </div>
            <small className="text-muted">
              Covering {filteredExpenses.length} agricultural transactions
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-secondary border px-3 py-2 small">
              <i className="bi bi-receipt me-1"></i>
              Audited Ground Input Costs
            </span>
          </div>
        </div>
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
                placeholder="Search notes, crop, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-6 col-md-4">
            <select
              className="form-select form-select-sm"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Expense Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div className="col-6 col-md-4">
            <select
              className="form-select form-select-sm"
              value={cropFilter}
              onChange={(e) => {
                setCropFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Crops</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon="bi-cash-stack"
          title="No expense records found"
          description="You haven't recorded any expenses matching your criteria. Start logging expenses to track crop production costs."
          actionText="Log Expense"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="farm-card bg-white mb-4">
          <div className="table-responsive">
            <table className="farm-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description / Details</th>
                  <th>Associated Crop</th>
                  <th>Category</th>
                  <th>Payment Mode</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((item) => (
                  <tr key={item.id}>
                    <td className="small text-muted text-nowrap">
                      <i className="bi bi-calendar3 me-1"></i>
                      {formatDate(item.date)}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{item.notes}</div>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {item.cropName}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">
                        {item.category}
                      </span>
                    </td>
                    <td className="small text-muted">{item.paymentMode || 'Cash'}</td>
                    <td className="text-end fw-bold text-danger text-nowrap">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-light border"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil text-secondary"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-light border text-danger"
                          onClick={() => handleOpenDelete(item)}
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
        totalItems={filteredExpenses.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Expense Record' : 'Log Farm Expense'}
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
              {isEditing ? 'Save Changes' : 'Log Expense'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Associated Crop *</label>
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
              <label className="form-label small fw-bold">Expense Category</label>
              <select
                name="category"
                className="form-select form-select-sm"
                value={formData.category}
                onChange={handleInputChange}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Amount (₹ INR) *</label>
              <input
                type="number"
                step="1"
                min="1"
                name="amount"
                className={`form-control form-control-sm ${formErrors.amount ? 'is-invalid' : ''}`}
                placeholder="e.g. 4500"
                value={formData.amount}
                onChange={handleInputChange}
              />
              {formErrors.amount && <div className="invalid-feedback">{formErrors.amount}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Date of Expense *</label>
              <input
                type="date"
                name="date"
                className={`form-control form-control-sm ${formErrors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                onChange={handleInputChange}
              />
              {formErrors.date && <div className="invalid-feedback">{formErrors.date}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Payment Mode</label>
              <select
                name="paymentMode"
                className="form-select form-select-sm"
                value={formData.paymentMode}
                onChange={handleInputChange}
              >
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Description / Purpose *</label>
              <textarea
                name="notes"
                rows="2"
                className={`form-control form-control-sm ${formErrors.notes ? 'is-invalid' : ''}`}
                placeholder="e.g. 3 bags of DAP 18:46:0 purchased from Kisan Seva Kendra"
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
              {formErrors.notes && <div className="invalid-feedback">{formErrors.notes}</div>}
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, item: null, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Expense Record"
        message={`Are you sure you want to delete this expense of ${formatCurrency(deleteDialog.item?.amount)} (${deleteDialog.item?.notes})?`}
        confirmText="Delete Expense"
        confirmVariant="danger"
        isLoading={deleteDialog.isDeleting}
      />
    </div>
  );
};

export default ExpenseManagement;
