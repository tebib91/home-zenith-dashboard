
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  LayoutGrid, 
  Settings, 
  PowerOff,
  User,
  Clock,
  HardDrive,
  Network,
  Cpu,
  Thermometer,
  Cloud,
  Dock,
  Link,
  Battery
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from '../../assets/logo.svg';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/apps', icon: <LayoutGrid size={20} />, label: 'Apps' },
    { to: '/widgets', icon: <LayoutGrid size={20} />, label: 'Widgets' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const widgetItems = [
    { id: 'battery', icon: <Battery size={20} />, label: 'Battery' },
    { id: 'network', icon: <Network size={20} />, label: 'Network' },
    { id: 'storage', icon: <HardDrive size={20} />, label: 'Storage' },
    { id: 'cpu-ram', icon: <Cpu size={20} />, label: 'CPU & RAM' },
    { id: 'temperature', icon: <Thermometer size={20} />, label: 'Temperature' },
    { id: 'datetime', icon: <Clock size={20} />, label: 'Date & Time' },
    { id: 'weather', icon: <Cloud size={20} />, label: 'Weather' },
    { id: 'docker', icon: <Dock size={20} />, label: 'Docker' },
    { id: 'links', icon: <Link size={20} />, label: 'Links' },
  ];

  const handleAddWidget = (widgetId: string) => {
    // First, navigate to dashboard if not already there
    navigate('/dashboard');
    
    // Create widget event for WidgetGrid to handle
    const event = new CustomEvent('add-widget', { 
      detail: { widgetType: widgetId }
    });
    document.dispatchEvent(event);
    
    // Show toast notification
    toast({
      title: "Widget Added",
      description: `${widgetId.charAt(0).toUpperCase() + widgetId.slice(1)} widget has been added to your dashboard`,
      variant: "default",
    });
    
    // Close sidebar on mobile
    closeSidebar();
  };

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
          "fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-xl bg-sidebar/80 border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0",
          !isMobile && "relative translate-x-0 shrink-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center px-4 border-b border-sidebar-border/50">
            <img src={logo} alt="ZenithOS" className="h-8" />
            <span className="ml-2 text-xl font-bold text-white">ZenithOS</span>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 py-4 overflow-y-auto scrollbar-none">
            <div className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/60 uppercase">
              Navigation
            </div>
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeSidebar}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200",
                      isActive && "bg-sidebar-accent text-primary font-medium"
                    )}
                    end={item.to === '/dashboard'}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            
            {/* Widgets Section */}
            <div className="mt-6 px-3 mb-2 text-xs font-medium text-sidebar-foreground/60 uppercase">
              Available Widgets
            </div>
            <ul className="space-y-1 px-2">
              {widgetItems.map((item) => (
                <li key={item.id} className="group">
                  <button 
                    className="flex items-center w-full gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-all duration-200 group-hover:text-primary"
                    onClick={() => handleAddWidget(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <span className="ml-auto text-xs bg-sidebar-accent/50 px-1.5 py-0.5 rounded text-sidebar-foreground/60 group-hover:bg-primary/20 group-hover:text-primary transition-colors">Add</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Power Options */}
          <div className="p-4 border-t border-sidebar-border/50">
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
