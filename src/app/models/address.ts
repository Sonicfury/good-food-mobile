export type Address = {
  id: string,
  name: string,
  main: boolean,
  address1: string,
  address2?: string,
  zipCode: string,
  city: string,
  phone?: string,
  note?: string,
  createdAt: Date,
  updatedAt: Date
}
