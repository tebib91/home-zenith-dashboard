
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Cpu, HardDrive } from 'lucide-react';
import React from 'react';

interface SystemStatProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  color: string;
}

const SystemStat = ({ icon, title, value, maxValue, unit, color }: SystemStatProps) => {
  const percentage = Math.round((value / maxValue) * 100);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${color} rounded-full p-1.5`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} <span className="text-muted-foreground text-sm">{unit}</span>
        </div>
        <Progress
          value={percentage}
          className="h-1.5 mt-3"
          indicatorClassName={color.replace('bg-', 'bg-')}
        />
        <div className="mt-1 text-xs text-muted-foreground">{percentage}% used</div>
      </CardContent>
    </Card>
  );
};

const SystemStats = () => {
  // Mock data - would be replaced with real-time data
  const stats = [
    {
      icon: <Cpu size={16} />,
      title: 'CPU Usage',
      value: 23,
      maxValue: 100,
      unit: '%',
      color: 'bg-primary/20 text-primary'
    },
    {
      icon: <Activity size={16} />,
      title: 'Memory',
      value: 3.7,
      maxValue: 16,
      unit: 'GB',
      color: 'bg-accent/20 text-accent'
    },
    {
      icon: <HardDrive size={16} />,
      title: 'Disk Space',
      value: 128,
      maxValue: 512,
      unit: 'GB',
      color: 'bg-green-500/20 text-green-500'
    }
  ];

  return (
    <div className="grid grid-rows-1 md:grid-rows-3 gap-4">
      {stats.map((stat, index) => (
        <SystemStat key={index} {...stat} />
      ))}
    </div>
  );
};

export default SystemStats;
