import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

/**
 * CropDistributionChart — Visualizes acreage distribution across active crops
 */
const CropDistributionChart = ({ crops = [] }) => {
  if (!crops || crops.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center p-4 text-muted small" style={{ height: '260px' }}>
        No crop distribution data available.
      </div>
    );
  }

  // Aggregate acreage by crop name
  const data = crops.map((crop) => ({
    name: crop.name,
    value: Number(crop.areaAcres) || 0
  })).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow-sm border small">
          <p className="fw-bold mb-0 text-dark">{payload[0].name}</p>
          <p className="text-success mb-0">{payload[0].value} Acres</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="small text-secondary">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CropDistributionChart;
