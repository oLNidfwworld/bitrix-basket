<template>
    <div class="order-block">
        <h2 class="style-some-title title-margin">Данные для оплаты</h2>
        <form @submit.prevent="submit" class="order-block__wrapper">
            <div v-if="currentOrderProps" class="order-block__udata">
                <div class="inpt-box order-block__person-group">
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
                    <div class="order-block__delivery-group-inputs">
                        <template v-if="typeOfDelivery === 'Доставка'">
                            <InputBox v-if="adressProp" v-model:modelValue="adressProp.value"
                                :placeholder="adressProp.placeholder" :field="adressProp" />
                        </template>
                        <template v-else-if="typeOfDelivery === 'Самовывоз'">
                            <div class="inpt-box">
                                <div class="inpt-box__name">
                                    Пункт выдачи заказа
                                </div>
                                <div class="inpt-box__radios">
                                    <RadioBox v-for="(item, index) in allPickPoints" required
                                        v-model:picked="currentPickPoint" prefix="pickpoint" :key="index"
                                        :text="item.name" name="pickpoints" :id="item.code" :value="item.id" />
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="order-block__final-wrapper">
                <div class="order-block__final">
                    <div v-if="currentPaySystem" class="order-block__final-checkbox">
                        <div class="order-block__final-group">
                            <h3>Способы оплаты</h3>
                            <RadioBox v-for="(item) in currentPaySystems" prefix="paysystems"
                                v-model:picked="currentPaySystem" :key="item.id" :text="item.name" name="paysys"
                                :id="item.id" :value="item.id" :questionText="item.desc" />
                        </div>
                        <div class="order-block__final-group">
                            <h3>Способы доставки</h3>
                            <template v-if="currentDelivery">
                                <RadioBox prefix="delivery" v-model:picked="currentDelivery" :img="item.logo"
                                    v-for="(item, index) in allDeliviries" :key="index" :text="item.name"
                                    :questionText="item.desc" name="delivery" :id="item.code" :value="item.id" />
                            </template>
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
const currentDelivery = ref<string>(allDeliviries.value[0].id);

const allPickPoints = ref<Pickup[]>([...props.orderDeliviries.pickups]);
const currentPickPoint = ref<string>(allPickPoints.value.find(pickPoint => pickPoint.isDefault === true)?.id ?? '');

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
.order-block__final-group {
    margin-bottom: 20px;
}

.order-block__final-group h3 {
    display: block;
    color: var(--blue);
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
}

.order-block__final-checkbox {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.order-block__person-group {
    grid-column: span 2;
}

.order-block__delivery-group {
    grid-column: span 2;
}
</style>
