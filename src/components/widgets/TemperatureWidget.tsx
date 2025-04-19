
import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { Thermometer } from 'lucide-react';

const TemperatureWidget = ({ onRemove }: { onRemove?: () => void }) => {
  const [cpuTemp, setCpuTemp] = useState(45);
  const [gpuTemp, setGpuTemp] = useState(65);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuTemp(prev => Math.max(35, Math.min(75, prev + (Math.random() > 0.5 ? 1 : -1))));
      setGpuTemp(prev => Math.max(55, Math.min(85, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BaseWidget 
      title="Temperature" 
      icon={<Thermometer className="h-4 w-4 text-primary" />}
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <div className="text-xs text-muted-foreground mb-1">CPU</div>
            <div className="text-lg font-semibold">
              {cpuTemp}°C
            </div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <div className="text-xs text-muted-foreground mb-1">GPU</div>
            <div className="text-lg font-semibold">
              {gpuTemp}°C
            </div>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default TemperatureWidget;
