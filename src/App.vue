<script setup lang="ts">
import { MakeOrder } from './components/widgets/make-order';
import { OrderTable } from './components/widgets/order-table';


</script>
<template>
  <div class="order-wrapper">
    <Suspense>
      <OrderTable />
    </Suspense>
    <Suspense>
      <MakeOrder />
    </Suspense>
  </div>
</template>