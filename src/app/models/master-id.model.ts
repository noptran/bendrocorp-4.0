import { FieldDescriptor } from "./field.model";

export class MasterId {
  id?: string;
  type_id?: string;
  type?: FieldDescriptor;
  owner_id?: number;
  update_role_id?: number;
}