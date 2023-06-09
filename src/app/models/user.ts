import { Address } from "./address"
import { Role } from "./role"

export type User = {
  id: string,
  email: string,
  firstname?: string,
  lastname?: string,
  phone?: string,
  birthDate?: Date,
  createdAt: Date,
  updatedAt: Date,
  disabledAt?: Date,
  restaurant: number,
  roles: Role[],
  addresses: Address[]
}


