import { createRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
import './styles/style.css';

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

    const wrapper = document.createElement('div');
    wrapper.id = 'my-widget-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '0';
    wrapper.style.right = '0';
    wrapper.style.width = '100vw';
    wrapper.style.height = '100vh';
    wrapper.style.zIndex = '9999999999';
    const shadow = wrapper.attachShadow({ mode: 'open' });
    forwardEventsFromShadow(shadow);
    const rootDiv = document.createElement('div');
    wrapper.style.pointerEvents = 'none';
    rootDiv.style.pointerEvents = 'auto';
    rootDiv.id = 'widget-root';

    shadow.appendChild(rootDiv);
    injectStyle(shadow);

    const clientKey = getClientKey();
    const apiUrl = getApiUrl()
    const component = <WidgetContainer clientKey={clientKey} apiUrl={apiUrl} />;
    createRoot(rootDiv).render(component);

    document.body.appendChild(wrapper);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function forwardEventsFromShadow(shadowRoot: ShadowRoot) {
  const eventTypes = ['click', 'mousedown', 'mouseup', 'keydown', 'keyup'];

  eventTypes.forEach(eventType => {
    shadowRoot.addEventListener(eventType, (originalEvent) => {
      // Ignorar si ya fue reenviado
      if ((originalEvent as any)._isForwarded) return;

      const eventInit = {
        bubbles: true,
        cancelable: originalEvent.cancelable,
        composed: true,
      };

      let newEvent: Event;

      if (originalEvent instanceof MouseEvent) {
        newEvent = new MouseEvent(originalEvent.type, {
          ...eventInit,
          screenX: originalEvent.screenX,
          screenY: originalEvent.screenY,
          clientX: originalEvent.clientX,
          clientY: originalEvent.clientY,
          button: originalEvent.button,
          buttons: originalEvent.buttons,
          relatedTarget: originalEvent.relatedTarget,
          ctrlKey: originalEvent.ctrlKey,
          shiftKey: originalEvent.shiftKey,
          altKey: originalEvent.altKey,
          metaKey: originalEvent.metaKey,
        });
      } else if (originalEvent instanceof KeyboardEvent) {
        newEvent = new KeyboardEvent(originalEvent.type, {
          ...eventInit,
          key: originalEvent.key,
          code: originalEvent.code,
          location: originalEvent.location,
          ctrlKey: originalEvent.ctrlKey,
          shiftKey: originalEvent.shiftKey,
          altKey: originalEvent.altKey,
          metaKey: originalEvent.metaKey,
          repeat: originalEvent.repeat,
        });
      } else {
        newEvent = new Event(originalEvent.type, eventInit);
      }

      // Marca como reenviado para evitar loops
      (newEvent as any)._isForwarded = true;

      originalEvent.target?.dispatchEvent(newEvent);
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
