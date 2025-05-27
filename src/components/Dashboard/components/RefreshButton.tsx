import React from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDataContext } from '../context/DataContext';

interface RefreshButtonProps {
  className?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ className = '' }) => {
  const { refreshData, loading } = useDataContext();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={refreshData}
      disabled={loading}
      className={`p-2 rounded-full bg-background-light hover:bg-background-lighter 
      transition-colors duration-200 focus:outline-none focus:ring-2 
      focus:ring-accent-primary focus:ring-opacity-50 ${className}`}
      aria-label="Refresh dashboard data"
    >
      <RefreshCw 
        size={18} 
        className={`text-text-primary ${loading ? 'animate-spin' : ''}`} 
      />
    </motion.button>
  );
};

export default RefreshButton;