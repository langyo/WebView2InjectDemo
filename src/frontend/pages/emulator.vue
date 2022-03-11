<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
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
