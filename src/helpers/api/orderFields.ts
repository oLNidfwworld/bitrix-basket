type PersonType = {
  id: number
  name: string
  code: string
}

type Paysystem = {
  id: string
  paysysId: string
  name: string
  code: string
  desc?: string
}

type OrderPropsBitrix = {
  id: number
  name: string
  pid: number
  placeholder: string | undefined
  type: string
  code: string
  isZip: 'Y' | 'N'
  isPhone: 'Y' | 'N'
  isAddress: 'Y' | 'N'
  isAdressFrom: 'Y' | 'N'
  isAddressTo: 'Y' | 'N'
  isEmail: 'Y' | 'N'
  required: 'Y' | 'N'
}
type OrderPropsBitrixAutofilled = {
  id: number
  name: string
  pid: string | undefined
  code: string
  value: string | ''
}

type Delivery = {
  id: string
  code: string
  name: string
  logo: string
  desc?: string
}

type Pickup = {
  id: string
  code: string
  name: string
  isDefault: boolean
  desc?: string
  schedule?: string
}

type OrderProp = {
  id: number
  name: string
  pid: number
  placeholder: string | undefined
  type: string
  code: string
  isZip: boolean
  isPhone: boolean
  isAddress: boolean
  isAdressFrom: boolean
  isAddressTo: boolean
  isEmail: boolean
  required: boolean
}
interface OrderPropValues extends OrderProp {
  value: any
}

type OrderDeliveries = {
  variants: Array<Delivery>
  pickups: Array<Pickup>
}

type OrderPayPersonFieldsRaw = {
  personType: PersonType
  orderProps: Array<OrderPropsBitrix>
  paysystems: Array<Paysystem>
  pickups: Array<Pickup>
  deliviries: Array<Delivery>
}

type OrderPayPersonFields = {
  personType: PersonType
  orderProps: Array<OrderPropValues>
  paysystems: Array<Paysystem>
  deliveries: Array<Delivery>
  pickups: Array<Pickup>
}

type OrderAvailableFields = {
  payerBlocks: Array<OrderPayPersonFieldsRaw>
  deliviries: OrderDeliveries
}

type RequestFields = {
  personType: string | number
  paysystemId: string | number
  fields: Array<{
    code: string
    value: string
  }>
  deliveryId: string | number
  pickPoint?: string | number
}

export type {
  OrderPropsBitrixAutofilled,
  PersonType,
  Paysystem,
  OrderPropValues,
  OrderPropsBitrix,
  OrderProp,
  RequestFields,
  OrderAvailableFields,
  OrderPayPersonFieldsRaw,
  OrderPayPersonFields,
  Delivery,
  OrderDeliveries,
  Pickup
}
