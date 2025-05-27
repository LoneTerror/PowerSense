import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Metrics {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  networkLoad: number;
  responseTimeHistory: { timestamp: string; value: number; }[];
  activeUsersHistory: { timestamp: string; value: number; }[];
  errorRateHistory: { timestamp: string; value: number; }[];
  throughputHistory: { timestamp: string; value: number; }[];
}

interface DataContextType {
  metrics: Metrics;
  loading: boolean;
  refreshData: () => void;
}

const initialMetrics: Metrics = {
  cpuUsage: 0,
  memoryUsage: 0,
  diskSpace: 0,
  networkLoad: 0,
  responseTimeHistory: [],
  activeUsersHistory: [],
  errorRateHistory: [],
  throughputHistory: []
};

const DataContext = createContext<DataContextType>({
  metrics: initialMetrics,
  loading: true,
  refreshData: () => {}
});

export const useDataContext = () => useContext(DataContext);

const generateTimeLabels = () => {
  const labels = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime());
    time.setHours(time.getHours() - i);
    labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }
  
  return labels;
};

const generateMockData = () => {
  const timeLabels = generateTimeLabels();
  
  const generateDataSeries = (min: number, max: number, trend = 0) => {
    return timeLabels.map((timestamp, index) => {
      const trendValue = trend * (index / timeLabels.length);
      const randomFactor = Math.random() * ((max - min) / 4);
      const value = Math.max(min, Math.min(max, min + (max - min) / 2 + randomFactor + trendValue));
      
      return {
        timestamp,
        value: Number(value.toFixed(2))
      };
    });
  };
  
  return {
    cpuUsage: 45 + Math.random() * 25,
    memoryUsage: 60 + Math.random() * 20,
    diskSpace: 72 + Math.random() * 15,
    networkLoad: 35 + Math.random() * 30,
    responseTimeHistory: generateDataSeries(20, 200, 40),
    activeUsersHistory: generateDataSeries(100, 500, 100),
    errorRateHistory: generateDataSeries(0, 5, -1),
    throughputHistory: generateDataSeries(50, 250, 30)
  };
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const newData = generateMockData();
      setMetrics(newData);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    refreshData();
    
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DataContext.Provider value={{ metrics, loading, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};