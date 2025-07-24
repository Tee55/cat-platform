import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SecurityTrendChart = () => {
  // Mock data for security trends over time
  const trendData = [
    { month: 'Jan', critical: 12, high: 45, medium: 78, low: 123 },
    { month: 'Feb', critical: 8, high: 52, medium: 89, low: 145 },
    { month: 'Mar', critical: 15, high: 38, medium: 95, low: 167 },
    { month: 'Apr', critical: 6, high: 41, medium: 102, low: 189 },
    { month: 'May', critical: 9, high: 33, medium: 87, low: 156 },
    { month: 'Jun', critical: 4, high: 29, medium: 76, low: 134 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Metrics Trend</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="critical" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Critical"
            />
            <Line 
              type="monotone" 
              dataKey="high" 
              stroke="#ea580c" 
              strokeWidth={2}
              name="High"
            />
            <Line 
              type="monotone" 
              dataKey="medium" 
              stroke="#d97706" 
              strokeWidth={2}
              name="Medium"
            />
            <Line 
              type="monotone" 
              dataKey="low" 
              stroke="#059669" 
              strokeWidth={2}
              name="Low"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SecurityTrendChart;