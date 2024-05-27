<template>
    <div class="radio">
        <input required v-model="pickedModel" type="radio" :name="name" :value="value" :id="prefix + id" />
        <label :for="prefix + id">{{ text }}</label>
    </div>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { useAttrs } from 'vue';

interface IProps {
    text: string,
    prefix: string,
    picked: string | number
}

defineOptions({
    inheritAttrs: false,
});
const emit = defineEmits(['update:picked']);
const props = defineProps<IProps>();
const { id, name, value } = useAttrs() as {
    id: string | undefined,
    name: string | undefined,
    value: any | undefined,
}
const pickedModel = useVModel(props, 'picked', emit);
</script>
<style scoped>
.radio input {
    width: 1px;
    height: 1px;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 15px;
}

input[type="radio"]:user-invalid+label::before {
    background: var(--red) !important;
}
</style>