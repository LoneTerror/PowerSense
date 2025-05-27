/**
 * Dashboard Service
 * 
 * This service handles the communication with the backend API for dashboard data.
 * Currently using mock data, but can be replaced with actual API calls.
 */

// Types for dashboard metrics
export interface DashboardMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  networkLoad: number;
  responseTimeHistory: DataPoint[];
  activeUsersHistory: DataPoint[];
  errorRateHistory: DataPoint[];
  throughputHistory: DataPoint[];
}

export interface DataPoint {
  timestamp: string;
  value: number;
}

// Mock API endpoint
const API_ENDPOINT = '/api/dashboard';

// Function to fetch dashboard metrics from the backend
export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  // In a real application, this would be an API call:
  // return fetch(API_ENDPOINT).then(response => response.json());
  
  // For now, return mock data
  return generateMockData();
};

// Mock data generator (similar to what we have in the context)
// In a real application, this would be replaced with actual API calls
const generateMockData = (): DashboardMetrics => {
  const timeLabels = generateTimeLabels();
  
  return {
    cpuUsage: 45 + Math.random() * 25,
    memoryUsage: 60 + Math.random() * 20,
    diskSpace: 72 + Math.random() * 15,
    networkLoad: 35 + Math.random() * 30,
    responseTimeHistory: generateDataSeries(timeLabels, 20, 200),
    activeUsersHistory: generateDataSeries(timeLabels, 100, 500),
    errorRateHistory: generateDataSeries(timeLabels, 0, 5),
    throughputHistory: generateDataSeries(timeLabels, 50, 250)
  };
};

// Helper to generate time labels for the last 24 hours
const generateTimeLabels = (): string[] => {
  const labels = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime());
    time.setHours(time.getHours() - i);
    labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }
  
  return labels;
};

// Helper to generate random data series
const generateDataSeries = (
  timeLabels: string[], 
  min: number, 
  max: number
): DataPoint[] => {
  return timeLabels.map(timestamp => {
    const randomFactor = Math.random() * (max - min);
    const value = Math.max(min, Math.min(max, min + randomFactor));
    
    return {
      timestamp,
      value: Number(value.toFixed(2))
    };
  });
};

// Export service functions
export default {
  fetchDashboardMetrics
};