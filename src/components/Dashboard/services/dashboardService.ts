// src/components/Dashboard/services/dashboardService.ts

// Define the structure of the historical data points
interface HistoryDataPoint {
  timestamp: string; // ISO 8601 string
  value: number;
}

// Define the expected structure of the data returned from the backend API
// This matches the database schema for sensor_data
export interface SensorDataResponse {
  current: number;
  avgCurrent: number;
  voltage: number;
  instPower: number;
  avgPower: number;
  currentHistory: HistoryDataPoint[];
  avgCurrentHistory: HistoryDataPoint[];
  voltageHistory: HistoryDataPoint[];
  powerHistory: HistoryDataPoint[]; // Assuming this combines instPower and avgPower history or just instPower
}

/**
 * Fetches sensor data from the backend API.
 * This function will make a request to your Node.js backend,
 * which in turn will query your Neon Tech PostgreSQL database.
 *
 * @param intervalHours The number of hours of historical data to fetch.
 * The backend should interpret this to filter historical data.
 * @returns A Promise that resolves to the fetched SensorDataResponse.
 */
export const fetchSensorData = async (intervalHours: number = 24): Promise<SensorDataResponse> => {
  try {
    const response = await fetch(`https://backend.powersense.site/api/sensor-data?interval=${intervalHours}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch sensor data: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const rawData: any = await response.json(); // Get raw data as 'any' to allow parsing

    // --- IMPORTANT: Parse string values to numbers here ---
    const parsedData: SensorDataResponse = {
      current: parseFloat(rawData.current),
      avgCurrent: parseFloat(rawData.avgCurrent),
      voltage: parseFloat(rawData.voltage),
      instPower: parseFloat(rawData.instPower),
      avgPower: parseFloat(rawData.avgPower),
      // Map historical data, ensuring 'value' is parsed
      currentHistory: rawData.currentHistory.map((d: any) => ({
        timestamp: d.timestamp,
        value: parseFloat(d.value)
      })),
      avgCurrentHistory: rawData.avgCurrentHistory.map((d: any) => ({
        timestamp: d.timestamp,
        value: parseFloat(d.value)
      })),
      voltageHistory: rawData.voltageHistory.map((d: any) => ({
        timestamp: d.timestamp,
        value: parseFloat(d.value)
      })),
      powerHistory: rawData.powerHistory.map((d: any) => ({
        timestamp: d.timestamp,
        value: parseFloat(d.value)
      })),
    };

    console.log("Fetched and parsed sensor data:", parsedData); // Log the parsed data
    return parsedData;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    throw error;
  }
};