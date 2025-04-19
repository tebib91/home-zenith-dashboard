
import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { Battery } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const BatteryWidget = ({ onRemove }: { onRemove?: () => void }) => {
  const [level, setLevel] = useState(80);
  const [charging, setCharging] = useState(false);
  
  useEffect(() => {
    // Simulate battery updates
    const interval = setInterval(() => {
      setLevel(prev => Math.max(5, Math.min(100, prev + (Math.random() > 0.5 ? 1 : -1))));
      setCharging(Math.random() > 0.7);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BaseWidget 
      title="Battery" 
      icon={<Battery className="h-4 w-4 text-primary" />}
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Battery Level</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">{level}%</span>
              {charging && <span className="text-xs text-green-500">Charging</span>}
            </div>
          </div>
          <Progress value={level} className="h-1.5" />
        </div>
      </div>
    </BaseWidget>
  );
};

export default BatteryWidget;
