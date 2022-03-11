<template>
  <Emulator msg="Test"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Emulator from './pages/emulator.vue';

export default defineComponent({
  name: 'App',
  components: {
    Emulator
  }
});
</script>

<style lang="scss">
html, body {
  margin: 0px;
  padding: 0px;
}
</style>
