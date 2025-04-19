
import React from 'react';
import BaseWidget from './BaseWidget';
import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LinksWidget = ({ onRemove }: { onRemove?: () => void }) => {
  const links = [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Gmail', url: 'https://gmail.com' },
    { name: 'Drive', url: 'https://drive.google.com' },
    { name: 'Calendar', url: 'https://calendar.google.com' }
  ];
  
  return (
    <BaseWidget 
      title="Quick Links" 
      icon={<Link className="h-4 w-4 text-primary" />}
      onRemove={onRemove}
    >
      <div className="grid grid-cols-2 gap-2">
        {links.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(link.url, '_blank')}
          >
            {link.name}
          </Button>
        ))}
      </div>
    </BaseWidget>
  );
};

export default LinksWidget;
