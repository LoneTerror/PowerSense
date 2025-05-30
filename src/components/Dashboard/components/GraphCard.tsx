// src/components/Dashboard/GraphCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDataContext } from '../context/DataContext';

interface GraphCardProps {
  title: string;
  data: Array<{ timestamp: string; value: number }>; // Data structure for history
  dataKey: string; // This will always be 'value' for your current history data structure
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

  /**
   * Determines the stroke color for the line graph based on the color prop.
   * @returns The hex color string.
   */
  const getStrokeColor = () => {
    switch (color) {
      case 'accent-primary': return '#3b82f6'; // Blue
      case 'accent-secondary': return '#6366f1'; // Indigo/Purple
      case 'accent-success': return '#10b981'; // Green
      case 'accent-warning': return '#f59e0b'; // Orange
      case 'accent-danger': return '#ef4444'; // Red
      default: return '#3b82f6';
    }
  };

  /**
   * Formats a timestamp string into 'hh:mmAM/PM' format for displaying time only.
   */
  const formatTimeOnly = (timestamp: string) => {
    const date = new Date(timestamp);

    // Handle invalid dates
    if (isNaN(date.getTime())) {
      return timestamp; // Return original if parsing fails
    }

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12' in 12-hour format
    const formattedHours = String(hours).padStart(2, '0');

    return `${formattedHours}:${minutes}${ampm}`;
  };

  /**
   * Custom tooltip component for Recharts to display data points.
   * @param props Recharts tooltip props (active, payload, label).
   * @returns The custom tooltip JSX.
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-light p-3 rounded-lg shadow-lg border border-gray-700">
          {/* Apply formatTimeOnly to the label */}
          <p className="text-sm text-text-secondary">{formatTimeOnly(label)}</p>
          <p className="text-lg font-semibold text-text-primary">
            {payload[0].value.toFixed(2)}{suffix} {/* Display value with suffix */}
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
            {/* X-Axis for timestamps with new time-only formatter */}
            <XAxis
              dataKey="timestamp"
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
              tickLine={{ stroke: '#64748b' }}
              tickFormatter={formatTimeOnly} // Apply the new time-only formatting function here
            />
            {/* Y-Axis for values */}
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
              tickLine={{ stroke: '#64748b' }}
            />
            {/* Custom tooltip for showing data on hover */}
            <Tooltip content={<CustomTooltip />} />
            {/* The Line graph itself */}
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