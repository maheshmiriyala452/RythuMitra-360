import React, { useState, useEffect, useMemo } from 'react';
import { salesService } from '../services/salesService';
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
import { validateRequired, validatePositiveNumber, validatePhone } from '../utils/validators';
import { MEASUREMENT_UNITS } from '../utils/constants';

const initialFormState = {
  cropId: '',
  cropName: '',
  quantitySold: '',
  unit: 'Quintal',
  unitPrice: '',
  buyerName: '',
  buyerPhone: '',
  saleDate: '',
  paymentStatus: 'Paid',
  notes: ''
};

const PAYMENT_STATUSES = ['Paid', 'Advance Received', 'Pending Payment'];

const SalesRevenue = () => {
  const [sales, setSales] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
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

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null, isDeleting: false });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesList, cropList] = await Promise.all([
        salesService.getAll(),
        cropService.getAll()
      ]);
      setSales(Array.isArray(salesList) ? salesList : []);
      setCrops(Array.isArray(cropList) ? cropList : []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to load sales data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Sales
  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      const matchesSearch =
        item.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPayment = paymentFilter === 'ALL' || item.paymentStatus === paymentFilter;
      const matchesCrop = cropFilter === 'ALL' || item.cropId === cropFilter;
      return matchesSearch && matchesPayment && matchesCrop;
    });
  }, [sales, searchTerm, paymentFilter, cropFilter]);

  // Paginated Sales
  const paginatedSales = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSales.slice(startIndex, startIndex + pageSize);
  }, [filteredSales, currentPage]);

  // Total Revenue Aggregation
  const totalRevenueSum = useMemo(() => {
    return filteredSales.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
  }, [filteredSales]);

  // Auto-calculated preview amount in form
  const computedTotal = useMemo(() => {
    const q = Number(formData.quantitySold) || 0;
    const p = Number(formData.unitPrice) || 0;
    return q * p;
  }, [formData.quantitySold, formData.unitPrice]);

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
    const cropErr = validateRequired(formData.cropName, 'Harvested Crop');
    if (cropErr) errors.cropId = 'Please select a crop for this sale.';

    const qtyErr = validatePositiveNumber(formData.quantitySold, 'Quantity Sold');
    if (qtyErr) errors.quantitySold = qtyErr;

    const priceErr = validatePositiveNumber(formData.unitPrice, 'Unit Price');
    if (priceErr) errors.unitPrice = priceErr;

    const buyerErr = validateRequired(formData.buyerName, 'Buyer / Mandi Trader Name');
    if (buyerErr) errors.buyerName = buyerErr;

    const phoneErr = validatePhone(formData.buyerPhone);
    if (phoneErr) errors.buyerPhone = phoneErr;

    const dateErr = validateRequired(formData.saleDate, 'Sale Date');
    if (dateErr) errors.saleDate = dateErr;

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
      saleDate: new Date().toISOString().split('T')[0]
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
      quantitySold: item.quantitySold || '',
      unit: item.unit || 'Quintal',
      unitPrice: item.unitPrice || '',
      buyerName: item.buyerName || '',
      buyerPhone: item.buyerPhone || '',
      saleDate: item.saleDate || '',
      paymentStatus: item.paymentStatus || 'Paid',
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
        await salesService.update(currentId, formData);
        setAlert({ type: 'success', message: 'Produce sale record updated successfully!' });
      } else {
        await salesService.create(formData);
        setAlert({ type: 'success', message: 'New harvest sale registered!' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Operation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handlers
  const handleOpenDelete = (item) => {
    setDeleteDialog({ isOpen: true, item, isDeleting: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.item) return;
    try {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
      await salesService.delete(deleteDialog.item.id);
      setAlert({ type: 'success', message: 'Sale record deleted.' });
      setDeleteDialog({ isOpen: false, item: null, isDeleting: false });
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to delete sale.' });
      setDeleteDialog({ isOpen: false, item: null, isDeleting: false });
    }
  };

  if (loading && sales.length === 0) {
    return <Loader text="Loading harvest sales and revenue ledger..." />;
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
          <h2 className="fw-bold font-heading mb-1 text-dark">Harvest Sales & Revenue</h2>
          <p className="text-muted small mb-0">
            Record market transactions, trader receipts, and track gross produce revenue.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-farm btn-sm px-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <i className="bi bi-currency-rupee"></i>
          Record Harvest Sale
        </button>
      </div>

      {/* Financial Summary Card */}
      <div className="farm-card p-3 mb-4 bg-white border-start border-4 border-success">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
          <div>
            <span className="text-muted small fw-semibold text-uppercase tracking-wider">
              Total Filtered Produce Revenue
            </span>
            <div className="display-6 fw-bold text-success font-heading">
              {formatCurrency(totalRevenueSum)}
            </div>
            <small className="text-muted">
              From {filteredSales.length} commercial sales transactions
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 small">
              <i className="bi bi-cash-coin me-1"></i>
              Realized Cash Inflow
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
                placeholder="Search buyer, crop, or receipt..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Payment Status Filter */}
          <div className="col-6 col-md-4">
            <select
              className="form-select form-select-sm"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Payment Statuses</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
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

      {/* Sales Table */}
      {filteredSales.length === 0 ? (
        <EmptyState
          icon="bi-currency-rupee"
          title="No produce sales records found"
          description="You haven't recorded any crop sales yet. Add your produce sales to track farm monetization."
          actionText="Record Sale"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="farm-card bg-white mb-4">
          <div className="table-responsive">
            <table className="farm-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Crop</th>
                  <th>Quantity & Rate</th>
                  <th>Buyer Details</th>
                  <th>Status</th>
                  <th className="text-end">Total Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((item) => (
                  <tr key={item.id}>
                    <td className="small text-muted text-nowrap">
                      <i className="bi bi-calendar3 me-1"></i>
                      {formatDate(item.saleDate)}
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold">
                        {item.cropName}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">
                        {item.quantitySold} {item.unit}
                      </div>
                      <small className="text-muted">@ {formatCurrency(item.unitPrice)} / {item.unit}</small>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{item.buyerName}</div>
                      {item.buyerPhone && (
                        <small className="text-muted">
                          <i className="bi bi-telephone me-1"></i>
                          {item.buyerPhone}
                        </small>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          item.paymentStatus === 'Paid'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : item.paymentStatus === 'Advance Received'
                            ? 'bg-info-subtle text-info border border-info-subtle'
                            : 'bg-warning-subtle text-warning border border-warning-subtle'
                        } small`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="text-end fw-bold text-success text-nowrap fs-6">
                      {formatCurrency(item.totalAmount)}
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
        totalItems={filteredSales.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Sale Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Produce Sale Record' : 'Record Harvest Produce Sale'}
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
              {isEditing ? 'Save Changes' : 'Record Sale'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Harvested Crop *</label>
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

            <div className="col-12 col-md-3">
              <label className="form-label small fw-bold">Quantity Sold *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                name="quantitySold"
                className={`form-control form-control-sm ${formErrors.quantitySold ? 'is-invalid' : ''}`}
                placeholder="e.g. 25"
                value={formData.quantitySold}
                onChange={handleInputChange}
              />
              {formErrors.quantitySold && (
                <div className="invalid-feedback">{formErrors.quantitySold}</div>
              )}
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-bold">Unit</label>
              <select
                name="unit"
                className="form-select form-select-sm"
                value={formData.unit}
                onChange={handleInputChange}
              >
                {MEASUREMENT_UNITS.slice(0, 4).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Unit Price (₹ per unit) *</label>
              <input
                type="number"
                step="1"
                min="1"
                name="unitPrice"
                className={`form-control form-control-sm ${formErrors.unitPrice ? 'is-invalid' : ''}`}
                placeholder="e.g. 7500"
                value={formData.unitPrice}
                onChange={handleInputChange}
              />
              {formErrors.unitPrice && <div className="invalid-feedback">{formErrors.unitPrice}</div>}
            </div>

            {/* Live Auto-Calculated Total Badge */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Calculated Gross Revenue</label>
              <div className="p-2 border rounded bg-light text-success fw-bold fs-6">
                {formatCurrency(computedTotal)}
                <small className="text-muted fw-normal ms-2">
                  ({formData.quantitySold || 0} {formData.unit} &times; ₹{formData.unitPrice || 0})
                </small>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Buyer / Mandi Trader *</label>
              <input
                type="text"
                name="buyerName"
                className={`form-control form-control-sm ${formErrors.buyerName ? 'is-invalid' : ''}`}
                placeholder="e.g. Sri Krishna Agro Traders, Guntur"
                value={formData.buyerName}
                onChange={handleInputChange}
              />
              {formErrors.buyerName && <div className="invalid-feedback">{formErrors.buyerName}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Buyer Contact Phone</label>
              <input
                type="text"
                maxLength="10"
                name="buyerPhone"
                className={`form-control form-control-sm ${formErrors.buyerPhone ? 'is-invalid' : ''}`}
                placeholder="10-digit mobile number"
                value={formData.buyerPhone}
                onChange={handleInputChange}
              />
              {formErrors.buyerPhone && <div className="invalid-feedback">{formErrors.buyerPhone}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Sale Date *</label>
              <input
                type="date"
                name="saleDate"
                className={`form-control form-control-sm ${formErrors.saleDate ? 'is-invalid' : ''}`}
                value={formData.saleDate}
                onChange={handleInputChange}
              />
              {formErrors.saleDate && <div className="invalid-feedback">{formErrors.saleDate}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Payment Status</label>
              <select
                name="paymentStatus"
                className="form-select form-select-sm"
                value={formData.paymentStatus}
                onChange={handleInputChange}
              >
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Sale Notes & Mandi Receipts</label>
              <textarea
                name="notes"
                rows="2"
                className="form-control form-control-sm"
                placeholder="e.g. Sold via electronic weighing bridge at Guntur Yard with moisture bonus."
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
        title="Delete Produce Sale"
        message={`Are you sure you want to delete this sale record for ${deleteDialog.item?.cropName} (${formatCurrency(deleteDialog.item?.totalAmount)}) to ${deleteDialog.item?.buyerName}?`}
        confirmText="Delete Sale"
        confirmVariant="danger"
        isLoading={deleteDialog.isDeleting}
      />
    </div>
  );
};

export default SalesRevenue;
