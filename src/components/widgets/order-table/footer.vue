<template>
    <div v-if="metreItemsCalcData" class="products-table__footer">
        <p>Всего товаров: {{ metreItemsCalcData.poddonsCount }} </p>
        <p>Метраж: {{ metreItemsCalcData.metres }} м2</p>
        <p class="products-table__total"><span>Сумма: </span><span>{{ metreItemsCalcData.sum }} ₽</span></p>
    </div>
    <div v-if="singleItemsCalcData" class="products-table__footer">
        <p>Всего товаров: {{ singleItemsCalcData.count }} </p>
        <p>Поддоны: {{ singleItemsCalcData.poddonsCount }} шт.</p>
        <p class="products-table__total"><span>Сумма: </span><span>{{ singleItemsCalcData.sum }} ₽</span></p>
    </div>
    <div v-if="allItemsCalcData" class="products-table__footer">
        <p>Всего товаров: {{ allItemsCalcData.count }} </p>
        <p>Поддоны: {{ allItemsCalcData.poddonsCount }} шт.</p>
        <p class="products-table__total"><span>Сумма: </span><span>{{ allItemsCalcData.sum }} ₽</span></p>
    </div>
</template>
<script setup lang="ts">
import type { OrderItem } from '@/helpers/api/orderItems';
import { computed } from 'vue';

interface IProps {
    orderItems: OrderItem[]
}

const props = defineProps<IProps>();

const metreItems = computed(() => {
    return props.orderItems.filter(xItem => xItem.measure === 'м');
});
const singleItems = computed(() => {
    return props.orderItems.filter(xItem => xItem.measure === 'шт');
});

const metreItemsCalcData = computed(() => {
    if (metreItems.value) {
        let sum: number = 0, poddonsCount: number = 0, metres: number = 0;

        metreItems.value.forEach(item => {
            sum += item.totalPrice;
            poddonsCount += item.poddonsCount;
            metres += item.quantity
        })

        return {
            sum,
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
            metres
        };
    } else {
        return null;
    }
});

const singleItemsCalcData = computed(() => {
    if (singleItems.value) {
        let sum: number = 0, poddonsCount: number = 0, count: number = 0;

        singleItems.value.forEach(item => {
            count += item.quantity;
            sum += item.totalPrice;
            poddonsCount += item.poddonsCount;
        })

        return {
            count,
            sum,
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
        };
    } else {
        return null;
    }
});

const allItemsCalcData = computed(() => {
    if (props.orderItems) {

        let count: number = 0, poddonsCount: number = 0, sum: number = 0;

        props.orderItems.forEach(item => {
            count += item.quantity;
            poddonsCount += item.poddonsCount;
            sum += item.totalPrice;
        })

        return {
            count,
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
            sum
        }
    } else {
        return null;
    }
});

</script>