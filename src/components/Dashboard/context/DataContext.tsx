// src/components/Dashboard/context/DataContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchSensorData, SensorDataResponse } from '../services/dashboardService'; // Existing import
import { fetchSpecificAveragePower } from '../services/powerConsumptionService'; // NEW: Import the new service

// Define the Metrics interface (EXISTING - NO CHANGES HERE for existing metrics)
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

// Define the shape of the context object (MODIFIED)
interface DataContextType {
  metrics: Metrics;
  loading: boolean;
  error: string | null;
  refreshData: (intervalHours?: number) => void; // Existing function
  // NEW: States and function for specific average power consumption
  specificAvgPower: number;
  specificAvgPowerLoading: boolean;
  specificAvgPowerError: string | null;
  refreshSpecificAvgPower: (periodMinutes?: number) => void;
}

// Initial state for metrics (EXISTING - NO CHANGES HERE for existing metrics)
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
  loading: true,
  error: null,
  refreshData: () => {},
  // NEW: Initial values for specific average power
  specificAvgPower: 0,
  specificAvgPowerLoading: true,
  specificAvgPowerError: null,
  refreshSpecificAvgPower: () => {},
});

// Custom hook for convenient consumption of the DataContext
export const useDataContext = () => useContext(DataContext);

// DataProvider component that wraps your application and provides the data context
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentInterval, setCurrentInterval] = useState<number>(24);

  // NEW: States for specific average power consumption
  const [specificAvgPower, setSpecificAvgPower] = useState<number>(0);
  const [specificAvgPowerLoading, setSpecificAvgPowerLoading] = useState<boolean>(true);
  const [specificAvgPowerError, setSpecificAvgPowerError] = useState<string | null>(null);
  const [currentSpecificAvgPeriod, setCurrentSpecificAvgPeriod] = useState<number>(5); // Default to 5 minutes

  /**
   * Function to fetch and refresh the sensor data from the backend (EXISTING).
   */
  const refreshData = async (intervalHours: number = currentInterval) => {
    setLoading(true);
    setError(null);
    setCurrentInterval(intervalHours);

    try {
      const newData: SensorDataResponse = await fetchSensorData(intervalHours);
      setMetrics(newData);
    } catch (err: any) {
      console.error("Failed to refresh data:", err);
      setError(err.message || "An unknown error occurred while fetching data.");
      setMetrics(initialMetrics);
    } finally {
      setLoading(false);
    }
  };

  /**
   * NEW: Function to fetch and refresh the specific average power consumption.
   * @param periodMinutes Optional. The number of minutes for the average calculation.
   */
  const refreshSpecificAvgPower = async (periodMinutes: number = currentSpecificAvgPeriod) => {
    setSpecificAvgPowerLoading(true);
    setSpecificAvgPowerError(null);
    setCurrentSpecificAvgPeriod(periodMinutes); // Update the state with the new period

    try {
      const avgPower = await fetchSpecificAveragePower(periodMinutes);
      setSpecificAvgPower(avgPower);
    } catch (err: any) {
      console.error("Failed to refresh specific average power:", err);
      setSpecificAvgPowerError(err.message || "An unknown error occurred while fetching specific average power.");
      setSpecificAvgPower(0); // Reset or show default on error
    } finally {
      setSpecificAvgPowerLoading(false);
    }
  };

  // useEffect hook to handle initial data load and periodic refreshing for main dashboard metrics
  useEffect(() => {
    refreshData(currentInterval); // Initial load

    const intervalId = setInterval(() => {
      refreshData(currentInterval);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentInterval]); // Only re-run if currentInterval changes

  // NEW: useEffect hook for the specific average power consumption
  useEffect(() => {
    refreshSpecificAvgPower(currentSpecificAvgPeriod); // Initial load for specific average

    const avgIntervalId = setInterval(() => {
      refreshSpecificAvgPower(currentSpecificAvgPeriod);
    }, 2000); // Refresh every 2 seconds (adjust as needed)

    return () => clearInterval(avgIntervalId);
  }, [currentSpecificAvgPeriod]); // Only re-run if currentSpecificAvgPeriod changes

  return (
    <DataContext.Provider value={{
      metrics,
      loading,
      error,
      refreshData,
      // NEW: Provide specific average power states and function
      specificAvgPower,
      specificAvgPowerLoading,
      specificAvgPowerError,
      refreshSpecificAvgPower
    }}>
      {children}
    </DataContext.Provider>
  );
};