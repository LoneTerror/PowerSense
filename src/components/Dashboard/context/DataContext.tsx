import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Metrics interface with the new, descriptive names
interface Metrics {
  current: number;       // Corresponds to "Current" GaugeCard
  avgCurrent: number;    // Corresponds to "Avg Current" GaugeCard
  voltage: number;       // Corresponds to "Voltage" GaugeCard
  instPower: number;     // Corresponds to "Inst Power" GaugeCard
  avgPower: number;      // Corresponds to "Avg Power" GaugeCard
  // Updated history names for clarity
  currentHistory: { timestamp: string; value: number; }[];
  avgCurrentHistory: { timestamp: string; value: number; }[];
  voltageHistory: { timestamp: string; value: number; }[];
  powerHistory: { timestamp: string; value: number; }[];
}

// Define the DataContextType, updating refreshData to accept an optional interval
interface DataContextType {
  metrics: Metrics;
  loading: boolean;
  refreshData: (intervalHours?: number) => void; // refreshData now accepts interval
}

// Initialize metrics with the new names and default values
const initialMetrics: Metrics = {
  current: 0,
  avgCurrent: 0,
  voltage: 0,
  instPower: 0,
  avgPower: 0,
  // Initial empty arrays for history
  currentHistory: [],
  avgCurrentHistory: [],
  voltageHistory: [],
  powerHistory: []
};

// Create the DataContext
const DataContext = createContext<DataContextType>({
  metrics: initialMetrics,
  loading: true,
  refreshData: () => {}
});

// Custom hook to easily consume the DataContext
export const useDataContext = () => useContext(DataContext);

/**
 * Generates an array of time labels for the X-axis based on a specified interval.
 * @param intervalHours The interval in hours (e.g., 1 for hourly, 3 for every 3 hours).
 * @returns An array of formatted time strings.
 */
const generateTimeLabels = (intervalHours: number = 1) => {
  const labels = [];
  const now = new Date();
  // Get the start of the current day to ensure consistent 24-hour range
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Loop through 24 hours, incrementing by the specified interval
  for (let i = 0; i < 24; i += intervalHours) {
    const time = new Date(startOfToday.getTime());
    time.setHours(i);
    labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }

  // If the interval is hourly, ensure the current time is also included for real-time feel
  if (intervalHours === 1) {
      const currentTimeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Add current time if it's not already covered by an exact hour mark
      if (!labels.includes(currentTimeLabel)) {
          labels.push(currentTimeLabel);
          // Sort labels to maintain chronological order
          labels.sort((a, b) => {
              const timeA = new Date(`2000/01/01 ${a}`); // Use a dummy date for comparison
              const timeB = new Date(`2000/01/01 ${b}`);
              return timeA.getTime() - timeB.getTime();
          });
      }
  }

  return labels;
};

/**
 * Generates mock data for all metrics, including historical data for graphs,
 * based on the specified time interval and new requested ranges.
 * @param intervalHours The interval in hours for generating time labels.
 * @returns An object containing mock metric data.
 */
const generateMockData = (intervalHours: number = 1) => {
  const timeLabels = generateTimeLabels(intervalHours);

  // Helper function to generate a series of data points for historical graphs
  const generateDataSeries = (min: number, max: number, trend = 0) => {
    return timeLabels.map((timestamp, index) => {
      // Calculate a trend value based on the index in the series
      const trendValue = trend * (index / timeLabels.length);
      // Add a random factor to create variations
      const randomFactor = Math.random() * ((max - min) / 4);
      // Ensure the value stays within min and max bounds
      const value = Math.max(min, Math.min(max, min + (max - min) / 2 + randomFactor + trendValue));

      return {
        timestamp,
        value: Number(value.toFixed(2)) // Format to 2 decimal places
      };
    });
  };

  return {
    // Gauge values, ensuring they stay within their respective max values and new ranges
    // Current: 0.25A to 4.00A
    current: Number((0.25 + Math.random() * 3.75).toFixed(2)),

    // Avg Current: 0.25A to 4.00A
    avgCurrent: Number((0.25 + Math.random() * 3.75).toFixed(2)),

    // Voltage: 200V to 250V
    voltage: Number((200 + Math.random() * 50).toFixed(2)),

    // Inst Power: 30W to 200W
    instPower: Number((30 + Math.random() * 170).toFixed(2)),

    // Avg Power: 30W to 200W
    avgPower: Number((30 + Math.random() * 170).toFixed(2)),

    // Historical data for graphs, updated to new ranges and names
    currentHistory: generateDataSeries(0.25, 4.00, 0.5),
    avgCurrentHistory: generateDataSeries(0.25, 4.00, 0.5),
    voltageHistory: generateDataSeries(200, 250, 10),
    powerHistory: generateDataSeries(30, 200, 20)
  };
};

// DataProvider component to wrap the application and provide context
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [loading, setLoading] = useState<boolean>(true);
  // State to keep track of the currently selected interval for time labels
  const [currentInterval, setCurrentInterval] = useState<number>(1);

  /**
   * Refreshes the mock data. Can be called with an optional interval to update graph granularity.
   * @param intervalHours The new interval in hours to use for data generation.
   */
  const refreshData = async (intervalHours: number = currentInterval) => {
    setLoading(true);
    setCurrentInterval(intervalHours); // Update the interval state
    
    // Simulate an API call delay
    setTimeout(() => {
      const newData = generateMockData(intervalHours); // Generate data with the specified interval
      setMetrics(newData);
      setLoading(false);
    }, 1200);
  };

  // Effect hook to perform initial data load and set up periodic refresh
  useEffect(() => {
    refreshData(currentInterval); // Initial data load using the current interval

    // Set up an interval to refresh data periodically
    const intervalId = setInterval(() => {
      refreshData(currentInterval); // Refresh data with the currently selected interval
    }, 30000); // Refresh every 30 seconds

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalId);
  }, [currentInterval]); // Re-run effect if currentInterval changes (to restart timer with new interval)

  return (
    <DataContext.Provider value={{ metrics, loading, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};
