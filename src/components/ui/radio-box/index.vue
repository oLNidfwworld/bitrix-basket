<template>
    <div class="radio">
        <input v-model="pickedModel" type="radio" :name="name" :value="value" :id="id" />
        <label :for="id">{{ text }}</label>
    </div>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { useAttrs } from 'vue';

interface IProps {
    text: string,
    picked: string
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