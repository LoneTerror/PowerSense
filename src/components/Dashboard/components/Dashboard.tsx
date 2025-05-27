import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, RefreshCw } from 'lucide-react'; // Import RefreshCw icon
import { useDataContext } from '../context/DataContext'; // Ensure correct path
import GaugeCard from './GaugeCard'; // Ensure correct path
import GraphCard from './GraphCard'; // Ensure correct path
// Removed: import RefreshButton from './RefreshButton';

const Dashboard: React.FC = () => {
  // Destructure metrics, loading, and refreshData from the DataContext
  const { metrics, loading, refreshData } = useDataContext();
  // State to manage the selected time interval for the graphs
  const [selectedInterval, setSelectedInterval] = useState<number>(1); // Default to 1 hour

  /**
   * Handles the change event from the interval selection dropdown.
   * Updates the selectedInterval state and triggers a data refresh in DataContext.
   * @param event The change event from the select element.
   */
  const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newInterval = parseInt(event.target.value, 10); // Parse the selected value to an integer
    setSelectedInterval(newInterval); // Update the local state
    refreshData(newInterval); // Call refreshData from context with the new interval
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 pb-20">
            <LayoutGrid className="h-8 w-8 text-accent-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Analytics
              {" "}
              <span className="bg-gradient-to-r from-[#79c5bf] to-[#b183db] text-transparent bg-clip-text">
                Dashboard
              </span>
            </h1>
          </div>
          {/* Container for update status, interval dropdown, and Refresh Button */}
          <div className="flex items-center gap-4">
            <div className="text-text-secondary text-sm">
              {loading ? 'Updating data...' : 'Last updated: Just now'}
            </div>
            {/* Dropdown for X-axis interval selection */}
            <select
              value={selectedInterval} // Bind value to state
              onChange={handleIntervalChange} // Handle changes
              className="bg-background-dark text-text-primary border border-gray-700 rounded-md px-3 py-1
                         focus:ring-2 focus:ring-accent-primary focus:border-transparent
                         dark:bg-green-100 dark:text-gray-900 dark:border-green-500 dark:focus:ring-green-500" // Added dark mode specific styles
            >
              <option value={1}>Hourly</option>
              <option value={3}>Every 3 Hours</option>
              <option value={6}>Every 6 Hours</option>
              <option value={12}>Every 12 Hours</option>
              <option value={24}>Daily</option>
            </select>
            {/* Integrated RefreshButton logic directly */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refreshData(selectedInterval)} // Call refreshData with current interval
              disabled={loading}
              className={`p-2 rounded-full bg-background-light hover:bg-background-lighter
              transition-colors duration-200 focus:outline-none focus:ring-2
              focus:ring-accent-primary focus:ring-opacity-50`}
              aria-label="Refresh dashboard data"
            >
              <RefreshCw
                size={18}
                className={`text-text-primary ${loading ? 'animate-spin' : ''}`}
              />
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Gauge Cards Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8 pb-20"
      >
        {/* Using the new metric names from DataContext */}
        <GaugeCard
          title="Current"
          value={metrics.current}
          maxValue={4.00} // Max value adjusted
          suffix="A"
          color="text-accent-primary"
        />
        <GaugeCard
          title="Avg Current"
          value={metrics.avgCurrent}
          maxValue={4.00} // Max value adjusted
          suffix="A"
          color="text-accent-secondary"
        />
        <GaugeCard
          title="Voltage"
          value={metrics.voltage}
          maxValue={250.00} // Max value adjusted
          suffix="V"
          color="text-accent-success"
        />
        <GaugeCard
          title="Inst Power"
          value={metrics.instPower}
          maxValue={200.00} // Max value adjusted
          suffix="W"
          color="text-accent-warning"
        />
        {/* The Avg Power GaugeCard, using the new avgPower metric */}
        <GaugeCard
          title="Avg Power"
          value={metrics.avgPower}
          maxValue={200.00} // Max value adjusted
          suffix="W"
          color="text-accent-warning"
        />
      </motion.div>

      {/* Graph Cards Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Mapping history data to GraphCards using the new history names */}
        <GraphCard
          title="Current (A) History"
          data={metrics.currentHistory} // Updated history name
          dataKey="value"
          color="accent-primary"
          suffix="A"
        />
        <GraphCard
          title="Avg Current (A) History"
          data={metrics.avgCurrentHistory} // Updated history name
          dataKey="value"
          color="accent-secondary"
          suffix="A"
        />
        <GraphCard
          title="Voltage (V) History"
          data={metrics.voltageHistory} // Updated history name
          dataKey="value"
          color="accent-danger"
          suffix="V"
        />
        <GraphCard
          title="Power (W) History" // Updated title
          data={metrics.powerHistory} // Updated history name
          dataKey="value"
          color="accent-success"
          suffix="W"
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
