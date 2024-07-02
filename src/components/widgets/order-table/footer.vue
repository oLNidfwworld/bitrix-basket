<template>
    <div v-if="metreItemsCalcData" class="products-table__footer">
        <p>Тротуарная плитка: {{ metreItemsCalcData.positions }} </p>
        <p>Метраж: {{ metreItemsCalcData.metres }} м<sup>2</sup></p>
        <p>Поддоны: {{ metreItemsCalcData.poddonsCount }} шт </p>
        <p class="products-table__total"><span>Сумма: </span><span>{{ metreItemsCalcData.sum }} ₽</span></p>
    </div>
    <div v-if="singleItemsCalcData" class="products-table__footer">
        <p>Бордюр: {{ singleItemsCalcData.positions }} </p>
        <p>Штук: {{ singleItemsCalcData.count }} шт.</p>
        <p>Поддоны: {{ singleItemsCalcData.poddonsCount }} шт.</p>
        <p class="products-table__total"><span>Сумма: </span><span>{{ singleItemsCalcData.sum }} ₽</span></p>
    </div>
    <div v-if="allItemsCalcData && (singleItemsCalcData && metreItemsCalcData)" class="products-table__footer">
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

const countableItems = computed(() => {
    return props.orderItems.filter(item => item.countable)
})

const metreItems = computed(() => {
    return countableItems.value.filter(xItem => xItem.measure === 'м');
});
const singleItems = computed(() => {
    return countableItems.value.filter(xItem => xItem.measure === 'шт');
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
            sum: Number(sum.toFixed(2)).toLocaleString('ru-RU'),
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
            metres: Number(metres.toFixed(2)).toLocaleString('ru-RU')
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
            sum: Number(sum.toFixed(2)).toLocaleString('ru-RU'),
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
        };
    } else {
        return null;
    }
});

const allItemsCalcData = computed(() => {
    if (countableItems.value) {

        let count: number = 0, poddonsCount: number = 0, sum: number = 0, positions: number = countableItems.value.length;

        countableItems.value.forEach(item => {
            count += item.quantity;
            poddonsCount += item.poddonsCount;
            sum += item.totalPrice;
        })

        return {
            positions,
            count,
            poddonsCount: poddonsCount.toLocaleString('ru-RU'),
            sum: Number(sum.toFixed(2)).toLocaleString('ru-RU')
        }
    } else {
        return null;
    }
});

</script>