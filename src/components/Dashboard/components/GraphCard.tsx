import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDataContext } from '../context/DataContext'; // Ensure correct path

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
  dataKey, // This prop will be 'value' when used with your history data
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
   * Custom tooltip component for Recharts to display data points.
   * @param props Recharts tooltip props (active, payload, label).
   * @returns The custom tooltip JSX.
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-light p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-sm text-text-secondary">{label}</p>
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
        {/* ResponsiveContainer ensures the chart adapts to its parent's size */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data} // The historical data array
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {/* Grid lines for better readability */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155" // Darker grid lines
              vertical={false} // Only horizontal grid lines
            />
            {/* X-Axis for timestamps */}
            <XAxis
              dataKey="timestamp" // Uses the 'timestamp' property from your data objects
              stroke="#64748b" // Color for axis line
              tick={{ fill: '#64748b' }} // Color for tick labels
              tickLine={{ stroke: '#64748b' }} // Color for tick marks
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
              type="monotone" // Smooth curve
              dataKey={dataKey} // Uses the 'value' property from your data objects
              stroke={getStrokeColor()} // Dynamic stroke color
              strokeWidth={2}
              dot={false} // No dots on data points by default
              activeDot={{ r: 4 }} // Larger dot on hover
              isAnimationActive={!loading} // Disable animation during loading
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GraphCard;
