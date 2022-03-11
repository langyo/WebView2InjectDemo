<template>
  <div class='hello'>
    <h1>{{ msg }}</h1>
    <button onclick='window.chrome.webview.postMessage("terminate")'>
      close
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Emulator',
  props: {
    msg: String,
  },
});
</script>

<style scoped lang="scss">
h1 {
  color: green;
}
</style>
