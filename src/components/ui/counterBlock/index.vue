<template>
    <div :inert="(inert) ? true : false" class="product-card-table__quantity-block quantity-block"
        :class="{ 'light': theme === 'light' }">
        <button @click="decrease" class="quantity-block__button">
            <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3.11501V0.88501H5.56V3.11501H0Z" fill="white" />
            </svg>
        </button>
        <div class="quantity-block__count-wrapper">
            <input class="quantity-block__count" type="number" :value="modelValue" />
            <span class="quantity-block__measure" v-html="measureString" />
        </div>
        <button @click="increase" class="quantity-block__button">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.85006 11.02V6.90998H0.560059V5.08998H4.85006V0.97998H6.75006V5.08998H11.0401V6.90998H6.75006V11.02H4.85006Z"
                    fill="white" />
            </svg>
        </button>
    </div>
</template>
<script setup lang="ts">
interface IProps {
    theme?: 'light' | 'dark',
    step?: number,
    measureType: 'шт' | 'м'
    modelValue: number
}

import { useVModel } from '@vueuse/core';
import { computed, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false,
});
const attrs = useAttrs();
const { inert } = attrs;

const emit = defineEmits(['update:modelValue', 'valuesChanging']);
const props = withDefaults(defineProps<IProps>(), {
    theme: 'dark',
    step: 1
});
const innerValue = useVModel(props, 'modelValue', emit);
const decrease = () => {
    if (innerValue.value) {
        const newValue = innerValue.value - props.step;
        if (!(newValue <= 0)) {
            innerValue.value = newValue;
        }
    }
    emit('valuesChanging');
}
const increase = () => {
    if (innerValue.value) {
        innerValue.value += props.step;
    }
    emit('valuesChanging');
}

const measureString = computed(() => {
    switch (props.measureType) {
        case 'шт':
            return 'шт';
        case 'м':
            return 'м<sup>2</sup>';
        default:
            return '';
    }
})

</script>