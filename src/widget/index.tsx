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

    const shadow = wrapper.attachShadow({ mode: 'open' });
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-root';

    shadow.appendChild(rootDiv);
    injectStyle(shadow);

    const clientKey = getClientKey();
    const component = <WidgetContainer clientKey={clientKey} />;
    createRoot(rootDiv).render(component);

    document.body.appendChild(wrapper);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function injectStyle(shadowRoot: ShadowRoot) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  const fileName = process.env.WIDGET_NAME || 'widget';
  link.href = process.env.WIDGET_CSS_URL || `/${fileName}.css`;
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

initializeWidget();
