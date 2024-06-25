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
                <InputBox v-model:modelValue="currentOrderProps[index].value"
                    v-for="(item, index) in (currentOrderProps)" :key="index" :placeholder="item.placeholder"
                    :field="item" type="text" />
                <div class="order-block__delivery-group">
                    <div class="inpt-box__name">
                        Способ доставки<span class="text-red-required">*</span>
                    </div>
                    <div class="inpt-box__radios">
                        <template v-if="currentDelivery">
                            <RadioBox prefix="delivery" v-model:picked="currentDelivery" preference="type-2"
                                :img="item.logo" v-for="(item, index) in allDeliviries" :key="index" :text="item.name"
                                name="delivery" :id="item.code" :value="item.id" />
                        </template>
                    </div>
                    <div class="order-block__delivery-group-inputs">
                        <template v-if="typeOfDelivery === 'Доставка'">
                            <InputBox v-if="adressProp" v-model:modelValue="adressProp.value"
                                :placeholder="adressProp.placeholder" :field="adressProp" />
                        </template>
                        <template v-else-if="typeOfDelivery === 'Самовывоз'">
                            <div class="inpt-box">
                                <RadioBox v-for="(item, index) in allPickPoints" required
                                    v-model:picked="currentPickPoint" prefix="pickpoint" :key="index" :text="item.name"
                                    name="pickpoints" :id="item.code" :value="item.id" />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="order-block__final-wrapper">
                <div class="order-block__final">
                    <div v-if="currentPaySystem" class="order-block__final-checkbox">
                        <div v-for="(item) in currentPaySystems" class="relative">

                            <RadioBox prefix="paysystems" v-model:picked="currentPaySystem" :key="item.id"
                                :text="item.name" name="paysys" :id="item.id" :value="item.id" />
                            <div v-if="item.id === currentPaySystem" class="order-block__payment-notice">
                                <p class="order-block__payment-notice-text">{{ item.desc }}</p>
                                <div class="order-block__payment-notice-part"> <svg width="20" height="17"
                                        viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.52628 0L19.0526 16.5H0L9.52628 0Z" fill="#BDC7D9"></path>
                                    </svg> </div>
                            </div>
                        </div>
                    </div>
                    <p class="order-block__terms-notice">
                        Нажимая на кнопку я принимаю
                        <a class="inline-link" href="/privacy/">правила и условия </a> и
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
import type { OrderPropValues, Paysystem, PersonType, OrderPayPersonFields, RequestFields, Delivery, OrderDeliveries, Pickup } from '@/helpers/api/orderFields';
import { computed, ref, shallowReactive, shallowRef, watch } from 'vue';

interface IProps {
    payPersonFields: Array<OrderPayPersonFields>,
    orderDeliviries: OrderDeliveries,
    prefilledPayPerson?: number
}

const props = defineProps<IProps>();

const currentPersonType = ref(props.prefilledPayPerson ? props.prefilledPayPerson : props.payPersonFields[0].personType.id);

const personTypes = shallowReactive<PersonType[]>(props.payPersonFields.map(payPerson => payPerson.personType));

const currentOrderProps = shallowRef<OrderPropValues[]>();
const currentPaySystems = shallowRef<Paysystem[]>();
const currentPaySystem = ref<string>();
const allDeliviries = ref<Delivery[]>([...props.orderDeliviries.variants]);
const currentDelivery = ref<string>();

const allPickPoints = ref<Pickup[]>([...props.orderDeliviries.pickups]);
const currentPickPoint = ref<string>('');

const typeOfDelivery = computed(() => {
    return allDeliviries.value?.find(delivery => delivery.id === currentDelivery.value)?.name
});

const adressProp = ref<OrderPropValues>();

const setFieldsAsPayperson = (pid: number) => {
    const findedPayPersonFields = props.payPersonFields.find((payPersonField) => (payPersonField.personType.id).toString() === pid.toString());
    if (findedPayPersonFields) {
        currentOrderProps.value = findedPayPersonFields.orderProps.filter(orderProp => orderProp.isAddress === false);
        adressProp.value = findedPayPersonFields.orderProps.find(orderProp => orderProp.isAddress === true);

        currentPaySystems.value = findedPayPersonFields.paysystems;
        currentPaySystem.value = currentPaySystems.value[0].id;
        currentDelivery.value = allDeliviries.value[0].id;
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

    if (currentPaySystem.value && currentDelivery.value && currentOrderProps.value) {


        const sendData: RequestFields = {
            personType: currentPersonType.value,
            paysystemId: currentPaySystem.value,
            fields: currentOrderProps.value.map((el) => { return { code: el.code, value: el.value } }),
            deliveryId: currentDelivery.value
        };

        if (typeOfDelivery.value === 'Доставка') {
            if (adressProp.value) {
                sendData.fields = [
                    ...sendData.fields,
                    {
                        code: adressProp.value?.code,
                        value: adressProp.value?.value
                    }
                ]
            }
        } else if (typeOfDelivery.value === 'Самовывоз') {
            sendData.pickPoint = currentPickPoint.value;
        }

        pendingOrder.value = true;
        const { data: response } = await useFetchApi<
            ApiResponse<{
                orderId: string | number,
                result: unknown
            }>
        >('/Api/Order/create', { method: 'POST', body: JSON.stringify(sendData) });
        if (response.value.status !== true) {
            location.href = `/personal/orders/${response.value.data.orderId}`;
        } else {
            console.warn(response.value);
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

.order-block__delivery-group-inputs {
    margin-top: 15px;
}
</style>
