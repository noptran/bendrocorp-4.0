import { Field } from './field.model';
import { Role, User } from './user.model';

export class Report {
  id?: string;
  template_id?: string;
  template_name?: string;
  template_description?: string;
  created_by_id?: string;
  report_for_id?: string;
  report_for: ReportRoute;
  draft?: boolean;
  approved?: boolean;
  fields?: ReportField[];
  handler_id?: string;
  handler: ReportHandler;
}

export class ReportTemplate {
  id?: string;
  name?: string;
  description?: string;
  draft?: boolean;
  fields?: ReportField[];
  handler_id?: string;
  handler: ReportHandler;
  role_id: number;
  role: Role;
  report_for_id?: string;
  report_for: ReportRoute;
}

export class ReportHandler {
  id?: string;
  name?: string;
  for_class?: string;
  approval_kind_id?: number;
  variables?: ReportHandlerVariable[];
}

export class ReportHandlerVariable {
  id?: string;
  handler_id?: string;
  name?: string;
  object_name?: string;
}

export class ReportField {
  id?: string;
  template_id?: string;
  report_id?: string;
  field_id?: string;
  field?: Field;
  name?: string;
  description?: string;
  validator?: string;
  field_presentation_type_id?: number;
  required?: boolean;
  ordinal?: number;
  field_value?: ReportFieldValue;
  report_handler_variable_id?: string;
  report_handler_variable?: ReportHandlerVariable;
}

export class ReportFieldValue {
  id?: string;
  field_id?: string;
  report_id?: string;
  value?: string;
}

export class ReportRoute {
  id?: string;
  title?: string;
  for_role_id?: number;
  for_role?: Role;
  for_user_id?: number;
  for_user?: User;
}