export class BendroSafeSearchResult {
  rsi_data?: BendroSafeSearchResultRsiDataResult;
  intel_data?: BendroSafeSearchResultIntelDataResult;
  override_data?: any;
  offender_data?: any;
  summary_level?: string;
  message?: string;
}

export class BendroSafeSearchResultRsiDataResult {
  rsi_code?: number;
  handle?: string;
  threat_message?: string;
  safe_level: string;
}

export class BendroSafeSearchResultIntelDataResult {
  case_exists: boolean;
  case_id: string;
  threat_message?: string;
  safe_level: string;
}
