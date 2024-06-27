<template>
    <div class="products-table">
        <div class="products-table__header">
            <p>Товар</p>
            <p>Цена</p>
            <p>Количество</p>
            <p>Количество поддонов</p>
            <p>Итог</p>
        </div>
        <template v-if="model">
            <Card @deleteItem="onDeleteItem" v-model:item="model[index]" v-for="(item, index) in model"
                :key="item.id" />
        </template>
        <OrderFooter :orderItems="model" />
    </div>
</template>
<script setup lang="ts">

interface IProps {
    items: Array<OrderItem>,
}

import { Card } from '@/components/ui/cards';
import type { OrderItem } from '@/helpers/api/orderItems';
import { OrderFooter } from '.';
import { useVModel } from '@vueuse/core';

const props = defineProps<IProps>();
const emit = defineEmits(['update:items']);
const model = useVModel(props, 'items', emit);

const onDeleteItem = (eventArgs: OrderItem) => {
    const indexItemToDelete = model.value.indexOf(eventArgs);
    model.value.splice(indexItemToDelete, 1);

    // if (orderData.value.length <= 0) {
    //     emit('update', orderData.value);
    // }
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