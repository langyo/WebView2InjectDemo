import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './entry.vue';

try {
  const app = createApp(App);
  app.use(ElementPlus);
  app.mount('#app');
} catch (e) {
  window['chrome'].webview.postMessage(e.toString());
}
