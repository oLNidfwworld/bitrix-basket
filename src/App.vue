<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { MakeOrder } from './components/widgets/make-order';
import { OrderTable } from './components/widgets/order-table';
import { useFetchApi } from './composables/useFetchApi';
import type { OrderItem } from './helpers/api/orderItems';
import type { OrderAvailableFields, OrderPayPersonFields } from './helpers/api/orderFields';
import { toOrderProps } from './helpers/converters';

const orderData = shallowRef<Array<OrderItem>>();
const makeOrderInfo = shallowRef<Array<OrderPayPersonFields>>();

onMounted(async () => {
  orderData.value = (await useFetchApi<Array<OrderItem>>('/Api/Basket')).data.value;

  const orderAvailableFields = (await useFetchApi<OrderAvailableFields>('/Api/Order')).data.value.payerBlocks;

  const convertedFields: Array<OrderPayPersonFields> = orderAvailableFields.map(orderFields => {
    return {
      personType: orderFields.personType,
      orderProps: toOrderProps(orderFields.orderProps),
      paysystems: orderFields.paysystems
    }
  });

  makeOrderInfo.value = [...convertedFields];
})

</script>
<template>
  <div class="order-wrapper">
    <OrderTable v-if="orderData" :items="orderData" />
    <MakeOrder v-if="makeOrderInfo" :payPersonFields="makeOrderInfo" />
  </div>
</template>