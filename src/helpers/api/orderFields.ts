type PersonType = {
  id: number
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

type OrderProps = {
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

interface OrderPropsValues extends OrderProps {
  value: any
}

type PersonFields = {
  personType: PersonType
  orderProps: Array<OrderProps>
}

type RequestFields = {
  personType: string
  fields: Array<{
    code: string
    value: string
  }>
}

export type {
  PersonFields,
  PersonType,
  OrderPropsValues,
  OrderPropsBitrix,
  OrderProps,
  RequestFields
}
