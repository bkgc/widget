import './App.css';
import './widget/styles/style.css';

import { WidgetContainer } from './widget/components/widget-container.tsx';
import { Button, HeroUIProvider } from '@heroui/react';

function App() {
  return (
    <div
      className='w-screen h-screen relative'>
      <div
        className='absolute bottom-0 w-full h-96 bg-red-300 flex justify-center items-center'>
        <Button
          className='bg-gray-500'>
          dwd
        </Button>
      </div>
      <HeroUIProvider>
        <div
          className='absolute inset-0 right-2 bottom-2 z-[9999999] '>
          <div
            className='relative w-full h-full '>
            <WidgetContainer clientKey={'widget'} apiUrl={'http://localhost:8000'} />
          </div>
        </div>

      </HeroUIProvider>
    </div>
  );
}

export default App;
