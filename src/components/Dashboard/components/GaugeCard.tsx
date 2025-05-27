import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GaugeCardProps {
  title: string;
  value: number;
  maxValue: number;
  suffix?: string;
  color: string;
}

const GaugeCard: React.FC<GaugeCardProps> = ({ 
  title, 
  value, 
  maxValue, 
  suffix = '', 
  color 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  const getColorClass = () => {
    switch (color) {
      case 'accent-primary': return 'text-accent-primary';
      case 'accent-secondary': return 'text-accent-secondary';
      case 'accent-success': return 'text-accent-success';
      case 'accent-warning': return 'text-accent-warning';
      case 'accent-danger': return 'text-accent-danger';
      default: return 'text-accent-primary';
    }
  };

  const getGaugeColor = () => {
    switch (color) {
      case 'accent-primary': return '#3b82f6';
      case 'accent-secondary': return '#6366f1';
      case 'accent-success': return '#10b981';
      case 'accent-warning': return '#f59e0b';
      case 'accent-danger': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = rect.width / 2;
    const centerY = rect.height - 10;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#2c3e50';
    ctx.stroke();

    const valueAngle = Math.PI - (percentage / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, valueAngle, true);
    ctx.lineWidth = 10;
    
    const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    gradient.addColorStop(0, getGaugeColor() + '80');
    gradient.addColorStop(1, getGaugeColor());
    ctx.strokeStyle = gradient;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    
  }, [value, maxValue, color, percentage]);

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="dashboard-card flex flex-col"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="gauge-container">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        ></canvas>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getColorClass()}`}>
            {value.toFixed(1)}
          </span>
          <span className="text-text-secondary text-sm">
            {suffix}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GaugeCard;