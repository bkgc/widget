import { createRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
import './styles/style.css';

function initializeWidget() {
  if (document.readyState !== 'loading') {
    waitAndRender();
  } else {
    document.addEventListener('DOMContentLoaded', waitAndRender);
  }
}

function waitAndRender() {
  setTimeout(onReady, 0); // nos aseguramos que se ejecute cuando todo haya cargado
}

function onReady() {
  try {
    if (document.getElementById('my-widget-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'my-widget-wrapper';
    const shadow = wrapper.attachShadow({ mode: 'open' });
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-root';

    shadow.appendChild(rootDiv);
    injectStyle(shadow);
    setupEventDelegation(shadow);

    const clientKey = getClientKey();
    const apiUrl = getApiUrl()
    const component = <WidgetContainer clientKey={clientKey} apiUrl={apiUrl} />;
    createRoot(rootDiv).render(component);

    document.body.appendChild(wrapper);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}
function setupEventDelegation(shadowRoot: ShadowRoot) {
  const mouseEvents = ['click', 'mousedown', 'mouseup'];
  const keyboardEvents = ['keydown', 'keyup'];

  mouseEvents.forEach(eventName => {
    shadowRoot.addEventListener(eventName, (e: Event) => {
      const me = e as MouseEvent;
      const newEvent = new MouseEvent(me.type, me);
      document.dispatchEvent(newEvent);
    });
  });

  keyboardEvents.forEach(eventName => {
    shadowRoot.addEventListener(eventName, (e: Event) => {
      const ke = e as KeyboardEvent;
      const newEvent = new KeyboardEvent(ke.type, ke);
      document.dispatchEvent(newEvent);
    });
  });
}


function injectStyle(shadowRoot: ShadowRoot) {
  const scripts = document.getElementsByTagName('script');
  const current = scripts[scripts.length - 1];
  const fileName = process.env.WIDGET_NAME || 'widget';
  const cssUrl = current?.getAttribute('data-widget-css-url') || process.env.WIDGET_CSS_URL || `/${fileName}.css`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  shadowRoot.appendChild(link);
}

function getClientKey() {
  const scripts = document.getElementsByTagName('script');
  const current = scripts[scripts.length - 1];
  const clientKey = current?.getAttribute('data-client-key') || "68751f5c68840ae1341e7d49";

  if (!clientKey) {
    throw new Error('Missing data-client-key attribute');
  }

  console.log("clientKey", clientKey)
  return clientKey;
}
export function getApiUrl() {
  const scripts = document.getElementsByTagName('script');
  const current = scripts[scripts.length - 1];
  const apiUrl = current?.getAttribute('data-api-url') || 'http://localhost:8000';

  if (!apiUrl) {
    throw new Error('Missing data-api-url');
  }

  return apiUrl;
}

initializeWidget();
