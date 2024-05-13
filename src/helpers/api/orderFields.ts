type PersonType = {
  id: number
  name: string
  code: string
}

type OrderProps = {
  id: number
  name: string
  pid: number
  type: string
  code: string
  isZip: string
  isPhone: string
  isAddress: string
  isAdressFrom: string
  isAddressTo: string
}

type PersonFields = {
  personType: PersonType
  orderProps: Array<OrderProps>
}

export type { PersonFields, PersonType, OrderProps }
