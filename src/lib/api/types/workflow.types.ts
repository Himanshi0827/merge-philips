export interface LifecycleStageInfo {
  EntryCriteria: string | null;
  SequenceNumber: number;
  StageDescription: string | null;
  StageDisplayName: string | null;
  StageName: string | null;
  State: string | null;
}

export interface LifecycleFlowContextData {
  ObjectName: string | null;
  RecordId: string | null;
  WorkflowDefinitionId: string | null;
}

export interface LifecycleStagesData {
  WorkflowContextData: LifecycleFlowContextData;
  Stages: LifecycleStageInfo[] | null;
}
