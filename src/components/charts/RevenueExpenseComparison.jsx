import React from 'react';
import { formatCurrency } from '../../utils/formatters';

/**
 * RevenueExpenseComparison — Financial summary card comparing cash flow
 */
const RevenueExpenseComparison = ({ totalRevenue = 0, totalExpenses = 0 }) => {
  const netProfit = totalRevenue - totalExpenses;
  const isProfitable = netProfit >= 0;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  const maxVal = Math.max(totalRevenue, totalExpenses, 1);
  const revenuePercent = Math.min(100, Math.round((totalRevenue / maxVal) * 100));
  const expensePercent = Math.min(100, Math.round((totalExpenses / maxVal) * 100));

  return (
    <div className="farm-card p-4 h-100 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-dark mb-0 font-heading">Farm Cashflow & Profitability</h6>
        <span className={`badge ${isProfitable ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} px-2 py-1`}>
          {isProfitable ? `+${profitMargin}% Margin` : 'Deficit'}
        </span>
      </div>

      {/* Net Profit Big Banner */}
      <div className={`p-3 rounded-3 mb-4 ${isProfitable ? 'bg-success-subtle text-success-emphasis border border-success-subtle' : 'bg-danger-subtle text-danger-emphasis border border-danger-subtle'}`}>
        <div className="small fw-semibold mb-1">Estimated Net Farm Profit</div>
        <div className="display-6 fw-bold font-heading">
          {formatCurrency(netProfit)}
        </div>
        <small className="opacity-75">
          Calculated from real recorded harvest sales minus operational expenses.
        </small>
      </div>

      {/* Visual Bars */}
      <div className="mb-3">
        <div className="d-flex justify-content-between small mb-1">
          <span className="text-muted fw-semibold">Gross Harvest Revenue</span>
          <span className="fw-bold text-success">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
          <div 
            className="progress-bar bg-success rounded-pill" 
            role="progressbar" 
            style={{ width: `${revenuePercent}%` }}
            aria-valuenow={revenuePercent} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between small mb-1">
          <span className="text-muted fw-semibold">Total Farm Expenses</span>
          <span className="fw-bold text-danger">{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
          <div 
            className="progress-bar bg-danger rounded-pill" 
            role="progressbar" 
            style={{ width: `${expensePercent}%` }}
            aria-valuenow={expensePercent} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      {/* Summary Micro KPIs */}
      <div className="row g-2 pt-2 border-top">
        <div className="col-6">
          <div className="p-2 rounded bg-light text-center">
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>ROI Multiple</div>
            <div className="fw-bold text-dark">
              {totalExpenses > 0 ? (totalRevenue / totalExpenses).toFixed(2) + 'x' : 'N/A'}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="p-2 rounded bg-light text-center">
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Financial Health</div>
            <div className="fw-bold text-success">
              {isProfitable ? 'Optimal' : 'Needs Review'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueExpenseComparison;
