<template>
    <div class="order-block">
        <h2 class="style-some-title title-margin">Данные для оплаты</h2>
        <form @submit.prevent="submit" class="order-block__wrapper">
            <div class="order-block__udata">
                <div class="inpt-box">
                    <div class="inpt-box__name">
                        Заказчик<span class="text-red-required">*</span>
                    </div>
                    <div class="inpt-box__radios">
                        <RadioBox v-model:picked="currentPersonType" v-for="(item, index) in personTypes" :key="index"
                            :text="item.name" name="personType" :id="item.id" :value="item.id" />
                    </div>
                </div>
                <InputBox v-model:modelValue="currentOrderProps[index].value" v-for="(item, index) in currentOrderProps"
                    :key="index" :placeholder="item.placeholder" :field="item" type="text" />
            </div>
            <div class="order-block__final-wrapper">
                <div class="order-block__final">
                    <div class="order-block__final-checkbox checkbox">
                        <input type="checkbox" checked id="pay-pocket" name="pocket" /><label for="pay-pocket">Оплата по
                            счёту для юридических лиц</label>
                    </div>
                    <div class="order-block__payment-notice">
                        <p class="order-block__payment-notice-text">
                            Оплата производится по счету, который выставляет менеджер на
                            основании Ваших реквизитов.
                        </p>
                        <div class="order-block__payment-notice-part">
                            <svg width="20" height="17" viewBox="0 0 20 17" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.52628 0L19.0526 16.5H0L9.52628 0Z" fill="#BDC7D9" />
                            </svg>
                        </div>
                    </div>
                    <p class="order-block__terms-notice">
                        Нажимая на кнопку я принимаю
                        <a class="inline-link" href="link/to/terms">правила и условия </a> и
                        согласен с ними
                    </p>
                    <button class="dark btn w-fit order-block__submit" type="submit">
                        Подтвердить заказ
                    </button>
                </div>
            </div>
        </form>
    </div>

</template>
<script setup lang="ts">
import { InputBox } from '@/components/ui/input-box';
import { RadioBox } from '@/components/ui/radio-box';
import { useFetchApi } from '@/composables/useFetchApi';
import type { OrderProps, PersonType, OrderPropsValues, OrderPropsBitrix } from '@/helpers/api/orderFields';
import { toOrderProps } from '@/helpers/converters';
import { ref, shallowReactive, shallowRef, watch } from 'vue';

const { data: response } = await useFetchApi<{
    orderProps: Array<OrderPropsBitrix>,
    personTypes: Array<PersonType>
}>('/Api/Order');

const personTypes = shallowReactive<Array<PersonType>>(response.value.personTypes);
const currentPersonType = ref(personTypes[0].id as unknown as string);

const orderProps = toOrderProps(response.value.orderProps);
const currentOrderProps = shallowRef<Array<OrderPropsValues>>([]);
const getPropsFromPid = () => {
    const currentOrderProps = orderProps.filter(prop => prop.pid === (currentPersonType.value as unknown as number));
    return currentOrderProps as OrderPropsValues[];
}
currentOrderProps.value = getPropsFromPid();

watch(() => currentPersonType.value, () => currentOrderProps.value = getPropsFromPid());

const submit = () => {
    console.log(currentOrderProps.value);
}
</script>
