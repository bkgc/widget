import './App.css';
import './widget/styles/style.css';

import { WidgetContainer } from './widget/components/widget-container.tsx';
import { Button, HeroUIProvider } from '@heroui/react';

function App() {
  return (
    <div
      className='w-screen h-screen relative pointer-events-none'>
      <div
        className='absolute inset-0 z-[9999999] pointer-events-auto'>
        <HeroUIProvider>
          <WidgetContainer clientKey={'widget'} apiUrl={'http://localhost:8000'} />
          <Button
            className='bg-gray-500 '>
            dwd
          </Button>
        </HeroUIProvider>
      </div>


    </div>
  );
}

export default App;
