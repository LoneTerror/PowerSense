// src/components/Dashboard/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, RefreshCw } from "lucide-react";
import { useDataContext } from '../context/DataContext';
import GaugeCard from './GaugeCard';
import GraphCard from './GraphCard';

const Dashboard: React.FC = () => {
  const { metrics, loading, refreshData } = useDataContext();
  const { specificAvgPower, specificAvgPowerError, refreshSpecificAvgPower } = useDataContext();

  const [selectedAvgPeriod, setSelectedAvgPeriod] = useState<number>(5); // Default to 5 minutes
  const [userPricePerKWH, setUserPricePerKWH] = useState<number>(9); // Default to Rs. 9

  // Load price from localStorage on component mount
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
   * Handles the change event from the average power consumption period dropdown.
   */
  const handleAvgPeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAvgPeriod = parseInt(event.target.value, 10);
    setSelectedAvgPeriod(newAvgPeriod);
    refreshSpecificAvgPower(newAvgPeriod); // Only refresh specific average power
  };

  /**
   * Handles changes to the price per kWh input field.
   * Stores the new price in local storage.
   */
  const handlePricePerKWHChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const parsedValue = parseFloat(newValue);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setUserPricePerKWH(parsedValue);
      localStorage.setItem('powerSensePricePerKWH', parsedValue.toString());
    } else if (newValue === '') {
      setUserPricePerKWH(0);
      localStorage.setItem('powerSensePricePerKWH', '0');
    }
  };

  /**
   * Calculates the estimated cost based on average power, selected period, and user price.
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

  /**
   * Extracts and formats the date from the first timestamp in the history data.
   * Assumes all graph data covers the same date.
   */
  const getDisplayDate = () => {
    if (!metrics.currentHistory || metrics.currentHistory.length === 0) {
      return '';
    }
    const firstTimestamp = metrics.currentHistory[0].timestamp;
    const date = new Date(firstTimestamp);

    if (isNaN(date.getTime())) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const displayDate = getDisplayDate();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // Stacks on small screens, then row on medium and larger
          className="flex flex-col md:flex-row md:items-start justify-between"
        >
          {/* Container for Analytics Dashboard title and status */}
          <div className="flex flex-col mb-4 md:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <LayoutGrid className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-accent-primary" />
              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">
                Analytics
                {" "}
                <span className="bg-gradient-to-r from-[#79c5bf] to-[#b183db] text-transparent bg-clip-text">
                  Dashboard
                </span>
              </h1>
            </div>
            {/* Status & Refresh Button below title */}
            <div className="flex items-center gap-2 text-text-secondary text-xs sm:text-sm mt-3">
              {/* Main Data Refresh Button - Moved here */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refreshData()}
                disabled={loading}
                className={`p-1 rounded-full bg-background-light hover:bg-background-lighter
                  transition-colors duration-200 focus:outline-none focus:ring-2
                  focus:ring-accent-primary focus:ring-opacity-50`}
                aria-label="Refresh dashboard data"
              >
                <RefreshCw
                  size={14}
                  className={`text-text-primary ${loading ? 'animate-spin' : ''}`}
                />
              </motion.button>
              {loading ? 'Updating main data...' : 'Main data: Just now'}
            </div>
          </div>

          {/* Controls (dropdowns, input) */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-2 md:gap-x-4 md:gap-y-2 mt-4 md:mt-0 items-stretch sm:items-center">
            {/* Dropdown for Average Power Consumption Period */}
            <select
              value={selectedAvgPeriod}
              onChange={handleAvgPeriodChange}
              // Light mode: bg-indigo-500 text-white border-sky-600
              // Dark mode: now mirrors light mode for consistency
              className="bg-indigo-500 text-white border border-sky-600 rounded-md px-3 py-1
                         focus:ring-2 focus:ring-accent-primary focus:border-transparent
                         dark:bg-indigo-500 dark:text-white dark:border-sky-600 dark:focus:ring-blue-500
                         text-sm sm:text-base w-full sm:w-auto"
            >
              <option value={1}>Avg 1 Min</option>
              <option value={5}>Avg 5 Mins</option>
              <option value={10}>Avg 10 Mins</option>
              <option value={30}>Avg 30 Mins</option>
            </select>

            {/* Input for Price per kWh */}
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <label htmlFor="pricePerKWH" className="text-text-secondary text-xs sm:text-sm whitespace-nowrap">Price/kWh:</label>
              <span className="text-text-secondary text-sm sm:text-base font-medium">Rs.</span>
              <input
                id="pricePerKWH"
                type="number"
                step="0.01"
                value={userPricePerKWH === 0 ? '' : userPricePerKWH}
                onChange={handlePricePerKWHChange}
                // Light mode: bg-gray-500 text-white border-black
                // Dark mode: now mirrors light mode for consistency (border-black-600 changed to border-black)
                className="bg-gray-500 text-white border border-black rounded-md px-2 py-1 w-20
                           focus:ring-2 focus:ring-accent-primary focus:border-transparent
                           dark:bg-gray-500 dark:text-white dark:border-black dark:focus:ring-indigo-500
                           text-sm sm:text-base flex-grow"
                aria-label="Price per kilowatt-hour"
              />
            </div>
          </div>
        </motion.div>
      </header>

      {/* Gauge Cards Section (no changes here from last turn) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
      >
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
        <GaugeCard
          title={`Avg Consumption (${selectedAvgPeriod} Min)`}
          value={specificAvgPower}
          maxValue={200.00}
          suffix="W"
          color="text-indigo-500"
          error={specificAvgPowerError}
        />
      </motion.div>

      {/* Estimated Cost Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8 mt-6 pt-10 text-center"
      >
        <p className="text-lg md:text-2xl font-semibold text-text-primary">
          Estimated Cost for Last {selectedAvgPeriod} Minutes:{" "}
          <span className="bg-gradient-to-r from-teal-400 to-indigo-200 text-transparent bg-clip-text">
            Rs.{" "}
            {calculateEstimatedCost()}
          </span>
        </p>
        {specificAvgPowerError && (
          <p className="text-red-500 text-xs md:text-sm mt-3">Error calculating cost: {specificAvgPowerError}</p>
        )}
      </motion.div>

      {/* Date Display for Graphs */}
      {displayDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-text-secondary text-lg font-medium mb-6 mt-8"
        >
          Data for: <span className="text-text-primary text-indigo-300 font-semibold">{displayDate}</span>
        </motion.div>
      )}

      {/* Graph Cards Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 pt-10 gap-6"
      >
        <GraphCard
          title="Current (A) History (Last 24 Hrs)"
          data={metrics.currentHistory}
          dataKey="value"
          color="accent-primary"
          suffix="A"
        />
        <GraphCard
          title="Avg Current (A) History (Last 24 Hrs)"
          data={metrics.avgCurrentHistory}
          dataKey="value"
          color="accent-secondary"
          suffix="A"
        />
        <GraphCard
          title="Voltage (V) History (Last 24 Hrs)"
          data={metrics.voltageHistory}
          dataKey="value"
          color="accent-danger"
          suffix="V"
        />
        <GraphCard
          title="Power (W) History (Last 24 Hrs)"
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