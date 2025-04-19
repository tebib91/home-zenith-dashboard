
import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { Cloud } from 'lucide-react';

const WeatherWidget = ({ onRemove }: { onRemove?: () => void }) => {
  const [temperature, setTemperature] = useState(22);
  const [condition, setCondition] = useState('Partly Cloudy');
  const [humidity, setHumidity] = useState(65);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(prev => Math.max(15, Math.min(30, prev + (Math.random() > 0.5 ? 1 : -1))));
      setHumidity(prev => Math.max(40, Math.min(80, prev + (Math.random() > 0.5 ? 2 : -2))));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BaseWidget 
      title="Weather" 
      icon={<Cloud className="h-4 w-4 text-primary" />}
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">{temperature}°C</div>
            <div className="text-sm text-muted-foreground">{condition}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{humidity}%</div>
            <div className="text-xs text-muted-foreground">Humidity</div>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default WeatherWidget;
