<script setup lang="ts">
import { OrderTable } from './components/widgets/order-table';


</script>
<template>
  <div class="order-wrapper">  
    <Suspense>
      <OrderTable/>
    </Suspense>
  </div>
</template> 