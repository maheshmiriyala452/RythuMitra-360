import React, { useState, useEffect, useMemo } from 'react';
import { inventoryService } from '../services/inventoryService';

// Common Components
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AlertMessage from '../components/common/AlertMessage';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

// Helpers & Constants
import { formatCurrency, formatDate } from '../utils/formatters';
import { validateRequired, validateNonNegativeNumber } from '../utils/validators';
import { INVENTORY_CATEGORIES, MEASUREMENT_UNITS } from '../utils/constants';

const initialFormState = {
  itemName: '',
  category: 'Fertilizers',
  quantity: '',
  unit: 'Bag (50kg)',
  reorderLevel: '',
  unitCost: '',
  supplierName: '',
  lastUpdated: ''
};

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL'); // 'ALL' | 'LOW_STOCK'

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

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to load inventory.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplierName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      const isLow = Number(item.quantity) <= Number(item.reorderLevel);
      const matchesStock =
        stockStatusFilter === 'ALL' || (stockStatusFilter === 'LOW_STOCK' && isLow);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [inventory, searchTerm, categoryFilter, stockStatusFilter]);

  // Paginated Inventory
  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredInventory.slice(startIndex, startIndex + pageSize);
  }, [filteredInventory, currentPage]);

  // Low stock counter
  const lowStockCount = useMemo(() => {
    return inventory.filter((i) => Number(i.quantity) <= Number(i.reorderLevel)).length;
  }, [inventory]);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const nameErr = validateRequired(formData.itemName, 'Item Name');
    if (nameErr) errors.itemName = nameErr;

    const qtyErr = validateNonNegativeNumber(formData.quantity, 'Current Stock Quantity');
    if (qtyErr) errors.quantity = qtyErr;

    const reorderErr = validateNonNegativeNumber(formData.reorderLevel, 'Reorder Threshold Level');
    if (reorderErr) errors.reorderLevel = reorderErr;

    const costErr = validateNonNegativeNumber(formData.unitCost, 'Unit Purchase Cost');
    if (costErr) errors.unitCost = costErr;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      ...initialFormState,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({
      itemName: item.itemName || '',
      category: item.category || 'Fertilizers',
      quantity: item.quantity || '',
      unit: item.unit || 'Bag (50kg)',
      reorderLevel: item.reorderLevel || '',
      unitCost: item.unitCost || '',
      supplierName: item.supplierName || '',
      lastUpdated: item.lastUpdated || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      if (isEditing) {
        await inventoryService.update(currentId, payload);
        setAlert({ type: 'success', message: 'Inventory item updated successfully!' });
      } else {
        await inventoryService.create(payload);
        setAlert({ type: 'success', message: 'New farm supply item cataloged!' });
      }
      setIsModalOpen(false);
      fetchInventory();
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
      await inventoryService.delete(deleteDialog.item.id);
      setAlert({ type: 'success', message: 'Item deleted from inventory.' });
      setDeleteDialog({ isOpen: false, item: null, isDeleting: false });
      fetchInventory();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Failed to delete item.' });
      setDeleteDialog({ isOpen: false, item: null, isDeleting: false });
    }
  };

  if (loading && inventory.length === 0) {
    return <Loader text="Loading farm inventory and warehouse stocks..." />;
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
          <h2 className="fw-bold font-heading mb-1 text-dark">Farm Inventory & Supplies</h2>
          <p className="text-muted small mb-0">
            Track fertilizers, seeds, spray chemicals, and tools with real-time low-stock safety alerts.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-farm btn-sm px-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <i className="bi bi-plus-circle"></i>
          Add Farm Supply
        </button>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="alert alert-warning border-warning-subtle d-flex align-items-center justify-content-between mb-4 p-3 rounded-3 shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
            <div>
              <strong className="text-dark">Safety Stock Threshold Warning:</strong>{' '}
              <span className="small text-secondary">
                {lowStockCount} items have reached or fallen below their reorder safety levels.
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-warning btn-sm text-dark fw-semibold"
            onClick={() => setStockStatusFilter('LOW_STOCK')}
          >
            Show Low Stock Items
          </button>
        </div>
      )}

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
                placeholder="Search item or supplier name..."
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
              <option value="ALL">All Supply Categories</option>
              {INVENTORY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div className="col-6 col-md-4">
            <select
              className="form-select form-select-sm"
              value={stockStatusFilter}
              onChange={(e) => {
                setStockStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Stock Levels</option>
              <option value="LOW_STOCK">Low Stock Only (&le; Reorder Level)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <EmptyState
          icon="bi-box-seam"
          title="No inventory supplies found"
          description="There are no farm supplies matching your filter selection. Add seeds, fertilizers, or tools to keep track of stock."
          actionText="Add Supply Item"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="farm-card bg-white mb-4">
          <div className="table-responsive">
            <table className="farm-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Stock Available</th>
                  <th>Reorder Level</th>
                  <th>Unit Cost</th>
                  <th>Supplier Details</th>
                  <th>Stock Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.map((item) => {
                  const isLow = Number(item.quantity) <= Number(item.reorderLevel);

                  return (
                    <tr key={item.id} className={isLow ? 'bg-warning-subtle' : ''}>
                      <td>
                        <div className="fw-bold text-dark">{item.itemName}</div>
                        <small className="text-muted">Updated: {formatDate(item.lastUpdated)}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <span className={`fw-bold fs-6 ${isLow ? 'text-danger' : 'text-dark'}`}>
                          {item.quantity}
                        </span>{' '}
                        <small className="text-muted">{item.unit}</small>
                      </td>
                      <td className="small text-muted">{item.reorderLevel} {item.unit}</td>
                      <td className="small text-muted">{formatCurrency(item.unitCost)}</td>
                      <td>
                        <div className="small text-dark fw-medium">
                          {item.supplierName || 'Local Cooperative'}
                        </div>
                      </td>
                      <td>
                        {isLow ? (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            Low Stock
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
                            <i className="bi bi-check-circle-fill"></i>
                            Adequate
                          </span>
                        )}
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
        totalItems={filteredInventory.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Inventory Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Update Farm Supply Item' : 'Add New Supply Item'}
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
              {isEditing ? 'Save Changes' : 'Catalog Item'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Item Name *</label>
              <input
                type="text"
                name="itemName"
                className={`form-control form-control-sm ${formErrors.itemName ? 'is-invalid' : ''}`}
                placeholder="e.g. Urea 46% N, Knapsack Battery Sprayer"
                value={formData.itemName}
                onChange={handleInputChange}
              />
              {formErrors.itemName && <div className="invalid-feedback">{formErrors.itemName}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Category</label>
              <select
                name="category"
                className="form-select form-select-sm"
                value={formData.category}
                onChange={handleInputChange}
              >
                {INVENTORY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Stock Quantity *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="quantity"
                className={`form-control form-control-sm ${formErrors.quantity ? 'is-invalid' : ''}`}
                placeholder="e.g. 10"
                value={formData.quantity}
                onChange={handleInputChange}
              />
              {formErrors.quantity && <div className="invalid-feedback">{formErrors.quantity}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Unit</label>
              <select
                name="unit"
                className="form-select form-select-sm"
                value={formData.unit}
                onChange={handleInputChange}
              >
                {MEASUREMENT_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold">Reorder Alert Level *</label>
              <input
                type="number"
                step="1"
                min="0"
                name="reorderLevel"
                className={`form-control form-control-sm ${formErrors.reorderLevel ? 'is-invalid' : ''}`}
                placeholder="e.g. 5"
                value={formData.reorderLevel}
                onChange={handleInputChange}
              />
              {formErrors.reorderLevel && (
                <div className="invalid-feedback">{formErrors.reorderLevel}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Unit Purchase Cost (₹)</label>
              <input
                type="number"
                step="1"
                min="0"
                name="unitCost"
                className={`form-control form-control-sm ${formErrors.unitCost ? 'is-invalid' : ''}`}
                placeholder="e.g. 268"
                value={formData.unitCost}
                onChange={handleInputChange}
              />
              {formErrors.unitCost && <div className="invalid-feedback">{formErrors.unitCost}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold">Supplier / Dealer Name</label>
              <input
                type="text"
                name="supplierName"
                className="form-control form-control-sm"
                placeholder="e.g. Kisan Seva Kendra, Tenali"
                value={formData.supplierName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, item: null, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Remove Supply Item"
        message={`Are you sure you want to remove "${deleteDialog.item?.itemName}" from your farm inventory records?`}
        confirmText="Remove Item"
        confirmVariant="danger"
        isLoading={deleteDialog.isDeleting}
      />
    </div>
  );
};

export default InventoryManagement;
