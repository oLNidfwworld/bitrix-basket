<template>
    <div class="inpt-box">
        <div class="inpt-box__name">
            {{ field.name }} <span v-if="requiredComputed" class="text-red-required">*</span>
        </div>
        <input :type="(type as string)" :required="requiredComputed" class="inpt"
            :placeholder="(placehodler as string)" />
    </div>
</template>
<script setup lang="ts">
import type { OrderProps } from '@/helpers/api/orderFields';
import { computed, useAttrs } from 'vue';

interface IProps {
    field: OrderProps
}

defineOptions({
    inheritAttrs: false,
});
const { placehodler, required, type } = useAttrs();
const props = defineProps<IProps>();

const requiredComputed = computed(() => {
    return required !== undefined;
})

</script>