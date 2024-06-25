<template>
    <div :class="{ 'radio': preference === 'type-1', 'radio-type-2': preference === 'type-2' }">
        <input required v-model="pickedModel" type="radio" :name="name" :value="value" :id="prefix + id" />

        <label v-if="preference === 'type-1'" :for="prefix + id">{{ text }}</label>
        <label v-if="preference === 'type-2'" :for="prefix + id">
            <img :src="'https://rombart.ru/' + img">
            {{ text }}
        </label>
    </div>
</template>
<script setup lang="ts">
interface IProps {
    text: string,
    prefix: string,
    picked: string | number,
    preference?: "type-1" | "type-2",
    img?: string,
}

import { useVModel } from '@vueuse/core';
import { useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false,
});
const emit = defineEmits(['update:picked']);
const props = withDefaults(defineProps<IProps>(), {
    preference: 'type-1'
});
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