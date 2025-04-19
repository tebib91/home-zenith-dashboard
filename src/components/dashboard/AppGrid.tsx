
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AppCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isOnline: boolean;
  cpu: number;
  memory: number;
  url: string;
}

const AppCard = ({ name, description, icon, isOnline, cpu, memory, url }: AppCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden glass-card gradient-border">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="app-icon">{icon}</div>
          <Badge variant={isOnline ? "default" : "outline"} className={`${isOnline ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-destructive/20 text-destructive hover:bg-destructive/30'}`}>
            {isOnline ? (
              <><CircleCheck className="mr-1 h-3 w-3" /> Online</>
            ) : (
              <><CircleX className="mr-1 h-3 w-3" /> Offline</>
            )}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">CPU</span>
            <span className="font-medium">{cpu}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Memory</span>
            <span className="font-medium">{memory} MB</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => window.open(url, '_blank')}>
          Open App
        </Button>
      </CardFooter>
    </Card>
  );
};

const AppGrid = () => {
  // Mock data - would be replaced with real data from Docker API
  const apps: AppCardProps[] = [
    {
      id: 'nextcloud',
      name: 'Nextcloud',
      description: 'Self-hosted productivity platform and file sync & share.',
      icon: '📁',
      isOnline: true,
      cpu: 2.5,
      memory: 245,
      url: 'http://localhost:8080'
    },
    {
      id: 'plex',
      name: 'Plex',
      description: 'Stream movies, TV shows, music, and more.',
      icon: '🎬',
      isOnline: true,
      cpu: 8.3,
      memory: 478,
      url: 'http://localhost:32400'
    },
    {
      id: 'homeassistant',
      name: 'Home Assistant',
      description: 'Open-source home automation platform.',
      icon: '🏠',
      isOnline: true,
      cpu: 5.1,
      memory: 325,
      url: 'http://localhost:8123'
    },
    {
      id: 'pihole',
      name: 'Pi-hole',
      description: 'Network-level advertisement and Internet tracker blocking.',
      icon: '🛡️',
      isOnline: true,
      cpu: 1.2,
      memory: 87,
      url: 'http://localhost:8081'
    },
    {
      id: 'jellyfin',
      name: 'Jellyfin',
      description: 'Media system that puts you in control of your media.',
      icon: '📺',
      isOnline: false,
      cpu: 0,
      memory: 0,
      url: 'http://localhost:8096'
    },
    {
      id: 'bitwarden',
      name: 'Bitwarden',
      description: 'Open source password management solution.',
      icon: '🔑',
      isOnline: true,
      cpu: 0.8,
      memory: 112,
      url: 'http://localhost:8097'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {apps.map((app) => (
        <AppCard key={app.id} {...app} />
      ))}
    </div>
  );
};

export default AppGrid;
