import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut
} from '@/components/ui/command';
import { Command, FileText, Lock, RefreshCw, Settings, Store, Terminal } from 'lucide-react';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define command types
type CommandType = 'app' | 'file' | 'page' | 'action';

interface CommandItem {
  id: string;
  name: string;
  type: CommandType;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Toggle command palette with Cmd+K or Ctrl+K
  useHotkeys(['meta+k', 'ctrl+k'], (event) => {
    event.preventDefault();
    setOpen((open) => !open);
  });

  // Lock screen with Cmd+L or Ctrl+L
  useHotkeys(['meta+l', 'ctrl+l'], (event) => {
    event.preventDefault();
    navigate('/lock');
  });

  // Show keyboard shortcuts with Cmd+/
  useHotkeys(['meta+/', 'ctrl+/'], (event) => {
    event.preventDefault();
    toast.info('Keyboard shortcuts', {
      description: 'Cmd+K: Command Palette, Cmd+L: Lock Screen, Cmd+/: Show Shortcuts',
    });
  });

  // Advanced developer commands with Cmd+Shift+P
  useHotkeys(['meta+shift+p', 'ctrl+shift+p'], (event) => {
    event.preventDefault();
    setOpen(true);
    setSearch('>');
  });

  // Mock loading state for commands that need to fetch data
  const runWithLoading = (callback: () => void) => {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
      setOpen(false);
    }, 500);
  };

  // Define available commands
  const commands: CommandItem[] = [
    // Apps
    {
      id: "docker",
      name: "Docker Dashboard",
      type: "app",
      icon: <Store className="mr-2 h-4 w-4" />,
      action: () => runWithLoading(() => navigate("/apps")),
    },
    {
      id: "terminal",
      name: "Terminal",
      type: "app",
      icon: <Terminal className="mr-2 h-4 w-4" />,
      action: () => toast.info("Terminal would open here"),
    },

    // Pages
    {
      id: "dashboard",
      name: "Go to Dashboard",
      type: "page",
      icon: <Command className="mr-2 h-4 w-4" />,
      action: () => runWithLoading(() => navigate("/dashboard")),
    },
    {
      id: "settings",
      name: "Open Settings",
      type: "page",
      icon: <Settings className="mr-2 h-4 w-4" />,
      action: () => runWithLoading(() => navigate("/settings")),
    },
    {
      id: "widgets",
      name: "Manage Widgets",
      type: "page",
      icon: <Widget className="mr-2 h-4 w-4" />,
      action: () => runWithLoading(() => navigate("/widgets")),
    },

    // Files
    {
      id: "documents",
      name: "Browse Documents",
      type: "file",
      icon: <FileText className="mr-2 h-4 w-4" />,
      action: () => toast.info("File browser would open here"),
    },

    // Actions
    {
      id: "lock",
      name: "Lock Screen",
      type: "action",
      icon: <Lock className="mr-2 h-4 w-4" />,
      shortcut: "⌘L",
      action: () => navigate("/lock"),
    },
    {
      id: "restart",
      name: "Restart Server",
      type: "action",
      icon: <RefreshCw className="mr-2 h-4 w-4" />,
      action: () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
          loading: "Restarting server...",
          success: "Server restarted successfully",
          error: "Failed to restart server",
        });
        setOpen(false);
      },
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter((command) => {
    if (!search) return true;

    // Handle developer commands with '>' prefix
    if (search.startsWith('>')) {
      const devSearch = search.substring(1).toLowerCase().trim();
      return command.type === 'action' &&
        (devSearch === '' || command.name.toLowerCase().includes(devSearch));
    }

    return command.name.toLowerCase().includes(search.toLowerCase());
  });

  // Group commands by type
  const appCommands = filteredCommands.filter((command) => command.type === 'app');
  const pageCommands = filteredCommands.filter((command) => command.type === 'page');
  const fileCommands = filteredCommands.filter((command) => command.type === 'file');
  const actionCommands = filteredCommands.filter((command) => command.type === 'action');

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex space-x-1">
              <div className="h-1 w-1 bg-primary rounded-full"></div>
              <div className="h-1 w-1 bg-primary rounded-full"></div>
              <div className="h-1 w-1 bg-primary rounded-full"></div>
            </div>
          </div>
        )}
        {!loading && (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {appCommands.length > 0 && (
              <CommandGroup heading="Apps">
                {appCommands.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={command.action}
                  >
                    {command.icon}
                    <span>{command.name}</span>
                    {command.shortcut && (
                      <CommandShortcut>{command.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {pageCommands.length > 0 && (
              <CommandGroup heading="Pages">
                {pageCommands.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={command.action}
                  >
                    {command.icon}
                    <span>{command.name}</span>
                    {command.shortcut && (
                      <CommandShortcut>{command.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {fileCommands.length > 0 && (
              <CommandGroup heading="Files">
                {fileCommands.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={command.action}
                  >
                    {command.icon}
                    <span>{command.name}</span>
                    {command.shortcut && (
                      <CommandShortcut>{command.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {actionCommands.length > 0 && (
              <CommandGroup heading="Actions">
                {actionCommands.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={command.action}
                  >
                    {command.icon}
                    <span>{command.name}</span>
                    {command.shortcut && (
                      <CommandShortcut>{command.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </CommandDialog>
    </>
  );
};

export default CommandPalette;
