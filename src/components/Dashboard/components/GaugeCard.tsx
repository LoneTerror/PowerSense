// src/components/Dashboard/components/GaugeCard.tsx

import React, { useEffect, useRef, useState } from 'react'; // Import useState
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GaugeCardProps {
  title: string;
  value: number | null | undefined;
  maxValue: number;
  suffix?: string;
  color: string;
  isLoading?: boolean;
  error?: string | null;
}

const GaugeCard: React.FC<GaugeCardProps> = ({
  title,
  value,
  maxValue,
  suffix = '',
  color,
  isLoading = false,
  error = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // State to track dark mode

  // Use a safe value for calculations and display. Default to 0 if value is null or undefined.
  const safeValue = value ?? 0;

  // Calculate the percentage of the gauge filled, capping at 100%
  const percentage = Math.min(100, (safeValue / maxValue) * 100);

  // Effect to detect and react to dark mode changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkTheme();

    // Observe changes to the 'dark' class on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Cleanup observer
    return () => observer.disconnect();
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount


  /**
   * Determines the Tailwind CSS text color class based on the color prop.
   * This is for the numeric value displayed on the card.
   * @returns The Tailwind CSS class string.
   */
  const getColorClass = () => {
    // These Tailwind classes are typically defined in your Tailwind config
    // and map to specific colors. They should remain consistent.
    switch (color) {
      case 'text-accent-primary': return 'text-accent-primary';
      case 'text-accent-secondary': return 'text-accent-secondary';
      case 'text-accent-success': return 'text-accent-success';
      case 'text-accent-warning': return 'text-accent-warning';
      case 'text-accent-danger': return 'text-accent-danger';
      case 'text-indigo-500': return 'text-indigo-500';
      default: return 'text-accent-primary';
    }
  };

  /**
   * Determines the hex color code for the gauge arc based on the color prop.
   * Colors are chosen to look good in both dark and light modes,
   * with a slight adjustment for light mode if needed.
   * @returns The hex color string.
   */
  const getGaugeColor = () => {
    // These are the primary colors for the filled part of the gauge
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

    // Draw background arc (full semi-circle) - Conditionally styled
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
    ctx.lineWidth = 10; // Thickness of the arc
    ctx.strokeStyle = isDarkMode ? 'rgba(44, 62, 80, 0.3)' : '#e0e0e0'; // Dark or Light grey
    ctx.stroke();

    // Draw value arc (filled portion of the gauge)
    const valueAngle = Math.PI - (percentage / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, valueAngle, true);
    ctx.lineWidth = 10;

    const baseColor = getGaugeColor();
    const gradient = ctx.createLinearGradient(
      centerX - radius,
      centerY,
      centerX + radius,
      centerY
    );
    gradient.addColorStop(0, baseColor + '80');
    gradient.addColorStop(1, baseColor);
    ctx.strokeStyle = gradient;
    ctx.stroke();

    // Draw inner fill circle with some transparency for visual depth - Conditionally styled
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI); // Smaller circle inside
    ctx.fillStyle = isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(240, 240, 240, 0.8)'; // Dark or Light grey fill
    ctx.fill();
  }, [safeValue, maxValue, color, percentage, isLoading, error, title, isDarkMode]); // Added isDarkMode to dependencies

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      // Conditionally apply background and text colors using Tailwind's dark: prefix
      className={`dashboard-card flex flex-col items-center p-4 rounded-lg shadow-md
                  ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
    >
      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>
      <div className="relative w-full h-40 flex items-center justify-center">
        {isLoading ? (
          <div className={`flex flex-col items-center ${getColorClass()}`}>
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-2 text-sm">
            <p>Error:</p>
            <p>{error}</p>
            <p>Backend Process Detected in Shutdown State</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className="w-full h-full absolute top-0 left-0"
              style={{ width: '100%', height: '100%' }}
            ></canvas>
            {/* Value and suffix displayed on top of the gauge */}
            <div className="absolute bottom-1/4 flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${getColorClass()}`}>
                {safeValue.toFixed(1)}
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{suffix}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GaugeCard;