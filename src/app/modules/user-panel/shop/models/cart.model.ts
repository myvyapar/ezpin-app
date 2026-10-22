export interface Cart {
    products: Product[],
    currency: string,
    type: string
}

interface Product {
    id: number,
    count: number,
    price: number
}