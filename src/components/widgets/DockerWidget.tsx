
import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { Dock } from 'lucide-react';

const DockerWidget = ({ onRemove }: { onRemove?: () => void }) => {
  const [containers, setContainers] = useState([
    { name: 'nginx', status: 'running', cpu: '0.5%', memory: '128MB' },
    { name: 'postgres', status: 'running', cpu: '1.2%', memory: '256MB' },
    { name: 'redis', status: 'stopped', cpu: '0%', memory: '0MB' }
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setContainers(prev => prev.map(container => ({
        ...container,
        cpu: container.status === 'running' ? `${(Math.random() * 2).toFixed(1)}%` : '0%',
        memory: container.status === 'running' ? `${Math.floor(Math.random() * 300)}MB` : '0MB'
      })));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BaseWidget 
      title="Docker Status" 
      icon={<Dock className="h-4 w-4 text-primary" />}
      onRemove={onRemove}
    >
      <div className="space-y-2">
        {containers.map((container, index) => (
          <div key={container.name} className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
            <div>
              <div className="text-sm font-medium">{container.name}</div>
              <div className={`text-xs ${container.status === 'running' ? 'text-green-500' : 'text-red-500'}`}>
                {container.status}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{container.cpu}</div>
              <div className="text-xs text-muted-foreground">{container.memory}</div>
            </div>
          </div>
        ))}
      </div>
    </BaseWidget>
  );
};

export default DockerWidget;
