<template>
    <div v-if="orderData.length > 0" class="products-table">
        <div class="products-table__header">
            <p>Товар</p>
            <p>Цена</p>
            <p>Количество</p>
            <p>Количество поддонов</p>
            <p>Итог</p>
        </div>
        <template v-if="orderData">
            <Card @deleteItem="onDeleteItem" v-model:item="orderData[index]" v-for="(item, index) in orderData"
                :key="item.id" />
        </template>
        <OrderFooter :orderItems="orderData" />
    </div>
    <div class="empty-basket" v-else>
        <h2>Ваша корзина пуста</h2>
        <a href="/catalog/" class="btn dark">Каталог</a>
    </div>
</template>
<script setup lang="ts">

interface IProps {
    items: Array<OrderItemRaw>,
}

import { Card } from '@/components/ui/cards';
import type { OrderItem, OrderItemRaw } from '@/helpers/api/orderItems';
import { ref, watch } from 'vue'; import { OrderFooter } from '.';

const props = defineProps<IProps>();

const orderData = ref<Array<OrderItem>>([]);

watch(() => props.items, (newVal) => {
    newVal.forEach(orderItem => {
        orderData.value?.push({
            ...orderItem,
            poddonsCount: Math.ceil(orderItem.quantity / orderItem.quantityPerPoddon)
        });
    });
})

const onDeleteItem = (eventArgs: OrderItem) => {
    const indexItemToDelete = orderData.value.indexOf(eventArgs);
    orderData.value.splice(indexItemToDelete, 1);
}

</script>
<style lang="scss">
.empty-basket {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;
    color: var(--blue);
    font-size: 40px;

    h2 {
        font-weight: 600;
        font-size: inherit;
        color: inherit;
    }
}
</style>