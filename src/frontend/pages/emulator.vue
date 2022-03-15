<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-button @click="openDevTools"> Open Dev Tools </el-button>
    <el-button @click="close"> Close </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Emulator',
  props: {
    msg: String,
  },
  methods: {
    openDevTools() {
      window['chrome'].webview.postMessage('openDevTools');
    },
    close() {
      window['chrome'].webview.postMessage('terminate');
    },
  },
});
</script>

<style scoped lang="scss">
h1 {
  color: green;
}
</style>
