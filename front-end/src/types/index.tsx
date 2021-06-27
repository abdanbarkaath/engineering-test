import { Person } from "shared/models/person";

export interface StoreState {
  students: Person[];
}

export interface NameDisplay {
  name: string,
  value: string
}

export interface RollStatusPayload {
  type: string,
  id: number
}
