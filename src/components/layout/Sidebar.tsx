import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LayoutGrid, Settings, Store, User } from "lucide-react";
import { NavLink } from "react-router-dom";

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
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={24} />,
      label: "Dashboard",
    },
    { to: "/apps", icon: <Store size={24} />, label: "Apps" },
    { to: "/widgets", icon: <LayoutGrid size={24} />, label: "Widgets" },
    { to: "/settings", icon: <Settings size={24} />, label: "Settings" },
    { to: "/profile", icon: <User size={24} />, label: "Profile" },
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

      {/* Dock */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 right-0 md:bottom-4 md:left-1/2 md:-translate-x-1/2 z-50 md:max-w-[320px] backdrop-blur-xl bg-sidebar/80 border border-sidebar-border rounded-none md:rounded-full transition-transform duration-300 ease-in-out flex flex-row justify-center",
          isMobile && !isOpen && "translate-y-full md:translate-y-0",
          isMobile && isOpen && "translate-y-0",
          !isMobile && "translate-y-0"
        )}
      >
        <div className="flex flex-row items-center justify-between py-2 px-4 md:py-3 md:px-5">
          {/* Navigation Icons */}
          <div className="flex flex-row items-center justify-between gap-3 md:gap-5 w-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  cn(
                    "relative flex items-center justify-center h-10 w-10 rounded-full text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 group",
                    isActive && "bg-sidebar-accent text-primary"
                  )
                }
                end={item.to === "/dashboard"}
              >
                {item.icon}
                <span className="absolute top-full mt-2 px-2 py-1 rounded-md bg-sidebar-accent text-primary text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
