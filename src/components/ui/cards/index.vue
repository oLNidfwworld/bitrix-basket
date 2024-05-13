<template>
    <div class="product-card-table">
        <div class="product-card-table__main-info">
            <picture>
                <source :srcset="`https://romb-art.ru` + model.img" />
                <img />
            </picture>
            <h3 class="product-card-table__name">{{ model.name }}</h3>
        </div>
        <div class="product-card-table__price"><span class="product-card-table__hidden-header">Цена</span>
            <p>{{ priceFormated }} <span v-html="measureString" /></p>
        </div>
        <div class="product-card-table__col"><span class="product-card-table__hidden-header">Кол-во метров</span>
            <CounterBlock inert="true" :measure-type="(model.measure === 'м') ? 'м' : 'шт'"
                v-model:model-value="model.quantity" />
        </div>
        <div class="product-card-table__col"><span class="product-card-table__hidden-header">Кол-во поддонов</span>
            <CounterBlock measure-type="шт" v-model:model-value="model.poddonsCount" theme="light" />
        </div>
        <div class="product-card-table__total"><span class="product-card-table__hidden-header">Итог</span>
            <p>{{ totalPriceFormated }} ₽</p>
        </div>
        <div class="loader-wrapper" :class="{ 'loading': isPending }">
            <div class="basket-loader" />
        </div>
    </div>
</template>
<script setup lang="ts">
interface IProps {
    item: OrderItem,
}
import type { OrderItem } from '@/helpers/api/orderItems';

import { computed, ref, watch } from 'vue';

import { CounterBlock } from '../counterBlock';
import { useDebounceFn, useVModel } from '@vueuse/core';
import { useFetchApi } from '@/composables/useFetchApi';

const props = defineProps<IProps>();
const emit = defineEmits(['update:item']);
const model = useVModel(props, 'item', emit);

const priceFormated = computed(() => model.value.price.toLocaleString('ru-RU'));
const totalPriceFormated = computed(() => model.value.totalPrice.toLocaleString('ru-RU'));
const measureString = computed(() => {
    switch (model.value.measure) {
        case 'м':
            return '₽/м<sup>2 </sup>';
        case 'шт':
            return '₽/шт'
        default:
            return '';
    }
});

watch(() => model.value.poddonsCount, () => {
    model.value.quantity = model.value.poddonsCount * model.value.quantityPerPoddon;
    model.value.totalPrice = model.value.quantity * model.value.price;
})

const isPending = ref<Boolean>(false);
watch(() => isPending.value, () => {
    console.log('isPending ', isPending.value);
})
watch(() => model.value.quantity, () => changeBasket());
const changeBasket = useDebounceFn(async () => {
    isPending.value = true;
    const { data: responseData } = await useFetchApi('/Api/Basket/change', {
        method: 'PUT',
        body: JSON.stringify({
            id: props.item.id,
            count: props.item.quantity
        })
    });
    isPending.value = false;
    console.log(responseData.value);
}, 950);

// const fixQuantity = useDebounceFn( ( ) => {
//     model.value.quantity = model.value.poddonsCount * model.value.quantityPerPoddon;
// }, 700);
</script>
<style lang="scss">
.product-card-table {
    position: relative;
    overflow: hidden;
}

.loader-wrapper {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    background: rgba(255, 255, 255, 0.43);
    backdrop-filter: blur(3px);

    &.loading {
        display: block;
    }
}

.basket-loader:after {
    content: "";
    display: inline-block;
    font-size: 6.2px;
    //margin-top: 40px;
    border: 1.2em solid var(--dark);
    border-right-color: rgba(0, 64, 128, 0) !important;
    transform: translateZ(0);
    animation: spiner 1s infinite cubic-bezier(0.53, 0.21, 0.57, 0.85), colors 3s infinite cubic-bezier(0.45, -0.03, 1, 0.77);
    border-radius: 50%;
    width: 10em;
    height: 10em;
    position: absolute;
    top: 50%;
    right: 50%;
    right: calc(50% - 5em);
    margin-top: -6em;
}

@keyframes colors {
    0% {
        border-color: #3091e6;
        border-bottom-color: transparent;
    }

    33% {
        border-color: #0a5da9;
        border-bottom-color: transparent;
    }

    66% {
        border-color: #00bbd5;
        border-bottom-color: transparent;
    }

    100% {
        border-color: #3091e6;
        border-bottom-color: transparent;
    }
}

@keyframes spiner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(720deg);
    }
}
</style>