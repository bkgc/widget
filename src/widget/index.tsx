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
    if (document.getElementById('my-widget-wrapper')) return;
    console.log("Creando wrapper...");
    const wrapper = document.createElement('div');
    wrapper.id = 'my-widget-wrapper';
    // wrapper.style.position = 'relative';
    // wrapper.style.width = '100vw'
    // wrapper.style.height = '100vh'
    // wrapper.style.pointerEvents = 'none'

    const rootDiv = document.createElement('div');
    // rootDiv.id = 'widget-root';
    // rootDiv.style.position = 'absolute'
    // rootDiv.style.inset = '0px'
    // rootDiv.style.zIndex = '9999999'
    // rootDiv.style.pointerEvents = 'auto'


    wrapper.appendChild(rootDiv);
    document.body.appendChild(wrapper);

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
