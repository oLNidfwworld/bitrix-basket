<template>
    <div class="product-card-table">
        <div class="product-card-table__main-info">
            <picture>
                <source :srcset="`https://romb-art.ru`+model.img" />
                <img/>
            </picture> 
            <h3 class="product-card-table__name">{{ model.name }}</h3>
        </div>
        <div class="product-card-table__price"><span class="product-card-table__hidden-header">Цена</span>
            <p>{{ priceFormated }} <span v-html="measureString"/></p>
        </div>
        <div class="product-card-table__col"><span class="product-card-table__hidden-header">Кол-во метров</span>
            <CounterBlock inert="true" :measure-type="(model.measure === 'м')?'м':'шт'" v-model:model-value="model.quantity" />
        </div>
        <div class="product-card-table__col"><span class="product-card-table__hidden-header">Кол-во поддонов</span>
            <CounterBlock  measure-type="шт" v-model:model-value="model.poddonsCount" theme="light"/>
        </div>
        <div class="product-card-table__total"><span class="product-card-table__hidden-header">Итог</span>
            <p>{{totalPriceFormated}} ₽</p> 
        </div>
    </div>
</template>
<script setup lang="ts">
interface IProps {
    item : OrderItem, 
}
import type { OrderItem } from '@/helpers/api';
 
import { computed, watch } from 'vue'; 

import { CounterBlock } from '../counterBlock';
import { useDebounceFn, useVModel } from '@vueuse/core';
 
const props = defineProps<IProps>();
const emit = defineEmits(['update:item']); 
const model = useVModel(props, 'item', emit);

const priceFormated = computed( ( ) => model.value.price.toLocaleString('ru-RU'));
const totalPriceFormated = computed( ( ) => model.value.totalPrice.toLocaleString('ru-RU'));
const measureString = computed( ( ) => {
    switch (model.value.measure) {
        case 'м' :
            return '₽/м<sup>2 </sup>'; 
        case 'шт' :
            return '₽/шт' 
        default :
            return ''; 
    }
} ); 

watch( ( ) => model.value.poddonsCount, ( ) => {
    model.value.quantity = model.value.poddonsCount * model.value.quantityPerPoddon;
    model.value.totalPrice = model.value.quantity * model.value.price;
})

// watch( ( ) => model.value.quantity, ( newValue ) => {
//     fixQuantity();
// });

// const fixQuantity = useDebounceFn( ( ) => {
//     model.value.quantity = model.value.poddonsCount * model.value.quantityPerPoddon;
// }, 700);
</script>