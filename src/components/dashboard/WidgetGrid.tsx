import React, { useState, useEffect } from 'react';
import CpuRamWidget from '../widgets/CpuRamWidget';
import NetworkWidget from '../widgets/NetworkWidget';
import BatteryWidget from '../widgets/BatteryWidget';
import TemperatureWidget from '../widgets/TemperatureWidget';
import WeatherWidget from '../widgets/WeatherWidget';
import DockerWidget from '../widgets/DockerWidget';
import LinksWidget from '../widgets/LinksWidget';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

type WidgetType = 'cpu-ram' | 'network' | 'battery' | 'storage' | 'temperature' | 'datetime' | 'weather' | 'docker' | 'links';

interface WidgetItem {
  id: string;
  type: WidgetType;
}

const WidgetGrid = () => {
  const [widgets, setWidgets] = useState<WidgetItem[]>([
    { id: 'cpu-ram-1', type: 'cpu-ram' },
    { id: 'network-1', type: 'network' }
  ]);
  
  const { toast } = useToast();
  
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
    toast({
      title: "Widget Removed",
      description: "The widget has been removed from your dashboard",
      variant: "default",
    });
  };
  
  const addWidget = (type: WidgetType) => {
    const newId = `${type}-${Date.now()}`;
    setWidgets([...widgets, { id: newId, type }]);
    toast({
      title: "Widget Added",
      description: `New ${type} widget has been added to your dashboard`,
      variant: "default",
    });
  };
  
  useEffect(() => {
    const handleAddWidgetEvent = (event: CustomEvent) => {
      const { widgetType } = event.detail;
      addWidget(widgetType as WidgetType);
    };
    
    document.addEventListener('add-widget', handleAddWidgetEvent as EventListener);
    
    return () => {
      document.removeEventListener('add-widget', handleAddWidgetEvent as EventListener);
    };
  }, [widgets]);
  
  const renderWidget = (widget: WidgetItem) => {
    switch (widget.type) {
      case 'cpu-ram':
        return <CpuRamWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
      case 'network':
        return <NetworkWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
      case 'battery':
        return <BatteryWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
      case 'temperature':
        return <TemperatureWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
      case 'weather':
        return <WeatherWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
      case 'docker':
        return <DockerWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
      case 'links':
        return <LinksWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Widgets</h3>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Add Widget</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Widget</SheetTitle>
              <SheetDescription>
                Select a widget to add to your dashboard
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => addWidget('cpu-ram')} className="justify-start">
                CPU & RAM Monitor
              </Button>
              <Button onClick={() => addWidget('network')} className="justify-start">
                Network Statistics
              </Button>
              <Button onClick={() => addWidget('battery')} className="justify-start">
                Battery Monitor
              </Button>
              <Button onClick={() => addWidget('storage')} className="justify-start">
                Storage Usage
              </Button>
              <Button onClick={() => addWidget('temperature')} className="justify-start">
                Temperature
              </Button>
              <Button onClick={() => addWidget('datetime')} className="justify-start">
                Date & Time
              </Button>
              <Button onClick={() => addWidget('weather')} className="justify-start">
                Weather
              </Button>
              <Button onClick={() => addWidget('docker')} className="justify-start">
                Docker Status
              </Button>
              <Button onClick={() => addWidget('links')} className="justify-start">
                Quick Links
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map(renderWidget)}
      </div>
    </div>
  );
};

export default WidgetGrid;
