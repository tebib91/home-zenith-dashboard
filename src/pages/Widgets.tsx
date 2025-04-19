
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Battery, Network, HardDrive, Cpu, Thermometer, Clock, Cloud, Docker, Link, Music } from 'lucide-react';

interface WidgetItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'system' | 'network' | 'media' | 'tools';
  enabled: boolean;
}

const Widgets = () => {
  const [widgets, setWidgets] = useState<WidgetItem[]>([
    {
      id: 'battery',
      name: 'Battery Monitor',
      description: 'Tracks battery level and status',
      icon: <Battery className="h-10 w-10 text-primary" />,
      category: 'system',
      enabled: true
    },
    {
      id: 'network',
      name: 'Network Monitor',
      description: 'Shows network speed and connected devices',
      icon: <Network className="h-10 w-10 text-primary" />,
      category: 'network',
      enabled: true
    },
    {
      id: 'storage',
      name: 'Disk Space',
      description: 'Monitors storage usage across volumes',
      icon: <HardDrive className="h-10 w-10 text-primary" />,
      category: 'system',
      enabled: true
    },
    {
      id: 'cpu-ram',
      name: 'CPU & RAM',
      description: 'Real-time system resource monitoring',
      icon: <Cpu className="h-10 w-10 text-primary" />,
      category: 'system',
      enabled: true
    },
    {
      id: 'temperature',
      name: 'Temperature',
      description: 'Hardware temperature sensors',
      icon: <Thermometer className="h-10 w-10 text-primary" />,
      category: 'system',
      enabled: false
    },
    {
      id: 'datetime',
      name: 'Date & Time',
      description: 'Customizable date and time display',
      icon: <Clock className="h-10 w-10 text-primary" />,
      category: 'tools',
      enabled: true
    },
    {
      id: 'weather',
      name: 'Weather',
      description: 'Local weather conditions and forecast',
      icon: <Cloud className="h-10 w-10 text-primary" />,
      category: 'tools',
      enabled: false
    },
    {
      id: 'docker',
      name: 'Docker Status',
      description: 'Container status and resource usage',
      icon: <Docker className="h-10 w-10 text-primary" />,
      category: 'system',
      enabled: true
    },
    {
      id: 'links',
      name: 'Quick Links',
      description: 'Custom link launcher for quick access',
      icon: <Link className="h-10 w-10 text-primary" />,
      category: 'tools',
      enabled: true
    },
    {
      id: 'media',
      name: 'Media Player',
      description: 'Basic media player controls',
      icon: <Music className="h-10 w-10 text-primary" />,
      category: 'media',
      enabled: false
    }
  ]);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Widgets</h2>
        <p className="text-muted-foreground">
          Customize your dashboard with these widgets
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Widgets</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map(widget => (
              <WidgetCard 
                key={widget.id} 
                widget={widget} 
                onToggle={() => toggleWidget(widget.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        {['system', 'network', 'media', 'tools'].map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {widgets
                .filter(widget => widget.category === category)
                .map(widget => (
                  <WidgetCard 
                    key={widget.id} 
                    widget={widget} 
                    onToggle={() => toggleWidget(widget.id)}
                  />
                ))
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface WidgetCardProps {
  widget: WidgetItem;
  onToggle: () => void;
}

const WidgetCard = ({ widget, onToggle }: WidgetCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${widget.enabled ? 'border-primary/30' : 'opacity-80'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {widget.icon}
            <div>
              <CardTitle>{widget.name}</CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Switch id={`widget-${widget.id}`} checked={widget.enabled} onCheckedChange={onToggle} />
          <Label htmlFor={`widget-${widget.id}`}>
            {widget.enabled ? 'Enabled' : 'Disabled'}
          </Label>
        </div>
        <Button variant="outline" size="sm">Configure</Button>
      </CardFooter>
    </Card>
  );
};

export default Widgets;
