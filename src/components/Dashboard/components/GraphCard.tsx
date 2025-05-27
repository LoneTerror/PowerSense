import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDataContext } from '../context/DataContext';

interface GraphCardProps {
  title: string;
  data: Array<{ timestamp: string; value: number }>;
  dataKey: string;
  color: string;
  suffix?: string;
}

const GraphCard: React.FC<GraphCardProps> = ({
  title,
  data,
  dataKey,
  color,
  suffix = ''
}) => {
  const { loading } = useDataContext();

  const getStrokeColor = () => {
    switch (color) {
      case 'accent-primary': return '#3b82f6';
      case 'accent-secondary': return '#6366f1';
      case 'accent-success': return '#10b981';
      case 'accent-warning': return '#f59e0b';
      case 'accent-danger': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-light p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="text-lg font-semibold text-text-primary">
            {payload[0].value.toFixed(2)}{suffix}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="dashboard-card"
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
              tickLine={{ stroke: '#64748b' }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
              tickLine={{ stroke: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={getStrokeColor()}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={!loading}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GraphCard;