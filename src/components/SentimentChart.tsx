import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface SentimentChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const SentimentChart = ({ data }: SentimentChartProps) => {
  const [chartType, setChartType] = React.useState<'pie' | 'bar'>('pie');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">Count: {data.value}</p>
          <p className="text-sm text-gray-600">
            Percentage: {((data.value / data.payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setChartType('pie')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            chartType === 'pie' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pie Chart
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            chartType === 'bar' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Bar Chart
        </button>
      </div>

      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart data={dataWithTotal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dataWithTotal.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {total === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No data available yet</p>
          <p className="text-sm">Submit some comments to see the chart</p>
        </div>
      )}
    </div>
  );
};

export default SentimentChart;