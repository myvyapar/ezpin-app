export interface CreateOrder{
    items:Item[],
    type:number,
    whatsapp?:string,
    phone?:string,
    email?:string,
    pin?:string,
    reference_code: string
}

interface Item{
    product_id:string,
    item_count:string,
    product_price:string
}