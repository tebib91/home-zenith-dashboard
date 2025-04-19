
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppGrid from '@/components/dashboard/AppGrid';
import { Plus, Search } from 'lucide-react';

const Apps = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">
            Manage your installed applications and containers
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search apps..."
              className="pl-8 w-[200px] md:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="flex items-center gap-1">
            <Plus size={16} />
            <span>Add App</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="installed">
        <TabsList>
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="installed" className="mt-6">
          <AppGrid />
        </TabsContent>
        
        <TabsContent value="available" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>App Store</CardTitle>
              <CardDescription>
                Browse and install from our curated collection of applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Coming Soon</h3>
                <p className="text-muted-foreground mt-2">
                  The app store feature is currently under development
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Docker Installation</CardTitle>
              <CardDescription>
                Manually add a Docker Compose configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input id="app-name" placeholder="e.g., Nextcloud" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="docker-compose">Docker Compose YAML</Label>
                  <Textarea 
                    id="docker-compose" 
                    placeholder="Paste your docker-compose.yml content here..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                
                <Button className="w-full md:w-auto">
                  Add Container
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Additional component needed for the Apps page
const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </label>
);

const Textarea = ({ id, placeholder, className }: { id: string, placeholder: string, className?: string }) => (
  <textarea
    id={id}
    placeholder={placeholder}
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);

export default Apps;
