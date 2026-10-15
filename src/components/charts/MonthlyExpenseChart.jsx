import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

/**
 * MonthlyExpenseChart — Category-wise farm expense bar chart
 */
const MonthlyExpenseChart = ({ expenses = [] }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center p-4 text-muted small" style={{ height: '260px' }}>
        No expense records found.
      </div>
    );
  }

  // Aggregate total expense amount per category
  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const data = Object.keys(categoryTotals).map((category) => ({
    category,
    amount: categoryTotals[category]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow-sm border small">
          <p className="fw-bold mb-0 text-dark">{payload[0].payload.category}</p>
          <p className="text-danger fw-semibold mb-0">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="category" 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            angle={-25} 
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="#1b5e20" radius={[6, 6, 0, 0]} maxBarSize={45} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpenseChart;
