import React, { useState, useEffect } from 'react'; // Import useEffect
import { motion } from 'framer-motion';
import { LayoutGrid, RefreshCw, IndianRupee } from "lucide-react"; // Import IndianRupee icon
import { useDataContext } from '../context/DataContext';
import GaugeCard from './GaugeCard';
import GraphCard from './GraphCard';

const Dashboard: React.FC = () => {
  const { metrics, loading, refreshData } = useDataContext();
  const { specificAvgPower, specificAvgPowerLoading, specificAvgPowerError, refreshSpecificAvgPower } = useDataContext();

  const [selectedInterval, setSelectedInterval] = useState<number>(1);
  const [selectedAvgPeriod, setSelectedAvgPeriod] = useState<number>(5); // Default to 5 minutes

  // NEW STATE: For user-entered price per kWh
  const [userPricePerKWH, setUserPricePerKWH] = useState<number>(9); // Default to Rs. 9

  // NEW useEffect: Load price from localStorage on component mount
  useEffect(() => {
    const savedPrice = localStorage.getItem('powerSensePricePerKWH');
    if (savedPrice !== null) {
      const parsedPrice = parseFloat(savedPrice);
      if (!isNaN(parsedPrice)) {
        setUserPricePerKWH(parsedPrice);
      }
    }
  }, []);

  /**
   * Handles the change event from the interval selection dropdown (for historical graphs).
   */
  const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newInterval = parseInt(event.target.value, 10);
    setSelectedInterval(newInterval);
    refreshData(newInterval);
  };

  /**
   * Handles the change event from the average power consumption period dropdown.
   */
  const handleAvgPeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAvgPeriod = parseInt(event.target.value, 10);
    setSelectedAvgPeriod(newAvgPeriod);
    refreshSpecificAvgPower(newAvgPeriod);
  };

  /**
   * NEW: Handles changes to the price per kWh input field.
   * Stores the new price in local storage.
   */
  const handlePricePerKWHChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const parsedValue = parseFloat(newValue);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setUserPricePerKWH(parsedValue);
      localStorage.setItem('powerSensePricePerKWH', parsedValue.toString());
    } else if (newValue === '') {
      // Allow the input to be empty temporarily, but treat as 0 for calculation
      setUserPricePerKWH(0);
      localStorage.setItem('powerSensePricePerKWH', '0');
    }
    // If it's invalid (e.g., non-numeric text), we don't update the state,
    // keeping the last valid number or the default.
  };

  /**
   * NEW: Calculates the estimated cost based on average power, selected period, and user price.
   */
  const calculateEstimatedCost = () => {
    if (isNaN(specificAvgPower) || specificAvgPower === 0 || isNaN(userPricePerKWH) || userPricePerKWH === 0 || selectedAvgPeriod === 0) {
      return "0.00";
    }

    // Convert average power from Watts to Kilowatts
    const powerInKW = specificAvgPower / 1000;

    // Convert period from minutes to hours
    const periodInHours = selectedAvgPeriod / 60;

    // Calculate cost: (Power in kW) * (Time in hours) * (Price per kWh)
    const cost = powerInKW * periodInHours * userPricePerKWH;

    return cost.toFixed(2); // Format to 2 decimal places
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
          {/* Container for update status, interval dropdowns, price input, and Refresh Button */}
          <div className="flex items-center gap-4">
            <div className="text-text-secondary text-sm">
              {loading ? 'Updating main data...' : 'Main data: Just now'}
            </div>
            {/* Dropdown for X-axis interval selection */}
            <select
              value={selectedInterval}
              onChange={handleIntervalChange}
              className="bg-background-dark text-text-primary border border-gray-700 rounded-md px-3 py-1
                         focus:ring-2 focus:ring-accent-primary focus:border-transparent
                         dark:bg-green-100 dark:text-gray-900 dark:border-green-500 dark:focus:ring-green-500"
            >
              <option value={1}>Hourly History</option>
              <option value={3}>Every 3 Hours History</option>
              <option value={6}>Every 6 Hours History</option>
              <option value={12}>Every 12 Hours History</option>
              <option value={24}>Daily History</option>
            </select>

            {/* Dropdown for Average Power Consumption Period */}
            <select
              value={selectedAvgPeriod}
              onChange={handleAvgPeriodChange}
              className="bg-background-dark text-text-primary border border-gray-700 rounded-md px-3 py-1
                         focus:ring-2 focus:ring-accent-primary focus:border-transparent
                         dark:bg-green-100 dark:text-gray-900 dark:border-green-500 dark:focus:ring-green-500"
            >
              <option value={1}>Avg 1 Min</option>
              <option value={5}>Avg 5 Mins</option>
              <option value={10}>Avg 10 Mins</option>
              <option value={30}>Avg 30 Mins</option>
            </select>

            {/* NEW: Input for Price per kWh */}
            <div className="flex items-center gap-1">
              <label htmlFor="pricePerKWH" className="text-text-secondary text-sm whitespace-nowrap">Price/kWh:</label>
              <IndianRupee size={16} className="text-text-secondary" />
              <input
                id="pricePerKWH"
                type="number"
                step="0.01" // Allow decimal values
                value={userPricePerKWH === 0 ? '' : userPricePerKWH} // Show empty string if 0, for better UX
                onChange={handlePricePerKWHChange}
                className="bg-background-dark text-text-primary border border-gray-700 rounded-md px-2 py-1 w-20
                           focus:ring-2 focus:ring-accent-primary focus:border-transparent
                           dark:bg-green-100 dark:text-gray-900 dark:border-green-500 dark:focus:ring-green-500"
                aria-label="Price per kilowatt-hour"
              />
            </div>

            {/* Main Data Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refreshData(selectedInterval)}
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
        {/* Existing Gauge Cards */}
        <GaugeCard
          title="Current"
          value={metrics.current}
          maxValue={4.00}
          suffix="A"
          color="text-accent-primary"
        />
        <GaugeCard
          title="Avg Current"
          value={metrics.avgCurrent}
          maxValue={4.00}
          suffix="A"
          color="text-accent-secondary"
        />
        <GaugeCard
          title="Voltage"
          value={metrics.voltage}
          maxValue={250.00}
          suffix="V"
          color="text-accent-success"
        />
        <GaugeCard
          title="Inst Power"
          value={metrics.instPower}
          maxValue={200.00}
          suffix="W"
          color="text-accent-warning"
        />
        <GaugeCard
          title="Avg Power"
          value={metrics.avgPower}
          maxValue={200.00}
          suffix="W"
          color="text-accent-warning"
        />

        {/* Gauge Card for specific Average Power Consumption */}
        <GaugeCard
          title={`Avg Consumption (${selectedAvgPeriod} Min)`}
          value={specificAvgPower}
          maxValue={200.00}
          suffix="W"
          color="text-indigo-500"
          // Show loading/error state if specific avg power is loading/has error
          isLoading={specificAvgPowerLoading}
          error={specificAvgPowerError}
        />
      </motion.div>

      {/* NEW: Estimated Cost Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8 text-center"
      >
        <p className="text-2xl font-semibold text-text-primary">
          Estimated Cost for Last {selectedAvgPeriod} Minutes:{" "}
          <span className="bg-gradient-to-r from-teal-400 to-sky-500 text-transparent bg-clip-text">
            <IndianRupee className="inline-block h-6 w-6 align-text-bottom mr-1" />
            {calculateEstimatedCost()}
          </span>
        </p>
        {specificAvgPowerError && (
          <p className="text-red-500 text-sm mt-2">Error calculating cost: {specificAvgPowerError}</p>
        )}
      </motion.div>


      {/* Graph Cards Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <GraphCard
          title="Current (A) History"
          data={metrics.currentHistory}
          dataKey="value"
          color="accent-primary"
          suffix="A"
        />
        <GraphCard
          title="Avg Current (A) History"
          data={metrics.avgCurrentHistory}
          dataKey="value"
          color="accent-secondary"
          suffix="A"
        />
        <GraphCard
          title="Voltage (V) History"
          data={metrics.voltageHistory}
          dataKey="value"
          color="accent-danger"
          suffix="V"
        />
        <GraphCard
          title="Power (W) History"
          data={metrics.powerHistory}
          dataKey="value"
          color="accent-success"
          suffix="W"
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;