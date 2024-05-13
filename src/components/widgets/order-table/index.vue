<template>
    <div class="products-table">
        <div class="products-table__header">
            <p>Товар</p>
            <p>Цена</p>
            <p>Количество</p>
            <p>Количество поддонов</p>
            <p>Итог</p>
        </div>
        <template v-if="orderData">
            <Card v-model:item="orderData[index]" v-for="(item, index) in orderData" :key="index" />
        </template>
        <OrderFooter :orderItems="orderData" />
    </div>
</template>
<script setup lang="ts">
import { Card } from '@/components/ui/cards';
import { useFetchApi } from '@/composables/useFetchApi';
import type { OrderItem, OrderItemRaw } from '@/helpers/api/orderItems';
import { ref } from 'vue'; import { OrderFooter } from '.';

const orderData = ref<Array<OrderItem>>([]);
const { data: orderDataShallow } = await useFetchApi<Array<OrderItemRaw>>('/Api/Basket');

orderDataShallow.value.forEach(orderItem => {
    orderData.value?.push({
        ...orderItem,
        poddonsCount: Math.ceil(orderItem.quantity / orderItem.quantityPerPoddon)
    });
});



console.table(orderData.value);
</script>