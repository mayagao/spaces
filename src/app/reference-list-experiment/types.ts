export interface ColumnConfig {
  name: string;
  visible: boolean;
  width: string;
  align?: "left" | "right" | "center";
}

export interface ReferenceListConfig {
  columns: {
    name: ColumnConfig;
    source: ColumnConfig;
    size: ColumnConfig;
    actions: ColumnConfig;
  };
  displayOptions: {
    optionId: string;
    showDirectoryInSource: boolean;
    showFullRepoPath: boolean;
    sourceTextStyle?: "normal" | "subdued";
    directoryTextStyle?: "normal" | "subdued";
    showSecondLine?: boolean;
  };
}

export interface Resource {
  id: string;
  name: string;
  type: "file" | "link" | "image" | "text" | "directory" | "code";
  source?: string;
  url?: string;
  content?: string;
  fileSize?: number;
  directoryPath?: string;
}
