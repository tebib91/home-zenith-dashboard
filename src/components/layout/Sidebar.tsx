
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  LayoutGrid, 
  Settings, 
  PowerOff,
  User
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from '../../assets/logo.svg';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/apps', icon: <LayoutGrid size={20} />, label: 'Apps' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0",
          !isMobile && "relative translate-x-0 shrink-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center px-4 border-b border-sidebar-border">
            <img src={logo} alt="ZenithOS" className="h-8" />
            <span className="ml-2 text-xl font-bold text-white">ZenithOS</span>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 py-4 overflow-y-auto scrollbar-none">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeSidebar}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      isActive && "bg-sidebar-accent text-primary font-medium"
                    )}
                    end={item.to === '/'}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Power Options */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="destructive"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <PowerOff size={16} />
              <span>Power Options</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
