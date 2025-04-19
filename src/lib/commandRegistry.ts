import { ReactNode } from 'react';

// Define command types
export type CommandType = 'app' | 'file' | 'page' | 'action';

export interface Command {
  id: string;
  name: string;
  type: CommandType;
  icon?: ReactNode;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

class CommandRegistry {
  private commands: Command[] = [];
  private static instance: CommandRegistry;

  private constructor() {}

  public static getInstance(): CommandRegistry {
    if (!CommandRegistry.instance) {
      CommandRegistry.instance = new CommandRegistry();
    }
    return CommandRegistry.instance;
  }

  public register(command: Command): void {
    // Check if command with same ID already exists
    const existingIndex = this.commands.findIndex(cmd => cmd.id === command.id);

    if (existingIndex >= 0) {
      // Replace existing command
      this.commands[existingIndex] = command;
    } else {
      // Add new command
      this.commands.push(command);
    }
  }

  public registerMany(commands: Command[]): void {
    commands.forEach(command => this.register(command));
  }

  public unregister(commandId: string): void {
    this.commands = this.commands.filter(cmd => cmd.id !== commandId);
  }

  public getAll(): Command[] {
    return [...this.commands];
  }

  public getByType(type: CommandType): Command[] {
    return this.commands.filter(cmd => cmd.type === type);
  }

  public search(query: string): Command[] {
    if (!query) return this.getAll();

    const lowerQuery = query.toLowerCase();

    // Handle developer commands with '>' prefix
    if (lowerQuery.startsWith('>')) {
      const devQuery = lowerQuery.substring(1).trim();
      return this.commands.filter(cmd =>
        cmd.type === 'action' && (
          devQuery === '' ||
          cmd.name.toLowerCase().includes(devQuery) ||
          cmd.keywords?.some(keyword => keyword.toLowerCase().includes(devQuery))
        )
      );
    }

    // Regular search
    return this.commands.filter(cmd =>
      cmd.name.toLowerCase().includes(lowerQuery) ||
      cmd.keywords?.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  }

  public clear(): void {
    this.commands = [];
  }
}

export default CommandRegistry;
