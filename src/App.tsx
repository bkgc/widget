

import { WidgetContainer } from './widget/components/widget-container.tsx';

function App() {
  return (
    <div
      className='bg-red-300 w-screen h-screen relative inset-0 z-[99999] pointer-events-auto'>
      <WidgetContainer clientKey={'widget'} apiUrl={'http://localhost:8000'} />
      <button>
        hola
      </button>
    </div>
  );
}

export default App;
