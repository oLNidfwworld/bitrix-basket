<template>
    <div :class="{ 'radio': preference === 'type-1', 'radio-type-2': preference === 'type-2' }">
        <input required v-model="pickedModel" type="radio" :name="name" :value="value" :id="prefix + id" />
        <label v-if="preference === 'type-1'" :for="prefix + id">
            <div class="radio__wrapper">
                <div class="radio__text">
                    <div v-if="text">
                        {{ text }}
                    </div>
                    <slot v-else-if="$slots.default" />
                    <slot v-if="$slots.additional" name="additional" />
                </div>
                <div class="radio__question-label" v-if="questionText" @mouseenter="questionLabelMouseEnter"
                    @mouseleave="questionLabelMouseLeave">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_3169_20308)">
                            <path
                                d="M15 20C15.2463 20.0001 15.4902 20.0487 15.7177 20.143C15.9453 20.2373 16.152 20.3756 16.3261 20.5498C16.5002 20.724 16.6383 20.9308 16.7325 21.1584C16.8266 21.386 16.8751 21.6299 16.875 21.8762C16.8749 22.1226 16.8263 22.3664 16.732 22.594C16.6377 22.8215 16.4994 23.0282 16.3252 23.2023C16.151 23.3764 15.9442 23.5145 15.7166 23.6087C15.489 23.7029 15.2451 23.7513 14.9987 23.7512C14.5013 23.7511 14.0243 23.5533 13.6727 23.2015C13.321 22.8496 13.1236 22.3724 13.1237 21.875C13.1239 21.3776 13.3217 20.9005 13.6735 20.5489C14.0254 20.1973 14.5026 19.9998 15 20ZM16.25 17.5C16.25 16.7987 16.76 15.9688 17.41 15.61C18.3265 15.1019 19.0613 14.32 19.5115 13.3738C19.9618 12.4275 20.1051 11.3642 19.9212 10.3325C19.5675 8.315 17.9112 6.66 15.895 6.3075C15.172 6.17849 14.4295 6.20933 13.7197 6.39785C13.0099 6.58637 12.35 6.928 11.7863 7.39875C11.2265 7.86763 10.7764 8.45361 10.4678 9.11537C10.1591 9.77713 9.99946 10.4986 10 11.2288C10 11.5603 10.1317 11.8782 10.3661 12.1126C10.6005 12.3471 10.9185 12.4788 11.25 12.4788C11.5815 12.4788 11.8995 12.3471 12.1339 12.1126C12.3683 11.8782 12.5 11.5603 12.5 11.2288C12.4995 10.8609 12.5802 10.4974 12.7363 10.1643C12.8925 9.83119 13.1202 9.53665 13.4033 9.30169C13.6864 9.06672 14.0178 8.89713 14.374 8.80501C14.7301 8.71289 15.1022 8.70051 15.4638 8.76875C15.9569 8.86527 16.4102 9.10663 16.7655 9.46198C17.1209 9.81734 17.3622 10.2706 17.4587 10.7638C17.5575 11.2823 17.4892 11.8189 17.2636 12.2962C17.0381 12.7735 16.667 13.167 16.2038 13.42C14.7587 14.2163 13.75 15.8938 13.75 17.5C13.75 17.8315 13.8817 18.1495 14.1161 18.3839C14.3505 18.6183 14.6685 18.75 15 18.75C15.3315 18.75 15.6495 18.6183 15.8839 18.3839C16.1183 18.1495 16.25 17.8315 16.25 17.5ZM30 23.75V6.25C30 2.80375 27.1963 0 23.75 0H6.25C2.80375 0 0 2.80375 0 6.25V23.75C0 27.1963 2.80375 30 6.25 30H23.75C27.1963 30 30 27.1963 30 23.75ZM23.75 2.5C25.8175 2.5 27.5 4.1825 27.5 6.25V23.75C27.5 25.8175 25.8175 27.5 23.75 27.5H6.25C4.1825 27.5 2.5 25.8175 2.5 23.75V6.25C2.5 4.1825 4.1825 2.5 6.25 2.5H23.75Z"
                                fill="#BDC7D9" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3169_20308">
                                <rect width="30" height="30" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
            <Transition name="label-appear">
                <div v-if="questionText && questionLabelActive" class="order-block__payment-notice">
                    <p class="order-block__payment-notice-text">{{ questionText }}</p>
                    <div style="transform: rotate(180deg)" class="order-block__payment-notice-part">
                        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.52628 0L19.0526 16.5H0L9.52628 0Z" fill="#BDC7D9"></path>
                        </svg>
                    </div>
                </div>
            </Transition>
        </label>

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
    questionText?: string
}

import { useVModel } from '@vueuse/core';
import { ref, useAttrs } from 'vue';

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

const questionLabelActive = ref(false);
const questionLabelMouseEnter = () => {
    questionLabelActive.value = true;
}
const questionLabelMouseLeave = () => {
    questionLabelActive.value = false;
}

const pickedModel = useVModel(props, 'picked', emit);
</script>
<style>
.radio input {
    width: 1px;
    height: 1px;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 15px;
}

.radio__wrapper {
    width: 100%;
}

input[type="radio"]:user-invalid+label::before {
    background: var(--red) !important;
}

.order-block__payment-notice {
    position: absolute;
    bottom: calc(100% - -15px);
    right: -20px;
}

.order-block__payment-notice-part {
    transform: rotate(180deg);
    right: 25px;
    top: 97%;
}

.label-appear-enter-active,
.label-appear-leave-active {
    transition: 0.3s opacity ease-out;
}

.label-appear-enter-from,
.label-appear-leave-to {
    opacity: 0;
}
</style>