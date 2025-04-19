
import React, { useState } from 'react';
import CpuRamWidget from '../widgets/CpuRamWidget';
import NetworkWidget from '../widgets/NetworkWidget';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type WidgetType = 'cpu-ram' | 'network';

interface WidgetItem {
  id: string;
  type: WidgetType;
}

const WidgetGrid = () => {
  const [widgets, setWidgets] = useState<WidgetItem[]>([
    { id: 'cpu-ram-1', type: 'cpu-ram' },
    { id: 'network-1', type: 'network' }
  ]);
  
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };
  
  const addWidget = (type: WidgetType) => {
    const newId = `${type}-${Date.now()}`;
    setWidgets([...widgets, { id: newId, type }]);
  };
  
  const renderWidget = (widget: WidgetItem) => {
    switch (widget.type) {
      case 'cpu-ram':
        return <CpuRamWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
      case 'network':
        return <NetworkWidget key={widget.id} onRemove={() => removeWidget(widget.id)} />;
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
