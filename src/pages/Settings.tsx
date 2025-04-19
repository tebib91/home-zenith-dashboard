
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserSettings from '@/components/settings/UserSettings';
import SystemSettings from '@/components/settings/SystemSettings';

const Settings = () => {
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground">
        Manage your account and system settings
      </p>
      
      <Tabs defaultValue="user" className="mt-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user" className="mt-6">
          <UserSettings />
        </TabsContent>
        
        <TabsContent value="system" className="mt-6">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
