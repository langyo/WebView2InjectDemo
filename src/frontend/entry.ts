import { createApp } from 'vue';
import App from './entry.vue';

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

createApp(App).mount('#app');
