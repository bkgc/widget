import { useState, useEffect } from 'react';
import { WidgetContext } from '../lib/context';
import { Widget } from './widget';

interface WidgetContainerProps {
  clientKey: string;
  apiUrl: string;
}

export function WidgetContainer({ clientKey }: WidgetContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WidgetContext.Provider value={{ isOpen, setIsOpen, clientKey }}>
      <Widget />
    </WidgetContext.Provider>
  );
}