
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface BaseWidgetProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onRemove?: () => void;
  onConfigure?: () => void;
  onRefresh?: () => void;
  className?: string;
}

const BaseWidget = ({
  title,
  icon,
  children,
  onRemove,
  onConfigure,
  onRefresh,
  className = ''
}: BaseWidgetProps) => {
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onRefresh && <DropdownMenuItem onClick={onRefresh}>Refresh</DropdownMenuItem>}
            {onConfigure && <DropdownMenuItem onClick={onConfigure}>Configure</DropdownMenuItem>}
            {onRemove && (
              <DropdownMenuItem className="text-destructive" onClick={onRemove}>
                Remove
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-3">
        {children}
      </CardContent>
    </Card>
  );
};

export default BaseWidget;
