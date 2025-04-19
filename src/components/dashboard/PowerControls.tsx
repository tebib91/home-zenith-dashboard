
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { PowerOff, Reboot, Activity } from 'lucide-react';
import { toast } from 'sonner';

const PowerControls = () => {
  const [isRebooting, setIsRebooting] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const handleReboot = () => {
    setIsRebooting(true);
    // Mock API call for reboot
    setTimeout(() => {
      toast.success('System is rebooting...');
      setIsRebooting(false);
    }, 2000);
  };

  const handleShutdown = () => {
    setIsShuttingDown(true);
    // Mock API call for shutdown
    setTimeout(() => {
      toast.success('System is shutting down...');
      setIsShuttingDown(false);
    }, 2000);
  };

  return (
    <div className="flex space-x-2 mt-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Reboot size={16} />
            <span>Reboot</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reboot System</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reboot the system? All services will be temporarily unavailable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReboot} disabled={isRebooting}>
              {isRebooting ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Rebooting...
                </>
              ) : (
                'Reboot'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2">
            <PowerOff size={16} />
            <span>Shutdown</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Shutdown System</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to shut down the system? All services will become unavailable until the system is manually restarted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleShutdown} disabled={isShuttingDown} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isShuttingDown ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Shutting down...
                </>
              ) : (
                'Shutdown'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PowerControls;
