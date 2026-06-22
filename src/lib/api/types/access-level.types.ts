export interface RecordAccessDetail {
  View: boolean;
  Edit: boolean;
}

export interface UserAccessDetailsOnRecord {
  IsSharingEnabled: boolean;
  IsRecordShared: boolean | null;
  RecordAccessDetail: RecordAccessDetail;
}
