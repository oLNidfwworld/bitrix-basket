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
                        <RadioBox prefix="pid" v-model:picked="currentPersonType" v-for="(item) in personTypes"
                            :key="item.id" :text="item.name" name="personType" :id="item.id" :value="item.id" />
                    </div>
                </div>
                <InputBox v-model:modelValue="currentOrderProps[index].value" v-for="(item, index) in currentOrderProps"
                    :key="index" :placeholder="item.placeholder" :field="item" type="text" />
            </div>
            <div class="order-block__final-wrapper">
                <div class="order-block__final">
                    <div class="order-block__final-checkbox">
                        <RadioBox prefix="paysystems" v-model:picked="currentPaySystem"
                            v-for="(item) in currentPaySystems" :key="item.id" :text="item.name" name="paysys"
                            :id="item.id" :value="item.id" />
                    </div>
                    <!-- <div class="order-block__payment-notice">
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
                    </div> -->
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
import type { ApiResponse } from '@/helpers/api/apiResponse';
import type { OrderPayPersonFields, RequestFields } from '@/helpers/api/orderFields';
import { ref, shallowReactive, shallowRef, watch } from 'vue';

interface IProps {
    payPersonFields: Array<OrderPayPersonFields>
}

const props = defineProps<IProps>();

const personTypes = shallowReactive(props.payPersonFields.map(payPerson => payPerson.personType));
const currentOrderProps = shallowRef(props.payPersonFields[0].orderProps);
const currentPaySystems = shallowRef(props.payPersonFields[0].paysystems);

const currentPersonType = ref(props.payPersonFields[0].personType.id);
const currentPaySystem = ref(props.payPersonFields[0].paysystems[0].id);


watch(() => currentPersonType.value, (newPayer) => {
    const findedPayPersonFields = props.payPersonFields.find((payPersonField) => payPersonField.personType.id === newPayer);

    if (findedPayPersonFields) {
        currentOrderProps.value = findedPayPersonFields.orderProps;
        currentPaySystems.value = findedPayPersonFields.paysystems;
        currentPaySystem.value = currentPaySystems.value[0].id;
    }

});



const submit = async () => {
    const sendData: RequestFields = {
        personType: currentPersonType.value,
        paysystemId: currentPaySystem.value,
        fields: currentOrderProps.value.map((el) => { return { code: el.code, value: el.value } })
    };
    console.log(sendData);
    const { data: response } = await useFetchApi<ApiResponse>('/Api/Order/create', { method: 'POST', body: JSON.stringify(sendData) });
    if (response.value.status === false) {
        location.href = '/catalog';
    } else {
        // @ts-ignore
        if ('showDanger' in window && typeof showDanger === 'function') {

            // @ts-ignore
            showDanger('Произошла непредвиденная ошибка');
        }
    }
}

</script>
<style>
.order-block__final-checkbox {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
