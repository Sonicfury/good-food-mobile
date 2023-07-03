export type Order = {
  id: number,
  isTakeaway: boolean,
  total: number,
  state: string,
  customer_id: number,
  addresses_id: number,
  restaurant_id: number,
  employee_id: number,
  created_at: Date,
  updated_at: Date
}

export type OrderDetails = {
  order_id: number,
  order_total: number,
  customer: { id: number, firstname: string, lastname: string },
  address: {
    address1: string,
    address2: string,
    zipCode: string,
    city: string,
    phone: string,
  },
  products: { name: string, quantity: number }[],
}

