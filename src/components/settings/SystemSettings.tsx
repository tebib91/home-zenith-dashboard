import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Battery, Server } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SystemSettings = () => {
  const [hostName, setHostName] = useState('zenith-server');
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [sshEnabled, setSshEnabled] = useState(true);
  const [timeZone, setTimeZone] = useState('UTC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [batteryInfo] = useState({
    energyEmpty: '0 Wh',
    energyFull: '40.98 Wh',
    energyFullDesign: '54 Wh',
    energyRate: '21.735 W',
    voltage: '16.387 V',
    chargeCycles: 'N/A',
    timeToFull: '42.7 minutes',
    percentage: '62%',
    capacity: '75.8889%'
  });

  const [services] = useState([
    { name: 'Docker', status: 'Running', uptime: '15 days' },
    { name: 'SSH Server', status: 'Running', uptime: '15 days' },
    { name: 'Nginx', status: 'Running', uptime: '15 days' },
    { name: 'PostgreSQL', status: 'Stopped', uptime: '0' }
  ]);

  const handleSaveSettings = () => {
    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      toast.success('System settings updated successfully');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Basic system configuration options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hostname">Hostname</Label>
            <Input
              id="hostname"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timeZone} onValueChange={setTimeZone}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Automatic Updates</div>
              <div className="text-sm text-muted-foreground">
                Keep the system updated automatically
              </div>
            </div>
            <Switch
              checked={autoUpdates}
              onCheckedChange={setAutoUpdates}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">SSH Access</div>
              <div className="text-sm text-muted-foreground">
                Allow remote access via SSH
              </div>
            </div>
            <Switch
              checked={sshEnabled}
              onCheckedChange={setSshEnabled}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Battery className="h-5 w-5 text-primary" />
            <CardTitle>Battery Information</CardTitle>
          </div>
          <CardDescription>
            Detailed battery statistics and health information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Energy Empty</TableCell>
                <TableCell>{batteryInfo.energyEmpty}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Energy Full</TableCell>
                <TableCell>{batteryInfo.energyFull}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Energy Full Design</TableCell>
                <TableCell>{batteryInfo.energyFullDesign}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Energy Rate</TableCell>
                <TableCell>{batteryInfo.energyRate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Voltage</TableCell>
                <TableCell>{batteryInfo.voltage}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Charge Cycles</TableCell>
                <TableCell>{batteryInfo.chargeCycles}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Time to Full</TableCell>
                <TableCell>{batteryInfo.timeToFull}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Percentage</TableCell>
                <TableCell>{batteryInfo.percentage}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Capacity</TableCell>
                <TableCell>{batteryInfo.capacity}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <CardTitle>System Services</CardTitle>
          </div>
          <CardDescription>
            Monitor and control system services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.name}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {service.status}
                    </span>
                  </TableCell>
                  <TableCell>{service.uptime}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.success(`${service.name} service ${service.status === 'Running' ? 'stopped' : 'started'}`)}
                    >
                      {service.status === 'Running' ? 'Stop' : 'Start'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Docker Settings</CardTitle>
          <CardDescription>
            Configure Docker environment settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="docker-path">Docker Compose Path</Label>
            <Input
              id="docker-path"
              defaultValue="/opt/docker/compose"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Directory where your docker-compose files are stored
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Auto Restart Containers</div>
              <div className="text-sm text-muted-foreground">
                Automatically restart failed containers
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Docker System Prune</div>
              <div className="text-sm text-muted-foreground">
                Run system prune weekly to clean up unused resources
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast.success('Docker settings saved')}>
            Save Docker Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SystemSettings;
