type MeasureType = 'шт' | 'м';

type OrderItemRaw = {
    id : number,
    img : string,
    measure : MeasureType,
    name : string,
    price : number,
    quantity : number,
    quantityPerPoddon : number,
    totalPrice : number,
}
type OrderItem = {
    id : number,
    img : string,
    measure : MeasureType,
    name : string,
    price : number,
    quantity : number,
    quantityPerPoddon : number,
    totalPrice : number,
    poddonsCount : number
}

export type { OrderItem, OrderItemRaw, MeasureType } 