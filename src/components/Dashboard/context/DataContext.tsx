// src/components/Dashboard/context/DataContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchSensorData, SensorDataResponse } from '../services/dashboardService'; // Import the service to fetch real data

// Define the Metrics interface to match the data structure from your backend
interface Metrics {
  current: number;
  avgCurrent: number;
  voltage: number;
  instPower: number;
  avgPower: number;
  // History arrays for charting
  currentHistory: { timestamp: string; value: number; }[];
  avgCurrentHistory: { timestamp: string; value: number; }[];
  voltageHistory: { timestamp: string; value: number; }[];
  powerHistory: { timestamp: string; value: number; }[];
}

// Define the shape of the context object
interface DataContextType {
  metrics: Metrics;
  loading: boolean;
  error: string | null; // Added to handle and display any data fetching errors
  refreshData: (intervalHours?: number) => void; // Function to trigger data refresh
}

// Initial state for metrics before any data is loaded
const initialMetrics: Metrics = {
  current: 0,
  avgCurrent: 0,
  voltage: 0,
  instPower: 0,
  avgPower: 0,
  currentHistory: [],
  avgCurrentHistory: [],
  voltageHistory: [],
  powerHistory: []
};

// Create the React Context
const DataContext = createContext<DataContextType>({
  metrics: initialMetrics,
  loading: true, // Initially true as data will be loading
  error: null,   // No error initially
  refreshData: () => {} // Placeholder function
});

// Custom hook for convenient consumption of the DataContext
export const useDataContext = () => useContext(DataContext);

// DataProvider component that wraps your application and provides the data context
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // State to track the currently selected interval for historical data, default to 24 hours
  const [currentInterval, setCurrentInterval] = useState<number>(24);

  /**
   * Function to fetch and refresh the sensor data from the backend.
   * It updates the loading, error, and metrics states.
   * @param intervalHours Optional. The number of hours for historical data to fetch.
   * If not provided, uses the currentInterval state.
   */
  const refreshData = async (intervalHours: number = currentInterval) => {
    setLoading(true); // Set loading to true when fetching starts
    setError(null);   // Clear any previous errors
    setCurrentInterval(intervalHours); // Update the interval state

    try {
      // Call the fetchSensorData function from your dashboardService
      const newData: SensorDataResponse = await fetchSensorData(intervalHours);
      setMetrics(newData); // Update metrics with fetched data
    } catch (err: any) {
      console.error("Failed to refresh data:", err);
      // Set error state if fetching fails
      setError(err.message || "An unknown error occurred while fetching data.");
      // Optionally reset metrics or show a fallback if data fetch fails
      setMetrics(initialMetrics);
    } finally {
      setLoading(false); // Set loading to false once fetching is complete (success or failure)
    }
  };

  // useEffect hook to handle initial data load and periodic refreshing
  useEffect(() => {
    // 1. Initial data load
    refreshData(currentInterval);

    // 2. Set up an interval to refresh data periodically (e.g., every 30 seconds)
    const intervalId = setInterval(() => {
      refreshData(currentInterval); // Refresh using the currently selected interval
    }, 2000); // Refreshes every 2 seconds (adjust as needed for your sensor data update rate)

    // 3. Cleanup function: Clear the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalId);
  }, [currentInterval]); // Dependency array: Effect re-runs if currentInterval changes

  return (
    <DataContext.Provider value={{ metrics, loading, error, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};