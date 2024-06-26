<template>
    <div ref="rootElement" class="product-card-table">
        <div class="product-card-table__main-info">
            <picture>
                <source :srcset="`https://romb-art.ru` + model.img" />
                <img />
            </picture>
            <a :href="model.detailPageUrl" class="product-card-table__name">{{ model.name }}</a>
        </div>
        <div class="product-card-table__price"><span class="product-card-table__hidden-header">Цена</span>
            <p>{{ priceFormated }} <span v-html="measureString" /></p>
        </div>
        <div class="product-card-table__col"><span class="product-card-table__hidden-header">Кол-во метров</span>
            <CounterBlock :step="(model.measure === 'м') ? model.quantityPerPoddon : 1" :measure-type="model.measure"
                v-model:model-value="model.quantity" @values-changing="changeQuantity" />
        </div>
        <div class="product-card-table__col"><span class="product-card-table__hidden-header">Кол-во поддонов</span>
            <CounterBlock measure-type="шт" v-model:model-value="model.poddonsCount" theme="light"
                @values-changing="changePoddons" />
        </div>
        <div class="product-card-table__total"><span class="product-card-table__hidden-header">Итог</span>
            <p>{{ totalPriceFormated }} ₽</p>
        </div>
        <button @click="deleteProductBasket" class="product-card-table__rm">
            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M16.7355 15.5001L29.7349 2.50064C30.1926 2.04297 30.1926 1.30093 29.7349 0.843318C29.2773 0.385701 28.5352 0.385642 28.0776 0.843318L15.0781 13.8428L2.07871 0.843318C1.62103 0.385642 0.878999 0.385642 0.421382 0.843318C-0.0362353 1.30099 -0.0362939 2.04302 0.421382 2.50064L13.4208 15.5001L0.421382 28.4996C-0.0362939 28.9572 -0.0362939 29.6993 0.421382 30.1569C0.65019 30.3857 0.950131 30.5001 1.25007 30.5001C1.55001 30.5001 1.8499 30.3857 2.07876 30.1569L15.0781 17.1574L28.0776 30.1569C28.3064 30.3857 28.6063 30.5001 28.9062 30.5001C29.2062 30.5001 29.5061 30.3857 29.7349 30.1569C30.1926 29.6992 30.1926 28.9572 29.7349 28.4996L16.7355 15.5001Z"
                    fill="#BDC7D9" />
            </svg>
        </button>
        <Transition name="delete-appearing">
            <div v-if="isDeleted" class="product-card-table__deleted">
                <p>Товар удален</p>
                <div class="product-card-table__deleted-controls">
                    <button @click="hideDeleted" class="product-card-table__deleted-hide">
                        Скрыть
                    </button>
                    <button @click="undoDelete" class="product-card-table__deleted-undo">
                        Вернуть
                    </button>
                </div>
            </div>
        </Transition>
        <div v-if="isPending" class="loader-wrapper">
            <div class="basket-loader" />
        </div>
    </div>
</template>
<script setup lang="ts">
interface IProps {
    item: OrderItem,
}
import type { OrderItem } from '@/helpers/api/orderItems';
import type { ApiResponse } from '@/helpers/api/apiResponse';

import { computed, ref } from 'vue';

import { CounterBlock } from '../counterBlock';
import { useDebounceFn, useVModel } from '@vueuse/core';
import { useFetchApi } from '@/composables/useFetchApi';

const props = defineProps<IProps>();
const emit = defineEmits(['update:item', 'deleteItem']);
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

const isPending = ref<Boolean>(false);
const changeBasket = useDebounceFn(async () => {
    isPending.value = true;

    // eslint-disable-next-line no-unused-vars
    const { data: responseData } = await useFetchApi<ApiResponse>('/Api/Basket/change', {
        method: 'PUT',
        body: JSON.stringify({
            id: props.item.id,
            count: props.item.quantity
        })
    });

    if (responseData.value.status) {
        // @ts-ignore
        showDanger('Произошла непредвиденная ошибка');
    }

    isPending.value = false;
}, 950);
const changePoddons = () => {
    model.value.quantity = Number.parseFloat((model.value.poddonsCount * model.value.quantityPerPoddon).toFixed(2));
    model.value.totalPrice = Number.parseFloat((model.value.quantity * model.value.price).toFixed(2));
    changeBasket();
}
const changeQuantity = () => {
    model.value.poddonsCount = Math.ceil(model.value.quantity / model.value.quantityPerPoddon);
    model.value.totalPrice = Number.parseFloat((model.value.quantity * model.value.price).toFixed(2));
    changeBasket();
}
const isDeleted = ref(false);
const deleteProductBasket = async () => {

    isPending.value = true;
    const { data: response } = await useFetchApi<ApiResponse>('/Api/Basket/remove', {
        method: 'POST',
        body: JSON.stringify({
            id: model.value.id
        })
    });
    if (response.value.status) {
        // @ts-ignore
        showDanger('Произошла непредвиденная ошибка');
    }
    model.value.countable = false;
    isPending.value = false;
    isDeleted.value = true;
}
const undoDelete = async () => {

    const { data: response } = await useFetchApi<ApiResponse>('/Api/Basket/add', {
        method: 'POST',
        body: JSON.stringify({
            id: model.value.id,
            count: model.value.quantity
        })
    });
    if (response.value.status) {
        // @ts-ignore
        showDanger('Произошла непредвиденная ошибка');
    }

    model.value.countable = true;
    isDeleted.value = false;
}

const rootElement = ref<HTMLElement>();
const hideDeleted = () => {
    if (rootElement.value) {
        const duration = 350;
        const startHeight = rootElement.value.getBoundingClientRect().height;
        const keyframes = [
            { height: `${startHeight}px` },
            { height: "0px", padding: 0, opacity: 0 },
        ];

        const timing = {
            duration: duration,
            iterations: 1,
            easing: 'ease-out'
        };
        rootElement.value.animate(keyframes, timing);

        setTimeout(() => {
            emit('deleteItem', props.item);
        }, duration - 10);
    }
}

</script>
<style lang="scss">
.delete-appearing-enter-active,
.delete-appearing-leave-active {
    transition: opacity 0.3s ease-out;
}

.delete-appearing-enter-to,
.delete-appearing-leave-from {
    opacity: 1;
}

.delete-appearing-enter-from,
.delete-appearing-leave-to {
    opacity: 0;
}

.product-card-table {
    position: relative;
    overflow: hidden;

    &__rm {
        position: absolute;
        top: 20px;
        right: 22px;
        width: fit-content;
        height: fit-content;

        @media (min-width : 1024px) {
            right: 25px;
        }

        @media (min-width : 1280px) {
            top: 0;
            bottom: 0;
            right: 11px;
            margin: auto;
        }

        @media (min-width : 1920px) {
            top: 0;
            bottom: 0;
            right: 40px;
            margin: auto;
        }
    }

    &__deleted {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: var(--white);
        border: 2px solid var(--ozone);
        border-radius: 10px;
        font-size: 20px;

        &-controls {
            display: flex;
            gap: 12px;
        }

        &-undo {
            color: var(--ozone);
        }

        &-hide {
            color: var(--red);
        }

        &>* {
            height: fit-content;
        }
    }
}

.loader-wrapper {
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