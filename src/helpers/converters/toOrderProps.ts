import type { OrderProp, OrderPropsBitrix } from '../api/orderFields'

function toOrderProps(orderPropsBitrix: OrderPropsBitrix): OrderProp

function toOrderProps(orderPropsBitrix: OrderPropsBitrix[]): OrderProp[]

function toOrderProps(
  orderPropsBitrix: OrderPropsBitrix | OrderPropsBitrix[]
): OrderProp | OrderProp[] {
  if (Array.isArray(orderPropsBitrix)) {
    const converted: OrderProp[] = []
    orderPropsBitrix.forEach((orderProp) => converted.push(converToOrderProps(orderProp)))
    return converted
  } else {
    return converToOrderProps(orderPropsBitrix)
  }
}

const converToOrderProps = (orderPropsBitrix: OrderPropsBitrix): OrderProp => {
  return {
    id: orderPropsBitrix.id,
    name: orderPropsBitrix.name,
    pid: orderPropsBitrix.pid,
    placeholder: orderPropsBitrix.placeholder,
    type: orderPropsBitrix.type,
    code: orderPropsBitrix.code,
    isZip: orderPropsBitrix.isZip === 'Y' ? true : false,
    isPhone: orderPropsBitrix.isPhone === 'Y' ? true : false,
    isAddress: orderPropsBitrix.isAddress === 'Y' ? true : false,
    isAdressFrom: orderPropsBitrix.isAdressFrom === 'Y' ? true : false,
    isAddressTo: orderPropsBitrix.isAddressTo === 'Y' ? true : false,
    isEmail: orderPropsBitrix.isEmail === 'Y' ? true : false,
    required: orderPropsBitrix.required === 'Y' ? true : false
  } as OrderProp
}

export { toOrderProps }
