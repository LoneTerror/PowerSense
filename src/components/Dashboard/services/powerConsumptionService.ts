// src/components/Dashboard/services/powerConsumptionService.ts

/**
 * Fetches the average instantaneous power consumption for a given period from the backend.
 * This calls a new, dedicated backend endpoint.
 *
 * @param periodMinutes The number of minutes for the average calculation (e.g., 1, 5, 10, 30).
 * @returns A Promise that resolves to the average power in Watts.
 */
export const fetchSpecificAveragePower = async (periodMinutes: number): Promise<number> => {
  try {
    const response = await fetch(`https://backend.powersense.site/api/avg-power-consumption?period=${periodMinutes}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch average power: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const data: { avgPower: string | number } = await response.json(); // Backend returns { avgPower: number }

    // Ensure the value is parsed to a number
    return parseFloat(data.avgPower.toString());
  } catch (error) {
    console.error("Error fetching specific average power:", error);
    throw error;
  }
};