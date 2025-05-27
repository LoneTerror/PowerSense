import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import GaugeCard from './GaugeCard';
import GraphCard from './GraphCard';

const Dashboard: React.FC = () => {
  const { metrics, loading } = useDataContext();

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-accent-primary" />
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          <div className="text-text-secondary text-sm">
            {loading ? 'Updating data...' : 'Last updated: Just now'}
          </div>
        </motion.div>
      </header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <GaugeCard 
          title="CPU Usage" 
          value={metrics.cpuUsage} 
          maxValue={100} 
          suffix="%" 
          color="accent-primary"
        />
        <GaugeCard 
          title="Memory Usage" 
          value={metrics.memoryUsage} 
          maxValue={100} 
          suffix="%" 
          color="accent-secondary"
        />
        <GaugeCard 
          title="Disk Space" 
          value={metrics.diskSpace} 
          maxValue={100} 
          suffix="%" 
          color="accent-success"
        />
        <GaugeCard 
          title="Network Load" 
          value={metrics.networkLoad} 
          maxValue={100} 
          suffix="%" 
          color="accent-warning"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <GraphCard 
          title="Server Response Time" 
          data={metrics.responseTimeHistory} 
          dataKey="value" 
          color="accent-primary" 
          suffix="ms"
        />
        <GraphCard 
          title="Active Users" 
          data={metrics.activeUsersHistory} 
          dataKey="value" 
          color="accent-secondary"
        />
        <GraphCard 
          title="Error Rate" 
          data={metrics.errorRateHistory} 
          dataKey="value" 
          color="accent-danger"
          suffix="%"
        />
        <GraphCard 
          title="Throughput" 
          data={metrics.throughputHistory} 
          dataKey="value" 
          color="accent-success"
          suffix="req/s"
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;