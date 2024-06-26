type MeasureType = 'шт' | 'м'

type OrderItemRaw = {
  id: number
  img: string
  measure: MeasureType
  name: string
  price: number
  quantity: number
  quantityPerPoddon: number
  totalPrice: number
  detailPageUrl: string
}
type OrderItem = {
  id: number
  img: string
  measure: MeasureType
  name: string
  price: number
  quantity: number
  quantityPerPoddon: number
  totalPrice: number
  poddonsCount: number
  detailPageUrl: string
  countable: boolean
}

export type { OrderItem, OrderItemRaw, MeasureType }
