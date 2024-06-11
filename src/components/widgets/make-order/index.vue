<template>
    <div class="order-block">
        <h2 class="style-some-title title-margin">Данные для оплаты</h2>
        <form @submit.prevent="submit" class="order-block__wrapper">
            <div v-if="currentOrderProps" class="order-block__udata">
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
                    <div v-if="currentPaySystem" class="order-block__final-checkbox">
                        <RadioBox prefix="paysystems" v-model:picked="currentPaySystem"
                            v-for="(item) in currentPaySystems" :key="item.id" :text="item.name" name="paysys"
                            :id="item.id" :value="item.id" />
                    </div>
                    <p class="order-block__terms-notice">
                        Нажимая на кнопку я принимаю
                        <a class="inline-link" href="link/to/terms">правила и условия </a> и
                        согласен с ними
                    </p>
                    <button :inert="pendingOrder" class="dark btn w-fit order-block__submit" type="submit">
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
import type { OrderPropValues, Paysystem, PersonType, OrderPayPersonFields, RequestFields } from '@/helpers/api/orderFields';
import { ref, shallowReactive, shallowRef, watch } from 'vue';

interface IProps {
    payPersonFields: Array<OrderPayPersonFields>,
    prefilledPayPerson?: number
}

const props = defineProps<IProps>();

const currentPersonType = ref(props.prefilledPayPerson ? props.prefilledPayPerson : props.payPersonFields[0].personType.id);

const personTypes = shallowReactive<PersonType[]>(props.payPersonFields.map(payPerson => payPerson.personType));

const currentOrderProps = shallowRef<OrderPropValues[]>();
const currentPaySystems = shallowRef<Paysystem[]>();
const currentPaySystem = ref<string>();

const setFieldsAsPayperson = (pid: number) => {
    const findedPayPersonFields = props.payPersonFields.find((payPersonField) => (payPersonField.personType.id).toString() === pid.toString());
    if (findedPayPersonFields) {
        currentOrderProps.value = findedPayPersonFields.orderProps;
        currentPaySystems.value = findedPayPersonFields.paysystems;
        currentPaySystem.value = currentPaySystems.value[0].id;
    }
}

setFieldsAsPayperson(currentPersonType.value);

watch(() => currentPersonType.value, (newPayer) => {
    setFieldsAsPayperson(newPayer);
});



const pendingOrder = ref(false);

const submit = async () => {

    if (pendingOrder.value)
        return;

    if (currentPaySystem.value && currentOrderProps.value) {

        const sendData: RequestFields = {
            personType: currentPersonType.value,
            paysystemId: currentPaySystem.value,
            fields: currentOrderProps.value.map((el) => { return { code: el.code, value: el.value } })
        };

        pendingOrder.value = true;
        const { data: response } = await useFetchApi<
            ApiResponse<{
                orderId: string | number,
                result: unknown
            }>
        >('/Api/Order/create', { method: 'POST', body: JSON.stringify(sendData) });
        if (response.value.status !== false) {
            location.href = `/personal/orders/${response.value.data.orderId}`;
        } else {
            // @ts-ignore
            if ('showDanger' in window && typeof showDanger === 'function') {

                // @ts-ignore
                showDanger('Произошла непредвиденная ошибка');
            }
        }
        pendingOrder.value = false
    } else {
        console.warn('something went wrond with currentPaySys and/or currentOrderProps');
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
