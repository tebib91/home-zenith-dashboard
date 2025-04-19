import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SessionOptions {
  inactivityTimeout?: number; // in milliseconds
  checkInterval?: number; // in milliseconds
}

export function useSession(options: SessionOptions = {}) {
  const {
    inactivityTimeout = 10 * 60 * 1000, // 10 minutes default
    checkInterval = 60 * 1000, // 1 minute default
  } = options;

  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isActive, setIsActive] = useState<boolean>(true);
  const navigate = useNavigate();

  // Update last activity time
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsActive(true);
  }, []);

  // Lock the screen
  const lockScreen = useCallback(() => {
    setIsActive(false);
    navigate('/lock');
  }, [navigate]);

  // Check if session is expired
  useEffect(() => {
    const handleActivity = () => {
      updateActivity();
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('touchmove', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Check for inactivity periodically
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity > inactivityTimeout) {
        lockScreen();
      }
    }, checkInterval);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('touchmove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInterval(intervalId);
    };
  }, [lastActivity, inactivityTimeout, checkInterval, updateActivity, lockScreen]);

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if session is still valid when returning to the tab
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
          updateActivity();
        } else {
          navigate('/login');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, updateActivity]);

  return {
    isActive,
    updateActivity,
    lockScreen,
  };
}
