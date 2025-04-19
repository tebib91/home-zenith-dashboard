
import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { Network, ArrowDown, ArrowUp } from 'lucide-react';

const NetworkWidget = ({ onRemove }: { onRemove?: () => void }) => {
  const [downloadSpeed, setDownloadSpeed] = useState(5.4);
  const [uploadSpeed, setUploadSpeed] = useState(1.2);
  const [connectedDevices, setConnectedDevices] = useState(8);
  
  // Simulate network metrics updating
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadSpeed(parseFloat((Math.random() * 8 + 2).toFixed(1)));
      setUploadSpeed(parseFloat((Math.random() * 2 + 0.5).toFixed(1)));
      setConnectedDevices(Math.floor(Math.random() * 5) + 5);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BaseWidget 
      title="Network" 
      icon={<Network className="h-4 w-4 text-primary" />}
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center bg-primary/10 rounded-md p-2">
            <div className="flex items-center text-primary">
              <ArrowDown className="h-4 w-4 mr-1" />
              <span className="text-xs">Download</span>
            </div>
            <p className="text-lg font-semibold">{downloadSpeed} <span className="text-xs">MB/s</span></p>
          </div>
          
          <div className="flex flex-col items-center bg-accent/10 rounded-md p-2">
            <div className="flex items-center text-accent">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-xs">Upload</span>
            </div>
            <p className="text-lg font-semibold">{uploadSpeed} <span className="text-xs">MB/s</span></p>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-1">
          <span className="text-xs text-muted-foreground">Connected Devices</span>
          <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{connectedDevices}</span>
        </div>
      </div>
    </BaseWidget>
  );
};

export default NetworkWidget;
