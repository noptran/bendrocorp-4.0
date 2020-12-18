export class Field {
  id?: string;
  name?: string;
  from_class?: boolean;
  read_only?: boolean;
  descriptors?: FieldDescriptor[];
}

export class FieldDescriptor {
  id?: string;
  title?: string;
  description?: string;
  ordinal?: number;
  read_only?: boolean;
}

export class FieldDescriptorClass {
  id?: string;
  title?: string;
  class_name?: string;
  class_field?: string;
  restrict_by_owner?: boolean;
  owner_field_name?: string;
}