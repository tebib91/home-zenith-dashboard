
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const SystemSettings = () => {
  const [hostName, setHostName] = useState('zenith-server');
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [sshEnabled, setSshEnabled] = useState(true);
  const [timeZone, setTimeZone] = useState('UTC');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
