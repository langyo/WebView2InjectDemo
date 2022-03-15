import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './entry.vue';

try {
  document.write(`
  <html>
  <head lang="zh-cn">
    <meta charset="utf-8">
    <title>Demo</title>
  </head>
  <body>
    <div id="app" hidden></div>
  </body>
  </html>
  `);

  const app = createApp(App);
  app.use(ElementPlus);
  app.mount('#app');
} catch (e) {
  window['chrome'].webview.postMessage(e.toString());
}
