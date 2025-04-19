
import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { Cpu } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const CpuRamWidget = ({ onRemove }: { onRemove?: () => void }) => {
  const [cpuUsage, setCpuUsage] = useState(23);
  const [ramUsage, setRamUsage] = useState(41);
  
  // In a real implementation, this would connect to a backend API
  // to fetch actual system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating fluctuating CPU and RAM usage with random values
      setCpuUsage(Math.floor(Math.random() * 60) + 10);
      setRamUsage(Math.floor(Math.random() * 50) + 30);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BaseWidget 
      title="CPU & RAM Usage" 
      icon={<Cpu className="h-4 w-4 text-primary" />}
      onRemove={onRemove}
      onRefresh={() => {
        setCpuUsage(Math.floor(Math.random() * 60) + 10);
        setRamUsage(Math.floor(Math.random() * 50) + 30);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">CPU</span>
            <span className="text-xs font-medium">{cpuUsage}%</span>
          </div>
          <Progress 
            value={cpuUsage} 
            className="h-1.5" 
            indicatorClassName="bg-primary"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Memory</span>
            <span className="text-xs font-medium">{ramUsage}%</span>
          </div>
          <Progress 
            value={ramUsage} 
            className="h-1.5" 
            indicatorClassName="bg-primary"
          />
        </div>
      </div>
    </BaseWidget>
  );
};

export default CpuRamWidget;
