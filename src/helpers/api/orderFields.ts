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

type OrderPayPersonFieldsRaw = {
  personType: PersonType
  orderProps: Array<OrderPropsBitrix>
  paysystems: Array<Paysystem>
}

type OrderPayPersonFields = {
  personType: PersonType
  orderProps: Array<OrderPropValues>
  paysystems: Array<Paysystem>
}

type OrderAvailableFields = {
  payerBlocks: Array<OrderPayPersonFieldsRaw>
}

type RequestFields = {
  personType: string | number
  paysystemId: string | number
  fields: Array<{
    code: string
    value: string
  }>
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
  OrderPayPersonFields
}
