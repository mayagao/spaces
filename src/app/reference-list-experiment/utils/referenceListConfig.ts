import { ReferenceListConfig } from "../types";
import { truncateMiddle } from "./truncateMiddle";

export interface DisplayConfig {
  showDirectoryInSource: boolean;
  showFullRepoPath: boolean;
  sourceTextStyle: "normal" | "subdued";
  directoryTextStyle: "normal" | "subdued";
  columnWidths: {
    name: string;
    source: string;
    size: string;
    actions: string;
  };
  showSecondLine?: boolean;
}

export const displayModes: Array<{
  label: string;
  value: string;
  config: DisplayConfig;
}> = [
  {
    label: "Option 1",
    value: "option1",
    config: {
      showDirectoryInSource: false,
      showFullRepoPath: true,
      sourceTextStyle: "normal",
      directoryTextStyle: "normal",
      columnWidths: {
        name: "1fr",
        source: "1.5fr",
        size: "20px",
        actions: "40px",
      },
      showSecondLine: false,
    },
  },
  {
    label: "Option 2",
    value: "option2",
    config: {
      showDirectoryInSource: false,
      showFullRepoPath: true,
      sourceTextStyle: "normal",
      directoryTextStyle: "normal",
      columnWidths: {
        name: "2.5fr",
        source: "1fr",
        size: "40px",
        actions: "40px",
      },
      showSecondLine: false,
    },
  },
  {
    label: "Option 3",
    value: "option3",
    config: {
      showDirectoryInSource: true,
      showFullRepoPath: true,
      sourceTextStyle: "normal",
      directoryTextStyle: "normal",
      columnWidths: {
        name: "1fr",
        source: "0fr",
        size: "20px",
        actions: "20px",
      },
      showSecondLine: true,
    },
  },
];

export function getDefaultConfig(): ReferenceListConfig {
  return {
    columns: {
      name: {
        name: "Name",
        visible: true,
        width: displayModes[0].config.columnWidths.name,
      },
      source: {
        name: "Source",
        visible: true,
        width: displayModes[0].config.columnWidths.source,
        align: "left",
      },
      size: {
        name: "Size",
        visible: true,
        width: displayModes[0].config.columnWidths.size,
        align: "right",
      },
      actions: {
        name: "Actions",
        visible: true,
        width: displayModes[0].config.columnWidths.actions,
      },
    },
    displayOptions: {
      ...displayModes[0].config,
    },
  };
}

export function getConfigForMode(mode: string): ReferenceListConfig {
  const selectedMode =
    displayModes.find((m) => m.value === mode) || displayModes[0];

  return {
    columns: {
      name: {
        name: "Name",
        visible: true,
        width: selectedMode.config.columnWidths.name,
      },
      source: {
        name: "Source",
        visible: selectedMode.value !== "option3",
        width: selectedMode.config.columnWidths.source,
        align: "left",
      },
      size: {
        name: "Size",
        visible: true,
        width: selectedMode.config.columnWidths.size,
        align: "right",
      },
      actions: {
        name: "Actions",
        visible: true,
        width: selectedMode.config.columnWidths.actions,
      },
    },
    displayOptions: {
      ...selectedMode.config,
    },
  };
}
