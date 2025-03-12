import { ReferenceListConfig } from "../types";
import { truncateMiddle } from "./truncateMiddle";

export interface DisplayConfig {
  optionId: string;
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
  description: string;
  config: DisplayConfig;
}> = [
  {
    label: "Name Only",
    value: "balanced_view",
    description:
      "File name + repo and file path, more scanability for the files",
    config: {
      optionId: "option1",
      showDirectoryInSource: false,
      showFullRepoPath: true,
      sourceTextStyle: "normal",
      directoryTextStyle: "normal",
      columnWidths: {
        name: "1.5fr",
        source: "1.3fr",
        size: "30px",
        actions: "30px",
      },
      showSecondLine: false,
    },
  },
  {
    label: "Middle Truncated Path",
    value: "name_priority",
    description:
      "Shows full path with middle section truncated (...), preserving start and end, more visiblity for repos",
    config: {
      optionId: "option2",
      showDirectoryInSource: false,
      showFullRepoPath: true,
      sourceTextStyle: "normal",
      directoryTextStyle: "normal",
      columnWidths: {
        name: "2.4fr",
        source: "1fr",
        size: "30px",
        actions: "30px",
      },
      showSecondLine: false,
    },
  },
  {
    label: "Beginning Truncated Path",
    value: "compact",
    description:
      "Shows shortened path with beginning truncated (...), preserving the end, more scanability for repos",
    config: {
      optionId: "option4",
      showDirectoryInSource: false,
      showFullRepoPath: true,
      sourceTextStyle: "normal",
      directoryTextStyle: "normal",
      columnWidths: {
        name: "2.4fr",
        source: "1fr",
        size: "30px",
        actions: "30px",
      },
      showSecondLine: false,
    },
  },

  {
    label: "Two Line",
    value: "two_line",
    description: "More space to display the full paths",
    config: {
      optionId: "option3",
      showDirectoryInSource: true,
      showFullRepoPath: true,
      sourceTextStyle: "normal",
      directoryTextStyle: "normal",
      columnWidths: {
        name: "1fr",
        source: "0fr",
        size: "30px",
        actions: "30px",
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
        visible: selectedMode.value !== "two_line",
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
