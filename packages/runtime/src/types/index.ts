export interface SourceInfo {
  definitionFile: string;
  definitionAbsoluteFile: string;
  usageFile: string;
  usageLine: number;
  usageAbsoluteFile: string;
  content: string | null;
  isLoading: boolean;
}

export interface Position {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}
