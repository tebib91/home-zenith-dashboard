
import React from 'react';
import SystemStats from '@/components/dashboard/SystemStats';
import AppGrid from '@/components/dashboard/AppGrid';
import PowerControls from '@/components/dashboard/PowerControls';

const Dashboard = () => {
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        Monitor your system and manage your applications
      </p>
      
      <div className="space-y-6">
        <SystemStats />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Applications</h3>
          </div>
          <AppGrid />
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Power Options</h3>
          </div>
          <PowerControls />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
