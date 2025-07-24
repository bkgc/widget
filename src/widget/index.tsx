import { createRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
import './styles/style.css';
import { HeroUIProvider } from '@heroui/react';

function initializeWidget() {
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
}

function onReady() {
  try {
    // Si ya existe, no volver a montarlo
    if (document.getElementById('my-widget-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'my-widget-wrapper';

    // 👉 Estilos del wrapper
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '2rem';
    wrapper.style.right = '2rem';
    wrapper.style.zIndex = '9999999999';
    wrapper.style.pointerEvents = 'auto'; // habilita clicks

    // Root div donde montamos el widget React
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-root';
    rootDiv.style.pointerEvents = 'auto'; // habilita clicks dentro

    wrapper.appendChild(rootDiv);
    document.body.appendChild(wrapper);

    // Estilos si los quieres agregar dinámicamente
    injectStyle();

    const clientKey = getClientKey();
    const apiUrl = getApiUrl();

    const component = (
      <HeroUIProvider>
        <WidgetContainer clientKey={clientKey} apiUrl={apiUrl} />
      </HeroUIProvider>
    );

    createRoot(rootDiv).render(component);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function injectStyle() {
  const scripts = document.getElementsByTagName('script');
  const current = scripts[scripts.length - 1];
  const cssUrl = current?.getAttribute('data-widget-css-url') || process.env.WIDGET_CSS_URL || `widget.css`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  document.head.appendChild(link); // 🔥 importante, ya no hay shadowRoot
}

function getClientKey() {
  const scripts = document.getElementsByTagName('script');
  const current = scripts[scripts.length - 1];
  const clientKey = current?.getAttribute('data-client-key') || "68751f5c68840ae1341e7d49";

  if (!clientKey) throw new Error('Missing data-client-key attribute');

  return clientKey;
}

export function getApiUrl() {
  const scripts = document.getElementsByTagName('script');
  const current = scripts[scripts.length - 1];
  const apiUrl = current?.getAttribute('data-api-url') || 'http://localhost:8000';

  if (!apiUrl) throw new Error('Missing data-api-url');

  return apiUrl;
}

initializeWidget();
