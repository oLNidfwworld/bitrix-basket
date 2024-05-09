<template>
    <div class="products-table">
        <div class="products-table__header">
            <p>Товар</p>
            <p>Цена</p>
            <p>Количество метров</p>
            <p>Количество поддонов</p>
            <p>Итог</p>
        </div>
        <Card :item="item" v-for="(item, index) in orderData" :key="index" />
        <div class="products-table__footer">
            <p>Всего товаров: 3 </p>
            <p>Метраж: 40 м2</p>
            <p>Поддоны: 6 шт.</p>
            <p class="products-table__total"><span>Сумма: </span><span>1 000 095 ₽</span></p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Card } from '@/components/ui/cards';
import { useFetchApi } from '@/composables/useFetchApi';
import type { OrderItem } from '@/helpers/api';

const { data: orderData } = await useFetchApi<Array<OrderItem>>('/Api/Basket');


</script>