<template>
    <div class="inpt-box">
        <div class="inpt-box__name">
            {{ field.name }} <span v-if="requiredComputed" class="text-red-required">*</span>
        </div>
        <input v-if="isPhone" v-imask="mask" :type="(inputType as string)" :required="requiredComputed" class="inpt"
            :placeholder="(placeholderComputed as string)" v-bind="phoneAttrs" v-model="internalModelValue" />

        <input v-else :type="(inputType as string)" :required="requiredComputed" class="inpt"
            :placeholder="(placeholderComputed as string)" v-bind="phoneAttrs" v-model="internalModelValue" />
    </div>
</template>
<script setup lang="ts">
import type { OrderProp } from '@/helpers/api/orderFields';
import { useVModel } from '@vueuse/core';
import { computed, onUpdated, ref, useAttrs } from 'vue';
import { IMaskDirective } from 'vue-imask';

interface IProps {
    field: OrderProp,
    modelValue?: any,
}

defineOptions({
    inheritAttrs: false,
});
const { placeholder, required, type } = useAttrs();
const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue']);
const internalModelValue = useVModel(props, 'modelValue', emit);

const requiredComputed = computed(() => {
    if (props.field.required) {
        return true;
    } else if (required !== undefined) {
        return true;
    } else {
        return false;
    }
});

const isPhone = computed(() => props.field.isPhone);
const vImask = IMaskDirective;
const mask = ref('+{7} 000 000-00-00');

const inputType = computed(() => {
    if (isPhone.value) {
        return 'tel';
    } else if (props.field.isEmail) {
        return 'email';
    } else if (props.field.type === "NUMBER") {
        return 'number';
    } else if (type !== undefined) {
        return type;
    } else {
        return 'text';
    }
})

const phoneAttrs = computed(() => {
    if (isPhone.value) {
        return {
            pattern: '[\\+][7][\\s][\\d][\\d][\\d][\\s][\\d][\\d][\\d][\\-][\\d][\\d][\\-][\\d][\\d]'
        }
    } else {
        return null;
    }
})

const placeholderComputed = computed(() => {
    if (props.field.placeholder) {
        return props.field.placeholder
    } else if (placeholder !== undefined || placeholder !== '') {
        return placeholder
    } else {
        return '';
    }
});

</script>