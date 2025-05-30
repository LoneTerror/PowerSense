// src/components/Dashboard/components/GaugeCard.tsx

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react'; // Import Loader2 for a spinner icon

interface GaugeCardProps {
  title: string;
  value: number | null | undefined; // IMPORTANT: Allow value to be null or undefined
  maxValue: number;
  suffix?: string;
  color: string;
  isLoading?: boolean; // Added isLoading prop
  error?: string | null; // Added error prop
}

const GaugeCard: React.FC<GaugeCardProps> = ({
  title,
  value,
  maxValue,
  suffix = '',
  color,
  isLoading = false, // Default to false
  error = null,      // Default to null
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use a safe value for calculations and display. Default to 0 if value is null or undefined.
  const safeValue = value ?? 0;

  // Calculate the percentage of the gauge filled, capping at 100%
  const percentage = Math.min(100, (safeValue / maxValue) * 100);

  /**
   * Determines the Tailwind CSS text color class based on the color prop.
   * @returns The Tailwind CSS class string.
   */
  const getColorClass = () => {
    switch (color) {
      case 'text-accent-primary':
        return 'text-accent-primary';
      case 'text-accent-secondary':
        return 'text-accent-secondary';
      case 'text-accent-success':
        return 'text-accent-success';
      case 'text-accent-warning':
        return 'text-accent-warning';
      case 'text-accent-danger':
        return 'text-accent-danger';
      case 'text-indigo-500': // Added for the new Avg Consumption card
        return 'text-indigo-500';
      default:
        return 'text-accent-primary';
    }
  };

  /**
   * Determines the hex color code for the gauge arc based on the color prop.
   * @returns The hex color string.
   */
  const getGaugeColor = () => {
    switch (color) {
      case 'text-accent-primary': return '#3b82f6'; // Blue
      case 'text-accent-secondary': return '#6366f1'; // Indigo/Purple
      case 'text-accent-success': return '#10b981'; // Green
      case 'text-accent-warning': return '#f59e0b'; // Orange
      case 'text-accent-danger': return '#ef4444'; // Red
      case 'text-indigo-500': return '#6366f1'; // Indigo for Avg Consumption
      default: return '#3b82f6';
    }
  };

  // Effect hook to draw/update the gauge on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Only draw the gauge if not loading and no error
    if (isLoading || error) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas if showing loading/error
      return;
    }

    // Adjust for device pixel ratio to ensure crisp rendering on high-DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    // Calculate center and radius for the semi-circle gauge
    const centerX = rect.width / 2;
    const centerY = rect.height - 10; // Position lower to make it a semi-circle
    const radius = Math.min(centerX, centerY) - 10; // Ensure it fits within the canvas

    // Draw background arc (full semi-circle)
    ctx.beginPath();
    // Arc starts at Math.PI (left) and ends at 0 (right), counter-clockwise
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
    ctx.lineWidth = 10; // Thickness of the arc
    ctx.strokeStyle = 'rgba(44, 62, 80, 0.3)'; // Transparent dark blue for background
    ctx.stroke();

    // Draw value arc (filled portion of the gauge)
    // Calculate the end angle based on the percentage
    const valueAngle = Math.PI - (percentage / 100) * Math.PI;
    ctx.beginPath();
    // Arc starts at Math.PI (left) and goes towards valueAngle (clockwise)
    ctx.arc(centerX, centerY, radius, Math.PI, valueAngle, true);
    ctx.lineWidth = 10;

    // Create a linear gradient for the value arc for a smoother look
    const baseColor = getGaugeColor();
    const gradient = ctx.createLinearGradient(
      centerX - radius,
      centerY,
      centerX + radius,
      centerY
    );
    gradient.addColorStop(0, baseColor + '80'); // Start with 50% opacity
    gradient.addColorStop(1, baseColor); // End with full opacity
    ctx.strokeStyle = gradient;
    ctx.stroke();

    // Draw inner fill circle with some transparency for visual depth
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI); // Smaller circle inside
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)'; // Semi-transparent dark fill
    ctx.fill();
  }, [safeValue, maxValue, color, percentage, isLoading, error]); // Redraw when these props change (use safeValue)

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="dashboard-card flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-md" // Added some basic styling
    >
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <div className="relative w-full h-40 flex items-center justify-center"> {/* Centered content */}
        {isLoading ? (
          <div className="flex flex-col items-center text-accent-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-2 text-sm text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-2 text-sm">
            <p>Error:</p>
            <p>{error}</p>
            <p>Backend Process is in Shutdown State</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className="w-full h-full absolute top-0 left-0" // Absolute positioning for canvas
              style={{ width: '100%', height: '100%' }} // Ensure canvas fills its container
            ></canvas>
            {/* Value and suffix displayed on top of the gauge */}
            <div className="absolute bottom-1/4 flex items-baseline gap-1"> {/* Adjusted position */}
              <span className={`text-3xl font-bold ${getColorClass()}`}>
                {safeValue.toFixed(1)} {/* Use safeValue here to prevent 'toFixed' on undefined */}
              </span>
              <span className="text-gray-400 text-sm">{suffix}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GaugeCard;
