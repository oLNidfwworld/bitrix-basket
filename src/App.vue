<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { MakeOrder } from './components/widgets/make-order';
import { OrderTable } from './components/widgets/order-table';
import { useFetchApi } from './composables/useFetchApi';
import type { OrderItem } from './helpers/api/orderItems';
import type { OrderAvailableFields, OrderPayPersonFields, OrderPropsBitrixAutofilled, OrderDeliveries } from './helpers/api/orderFields';
import { toOrderProps } from './helpers/converters';
import type { ApiResponse } from './helpers/api/apiResponse';

/* Promises */
const promiseBasketItems = useFetchApi<Array<OrderItem>>('/Api/Basket');
const promiseOrderFields = useFetchApi<OrderAvailableFields>('/Api/Order');
const promiseOrderLastFields = useFetchApi<ApiResponse<OrderPropsBitrixAutofilled[]>>('/Api/Order/last');
const pendingLoading = ref(true);

/* Basket block */
const orderData = ref<Array<OrderItem>>();
const addToBasketOuter = (items: Array<OrderItem>) => {
  orderData.value = items;
}
const countableOrderItems = computed(() => {
  return orderData.value?.filter(item => item.countable === true);
})
window.addToBasketOuter = addToBasketOuter;

/* OrderMake block */
const makeOrderInfo = shallowRef<Array<OrderPayPersonFields>>();
const deliveryOrderInfo = shallowRef<OrderDeliveries>();
const autoFilledPayPersonId = shallowRef<number>(1);

onMounted(async () => {
  const result = await Promise.all([promiseBasketItems, promiseOrderFields, promiseOrderLastFields]);
  /* Fill basket data*/
  orderData.value = result[0].data.value;

  /* Fill orderMake data*/
  deliveryOrderInfo.value = result[1].data.value.deliviries;
  const convertedFields: Array<OrderPayPersonFields> = result[1].data.value.payerBlocks.map(orderFields => {
    return {
      personType: orderFields.personType,
      orderProps: toOrderProps(orderFields.orderProps).map(prop => {
        let autoFilledVal: string | undefined;
        if (!result[2].data.value.status) {
          autoFilledVal = result[2].data.value.data.find(autoFillProp => autoFillProp.id === prop.id)?.value;
        }
        return {
          ...prop,
          value: (autoFilledVal) ? autoFilledVal : '',
        }
      }),
      paysystems: orderFields.paysystems,
      pickups: orderFields.pickups,
      deliveries: orderFields.deliviries
    }
  });



  if (!result[2].data.value.status) {
    autoFilledPayPersonId.value = Number(result[2].data.value.data[0].pid);
  }
  makeOrderInfo.value = [...convertedFields];
  pendingLoading.value = false;
  watch(() => countableOrderItems.value, (newVal) => {
    const blockClassList = document.querySelector('#popularItems')?.classList;
    if (newVal && newVal.length <= 0) {
      if (blockClassList && blockClassList.contains('hidden')) blockClassList.remove('hidden');
    } else {
      if (blockClassList) blockClassList.add('hidden');
    }
  }, {
    deep: true
  })
}) 
</script>
<template>
  <div v-if="!pendingLoading" class="order-wrapper">
    <template v-if="orderData && orderData.length > 0 && makeOrderInfo">
      <OrderTable v-if="orderData" v-model:items="orderData" />
      <MakeOrder
        v-if="makeOrderInfo && deliveryOrderInfo && orderData && orderData.length > 0 && countableOrderItems?.length"
        :prefilledPayPerson="autoFilledPayPersonId" :payPersonFields="makeOrderInfo"
        :orderDeliviries="deliveryOrderInfo" />
    </template>
    <div class="empty-basket" v-else>
      <h2>Ваша корзина пуста</h2>
      <a href="/catalog/" class="btn dark">Каталог</a>
    </div>
  </div>
</template>