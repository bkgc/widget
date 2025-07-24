import './App.css';
import './widget/styles/style.css';

import { WidgetContainer } from './widget/components/widget-container.tsx';
import { Button, HeroUIProvider } from '@heroui/react';

function App() {
  return (
    <>
      {/* <HeroUIProvider>
        <WidgetContainer clientKey={'widget'} apiUrl={'http://localhost:8000'} />
      </HeroUIProvider> */}
      <div>
        <div
          className='w-screen h-screen flex flex-col gap-4 absolute z-[9999]'>
          <Button
            className='absolute'>
            boton
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
