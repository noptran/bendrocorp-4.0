import { FieldDescriptor } from './field.model';
import { IdTitleDesc } from './misc.model';
import { StarObject } from './system-map.model';

export class BendroAlert extends IdTitleDesc {
  created_at?: Date;
  alert_type?: FieldDescriptor;
  alert_type_id?: string;
  expires?: Date;
  expires_ms?: number;
  star_object_id?: string;
  star_object?: StarObject;
}
