import { createRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';

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

    // ✅ Estilos necesarios
    wrapper.style.position = 'fixed';
    wrapper.style.inset = '0';
    wrapper.style.zIndex = '999999';
    wrapper.style.pointerEvents = 'none'; // permite hacer clic en la página

    const shadowRoot = wrapper.attachShadow({ mode: 'open' });

    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-root';

    // ✅ Estilos para que sea clickeable
    rootDiv.style.width = '100%';
    rootDiv.style.height = '100%';
    rootDiv.style.pointerEvents = 'auto'; // permite clics dentro del widget

    shadowRoot.appendChild(rootDiv);
    document.body.appendChild(wrapper);

    injectStyle(shadowRoot);

    const clientKey = getClientKey();
    const apiUrl = getApiUrl();

    const component = (
      <WidgetContainer clientKey={clientKey} apiUrl={apiUrl} />
    );

    createRoot(rootDiv).render(component);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function injectStyle(shadowRoot: ShadowRoot) {
  const fileName = process.env.WIDGET_NAME || 'widget';
  const cssUrl =
    getCurrentScript()?.getAttribute('data-widget-css-url') ||
    process.env.WIDGET_CSS_URL ||
    `/${fileName}.css`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl!;
  shadowRoot.appendChild(link);
}

function getCurrentScript(): HTMLScriptElement | null {
  const scripts = document.getElementsByTagName('script');
  return scripts.length ? scripts[scripts.length - 1] : null;
}

function getClientKey() {
  const clientKey =
    getCurrentScript()?.getAttribute('data-client-key') || '68751f5c68840ae1341e7d49';

  if (!clientKey) throw new Error('Missing data-client-key attribute');

  return clientKey;
}

export function getApiUrl() {
  const apiUrl =
    getCurrentScript()?.getAttribute('data-api-url') || 'http://localhost:8000';

  if (!apiUrl) throw new Error('Missing data-api-url');

  return apiUrl;
}

initializeWidget();
