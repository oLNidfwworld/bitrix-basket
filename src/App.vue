<script setup lang="ts">
import { Card } from './components/ui/cards';
</script>
<template>
  <div>
    <main>
      <Card />
    </main>
  </div>
</template>
<style lang="scss">
main {
  & div {
    font-size: 100px
  }
}
</style>
