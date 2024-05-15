<template>
    <div class="inpt-box">
        <div class="inpt-box__name">
            {{ field.name }} <span v-if="requiredComputed" class="text-red-required">*</span>
        </div>
        <input :type="(inputType as string)" :required="requiredComputed" class="inpt"
            :placeholder="(placehodler as string)" v-model="internalModelValue" />
    </div>
</template>
<script setup lang="ts">
import type { OrderProps } from '@/helpers/api/orderFields';
import { useVModel } from '@vueuse/core';
import { computed, useAttrs } from 'vue';

interface IProps {
    field: OrderProps,
    modelValue?: any,
}

defineOptions({
    inheritAttrs: false,
});
const { placehodler, required, type } = useAttrs();
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

const inputType = computed(() => {
    if (props.field.isPhone) {
        return 'number';
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


</script>