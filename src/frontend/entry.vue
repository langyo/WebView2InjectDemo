<template>
  <el-dialog
    :fullscreen="true"
    :model-value="true"
    :before-close="handleTerminate"
  >
    <template #title> Test </template>
    <Emulator msg="Test" />
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Emulator from './pages/emulator.vue';

export default defineComponent({
  name: 'App',
  components: {
    Emulator,
  },
  methods: {
    handleTerminate() {
      window['chrome'].webview.postMessage('terminate');
    },
  },
});
</script>

<style lang="scss" scoped>
html,
body {
  margin: 0px;
  padding: 0px;
}
</style>
