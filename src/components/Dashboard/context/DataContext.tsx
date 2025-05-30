// src/components/Dashboard/context/DataContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchSensorData, SensorDataResponse } from '../services/dashboardService';
import { fetchSpecificAveragePower } from '../services/powerConsumptionService';

interface Metrics {
  current: number;
  avgCurrent: number;
  voltage: number;
  instPower: number;
  avgPower: number;
  currentHistory: { timestamp: string; value: number; }[];
  avgCurrentHistory: { timestamp: string; value: number; }[];
  voltageHistory: { timestamp: string; value: number; }[];
  powerHistory: { timestamp: string; value: number; }[];
}

// MODIFIED: specificAvgPowerLoading has been removed from this interface
interface DataContextType {
  metrics: Metrics;
  loading: boolean;
  error: string | null;
  refreshData: (intervalHours?: number) => void;
  specificAvgPower: number;
  specificAvgPowerError: string | null;
  refreshSpecificAvgPower: (periodMinutes?: number) => void;
}

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

const DataContext = createContext<DataContextType>({
  metrics: initialMetrics,
  loading: true,
  error: null,
  refreshData: () => {},
  specificAvgPower: 0,
  // MODIFIED: specificAvgPowerLoading removed from initial context value
  specificAvgPowerError: null,
  refreshSpecificAvgPower: () => {},
});

export const useDataContext = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentInterval, setCurrentInterval] = useState<number>(24);

  const [specificAvgPower, setSpecificAvgPower] = useState<number>(0);
  // MODIFIED: specificAvgPowerLoading state declaration removed
  const [specificAvgPowerError, setSpecificAvgPowerError] = useState<string | null>(null);
  const [currentSpecificAvgPeriod, setCurrentSpecificAvgPeriod] = useState<number>(5);

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

  const refreshSpecificAvgPower = async (periodMinutes: number = currentSpecificAvgPeriod) => {
    // MODIFIED: setSpecificAvgPowerLoading(true) call removed
    setSpecificAvgPowerError(null);
    setCurrentSpecificAvgPeriod(periodMinutes);

    try {
      const avgPower = await fetchSpecificAveragePower(periodMinutes);
      setSpecificAvgPower(avgPower);
    } catch (err: any) {
      console.error("Failed to refresh specific average power:", err);
      setSpecificAvgPowerError(err.message || "An unknown error occurred while fetching specific average power.");
      setSpecificAvgPower(0);
    } finally {
      // MODIFIED: setSpecificAvgPowerLoading(false) call removed
    }
  };

  // useEffect hook for main dashboard metrics
  useEffect(() => {
    refreshData(currentInterval);

    const intervalId = setInterval(() => {
      refreshData(currentInterval);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentInterval]);

  // useEffect hook for the specific average power consumption
  useEffect(() => {
    refreshSpecificAvgPower(currentSpecificAvgPeriod);

    const avgIntervalId = setInterval(() => {
      refreshSpecificAvgPower(currentSpecificAvgPeriod);
    }, 2000);

    return () => clearInterval(avgIntervalId);
  }, [currentSpecificAvgPeriod]);

  return (
    <DataContext.Provider value={{
      metrics,
      loading,
      error,
      refreshData,
      specificAvgPower,
      // MODIFIED: specificAvgPowerLoading removed from provider value
      specificAvgPowerError,
      refreshSpecificAvgPower
    }}>
      {children}
    </DataContext.Provider>
  );
};