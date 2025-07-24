import './App.css';
import './widget/styles/style.css';

import { WidgetContainer } from './widget/components/widget-container.tsx';
import { HeroUIProvider } from '@heroui/react';

function App() {
  return (
    <>
      <HeroUIProvider>
        <WidgetContainer clientKey={'widget'} apiUrl={'http://localhost:8000'} />

      </HeroUIProvider>
    </>
  );
}

export default App;
