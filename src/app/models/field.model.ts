export class Field {
  id?: string;
  name?: string;
  from_class?: boolean;
  read_only?: boolean;
  descriptors?: FieldDescriptor[];
  presentation_type_id: string;
}

export class FieldDescriptor {
  id?: string;
  title?: string;
  description?: string;
  ordinal?: number;
  read_only?: boolean;
  fields?: Field[]; // fiele descriptors used as types may have an array of fields
}

export class FieldDescriptorClass {
  id?: string;
  title?: string;
  class_name?: string;
  class_field?: string;
  restrict_by_owner?: boolean;
  owner_field_name?: string;
}

export class FieldValue {
  master_id: string;
  field_id: string;
  value: string;
}
