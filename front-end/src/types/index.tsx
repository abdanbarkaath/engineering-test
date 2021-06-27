import { Person } from "shared/models/person";
import { RolllStateType } from "shared/models/roll";

export interface StoreState {
  students: Person[];
  rollStatus: RolllStateType | "all";
}

export interface NameDisplay {
  name: string,
  value: string
}

export interface RollStatusPayload {
  type: string,
  id: number
}
