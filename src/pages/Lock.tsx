import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Eye, EyeOff, Lock as LockIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LockScreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user exists, redirect to setup
      navigate('/setup');
    }
  }, [navigate]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - would be replaced with actual auth
    setTimeout(() => {
      if (password === 'password') { // Replace with actual auth logic
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Unlocked successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Incorrect password');
        setPassword('');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (!user) return null; // Don't render until user is loaded

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-background/30 z-0" />

      {/* Time display */}
      <div className="absolute top-10 text-center w-full">
        <h1 className="text-6xl font-light text-foreground/90">
          {format(currentTime, 'HH:mm')}
        </h1>
        <p className="text-xl text-foreground/70 mt-2">
          {format(currentTime, 'EEEE, MMMM d')}
        </p>
      </div>

      <Card className="w-full max-w-md border-border/50 bg-background/60 backdrop-blur-md z-10 shadow-xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            {user.name ? (
              <span className="text-3xl font-medium text-primary">
                {user.name?.split(' ').map(n => n[0]).join('') || user.email.substring(0, 2).toUpperCase()}
              </span>
            ) : (
              <LockIcon className="h-10 w-10 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋</CardTitle>
          <CardDescription>
            Enter your password to unlock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Unlocking...' : 'Unlock'}
            </Button>
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                type="button"
              >
                Log Out
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
              >
                Forgot Password?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LockScreen;
