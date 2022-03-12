import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './entry.vue';

try {
  document.write(`
  <html>
  <head lang="zh-cn">
    <meta charset="utf-8">
    <title>Demo</title>
    <style>
  html, body, * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
    </style>
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
  `);

  const app = createApp(App);
  app.use(ElementPlus);
  app.mount('#app');
} catch (e) {
  window['chrome'].webview.postMessage(e.toString());
}
