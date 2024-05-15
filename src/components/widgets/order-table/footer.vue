<template>
    <div v-if="metreItemsCalcData" class="products-table__footer">
        <p>Всего товаров: {{ metreItemsCalcData.positions }} </p>
        <p>Метраж: {{ metreItemsCalcData.metres }} м<sup>2</sup></p>
        <p>Поддонов: {{ metreItemsCalcData.poddonsCount }} шт </p>
        <p class="products-table__total"><span>Сумма: </span><span>{{ metreItemsCalcData.sum }} ₽</span></p>
    </div>
    <div v-if="singleItemsCalcData" class="products-table__footer">
        <p>Всего товаров: {{ singleItemsCalcData.positions }} </p>
        <p>Штук: {{ singleItemsCalcData.count }} шт.</p>
        <p>Поддоны: {{ singleItemsCalcData.poddonsCount }} шт.</p>
        <p class="products-table__total"><span>Сумма: </span><span>{{ singleItemsCalcData.sum }} ₽</span></p>
    </div>
    <div v-if="allItemsCalcData" class="products-table__footer">
        <p>Всего товаров: {{ allItemsCalcData.positions }} </p>
        <!-- <p>Поддоны: {{ allItemsCalcData.poddonsCount }} шт.</p> -->
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
    if (metreItems.value.length > 0) {
        let sum: number = 0, poddonsCount: number = 0, metres: number = 0, positions: number = metreItems.value.length;

        metreItems.value.forEach(item => {
            sum += item.totalPrice;
            poddonsCount += item.poddonsCount;
            metres += item.quantity
        })

        return {
            positions,
            sum: sum.toFixed(2),
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
            metres: metres.toFixed(2)
        };
    } else {
        return null;
    }
});

const singleItemsCalcData = computed(() => {
    if (singleItems.value.length > 0) {
        let sum: number = 0, poddonsCount: number = 0, count: number = 0, positions: number = singleItems.value.length;

        singleItems.value.forEach(item => {
            count += item.quantity;
            sum += item.totalPrice;
            poddonsCount += item.poddonsCount;
        })

        return {
            positions,
            count,
            sum: sum.toFixed(2),
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
        };
    } else {
        return null;
    }
});

const allItemsCalcData = computed(() => {
    if (props.orderItems) {

        let count: number = 0, poddonsCount: number = 0, sum: number = 0, positions: number = props.orderItems.length;

        props.orderItems.forEach(item => {
            count += item.quantity;
            poddonsCount += item.poddonsCount;
            sum += item.totalPrice;
        })

        return {
            positions,
            count,
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
            sum
        }
    } else {
        return null;
    }
});

</script>