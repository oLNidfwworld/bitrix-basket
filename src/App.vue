<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';
import { MakeOrder } from './components/widgets/make-order';
import { OrderTable } from './components/widgets/order-table';
import { useFetchApi } from './composables/useFetchApi';
import type { OrderItem } from './helpers/api/orderItems';
import type { OrderAvailableFields, OrderPayPersonFields, OrderPropsBitrixAutofilled } from './helpers/api/orderFields';
import { toOrderProps } from './helpers/converters';
import type { ApiResponse } from './helpers/api/apiResponse';

const orderData = shallowRef<Array<OrderItem>>();
const makeOrderInfo = shallowRef<Array<OrderPayPersonFields>>();
const pendingLoading = ref(true);

const promiseBasketItems = useFetchApi<Array<OrderItem>>('/Api/Basket');
const promiseOrderFields = useFetchApi<OrderAvailableFields>('/Api/Order');
const promiseOrderLastFields = useFetchApi<ApiResponse<OrderPropsBitrixAutofilled[]>>('/Api/Order/last');

const autoFilledPayPersonId = shallowRef<number>(1);

onMounted(async () => {
  const result = await Promise.all([promiseBasketItems, promiseOrderFields, promiseOrderLastFields]);

  orderData.value = result[0].data.value;

  const orderAvailableFields = result[1].data.value.payerBlocks;

  const convertedFields: Array<OrderPayPersonFields> = orderAvailableFields.map(orderFields => {

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
    }
  });

  if (!result[2].data.value.status) {
    console.log(result[2].data.value.data);

    autoFilledPayPersonId.value = Number(result[2].data.value.data[0].pid);
  }

  makeOrderInfo.value = [...convertedFields];
  pendingLoading.value = false;
})

</script>
<template>
  <div v-if="!pendingLoading" class="order-wrapper">
    <template v-if="orderData && orderData.length > 0 && makeOrderInfo">
      <OrderTable v-if="orderData" :items="orderData" />
      <MakeOrder v-if="makeOrderInfo && orderData && orderData.length > 0" :prefilledPayPerson="autoFilledPayPersonId"
        :payPersonFields="makeOrderInfo" />
    </template>
    <div class="empty-basket" v-else>
      <h2>Ваша корзина пуста</h2>
      <a href="/catalog/" class="btn dark">Каталог</a>
    </div>
  </div>
</template>