import { ClassificationLevel } from './classification-level.model';
import { Field, FieldDescriptor } from './field.model';
import { IdTitleDesc, IdTitleDescOrd } from './misc.model';
import { StarObject } from './system-map.model';
import { User } from './user.model';

export class IntelligenceCase {
  id?: string;
  title?: string;
  rsi_handle?: string;
  case_summary?: string;
  tags?: string;
  created_by?: User;
  created_by_id?: number;
  threat_level?: IdTitleDesc;
  threat_level_id?: string;
  show_in_safe?: boolean;
  classification_level?: ClassificationLevel;
  classification_level_id?: number;
  rsi_avatar_link?: string;
  created_at?: Date;
  warrants?: IntelligenceWarrant[];
  incident_reports?: IncidentReport[];

  assigned_to?: User;
  assigned_by?: User;
  assigned_to_id?: number;
  assigned_by_id?: number;

  comments?: IntelligenceCaseComment[];

  pending_incident_report_count: number;
}

export class IntelligenceCaseComment {
  id?: string;
  comment?: string;
  created_by?: User;
  intelligence_case_id?: string;
}

export class IntelligenceWarrant {
  closed?: boolean;
}

export class IncidentReport {
  id?: string;
  description?: string;
  rsi_handle?: string;
  rsi_avatar_link?: string;
  rsi_org_avatar_link?: string;
  occured_when?: Date;
  occured_when_ms?: number;
  star_object?: StarObject;
  star_object_id?: string;
  accepted?: boolean;
  intelligence_case_id?: string;
  intelligence_case?: IntelligenceCase;
  force_used?: FieldDescriptor;
  force_used_id?: string;
  ship_used?: FieldDescriptor;
  ship_used_id?: string;
  // threat_level: FieldDescriptor;
  // threat_level_id: string;
  created_by?: User;
  created_by_id?: number;
  show_in_safe: boolean;

  created_at?: Date;

  approval_status?: IdTitleDesc;
  approval_status_id?: string;

  //
  submit_for_approval?: boolean;
  infractions?: IdTitleDescOrd[];

  comments?: IncidentReportComment[];
}

export class IncidentReportComment {
  id?: string;
  comment?: string;
  created_by?: User;
  incident_report_id?: string;
}

export class BenSecListItem {
  id!: string;
  handle!: string;
  avatar!: string;
  tags?: string;
  type!: 'warrant'|'case'|'incident';
  createdAt!: Date;
  reportCount?: number;
  warrantCount?: number;
  activeWarrantCount?: number;
  pendingCount?: number;
}
