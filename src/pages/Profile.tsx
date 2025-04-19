
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface User {
  email: string;
  name?: string;
  role: string;
  lastLogin: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Mock fetching user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({
        email: userData.email || 'admin@example.com',
        name: userData.name || 'Admin User',
        role: 'Administrator',
        lastLogin: new Date().toLocaleString()
      });
    }
  }, []);
  
  if (!user) {
    return <div className="text-center py-8">Loading profile...</div>;
  }
  
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      <p className="text-muted-foreground">
        View and manage your personal profile
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border/50">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl">
                {user.name?.split(' ').map(n => n[0]).join('') || user.email.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{user.name || 'User'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-sm text-muted-foreground mb-4">
              {user.role}
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{user.email}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Role</div>
                <div>{user.role}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Last Login</div>
                <div>{user.lastLogin}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Account Created</div>
                <div>April 19, 2025</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {['Profile viewed', 'Password changed', 'System settings updated', 'Application added'].map((activity, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span>{activity}</span>
                    <span className="text-muted-foreground">
                      {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
