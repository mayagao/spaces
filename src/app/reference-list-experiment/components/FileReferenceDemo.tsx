import React, { useState } from "react";
import { FileReferenceItem } from "./FileReferenceItem";

/**
 * Demo component that showcases all three display options
 */
export const FileReferenceDemo: React.FC = () => {
  const [maxWidth, setMaxWidth] = useState(40);

  // Sample data
  const samples = [
    {
      repoName: "my-repo",
      filePath: "src/components/Button.tsx",
    },
    {
      repoName: "cursor-app",
      filePath: "src/components/editor/PromptEditor/PromptCanvas.tsx",
    },
    {
      repoName: "large-project",
      filePath: "packages/core/src/components/ui/forms/inputs/TextInput.tsx",
    },
    {
      repoName: "very-long-repository-name",
      filePath:
        "src/components/with-very-long-folder-name/and-another-long-name/VeryLongComponentName.tsx",
    },
  ];

  return (
    <div className="file-reference-demo">
      <h1>File Reference Display Options</h1>

      <div className="controls">
        <label>
          Max Width:
          <input
            type="range"
            min="20"
            max="100"
            value={maxWidth}
            onChange={(e) => setMaxWidth(parseInt(e.target.value))}
          />
          {maxWidth} characters
        </label>
      </div>

      <div className="options-container">
        <div className="option-column">
          <h2>Option 1</h2>
          <p>Filename in first column, repo+path in second column</p>

          {samples.map((sample, index) => (
            <div key={`option1-${index}`} className="sample-item">
              <FileReferenceItem
                repoName={sample.repoName}
                filePath={sample.filePath}
                displayOption={1}
                maxWidth={maxWidth}
                onClick={() =>
                  console.log(`Clicked: ${sample.repoName}/${sample.filePath}`)
                }
              />
            </div>
          ))}
        </div>

        <div className="option-column">
          <h2>Option 2</h2>
          <p>Full path in first column, repo name in second column</p>

          {samples.map((sample, index) => (
            <div key={`option2-${index}`} className="sample-item">
              <FileReferenceItem
                repoName={sample.repoName}
                filePath={sample.filePath}
                displayOption={2}
                maxWidth={maxWidth}
                onClick={() =>
                  console.log(`Clicked: ${sample.repoName}/${sample.filePath}`)
                }
              />
            </div>
          ))}
        </div>

        <div className="option-column">
          <h2>Option 3</h2>
          <p>Filename in first line, repo+path in second line</p>

          {samples.map((sample, index) => (
            <div key={`option3-${index}`} className="sample-item">
              <FileReferenceItem
                repoName={sample.repoName}
                filePath={sample.filePath}
                displayOption={3}
                maxWidth={maxWidth}
                onClick={() =>
                  console.log(`Clicked: ${sample.repoName}/${sample.filePath}`)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .file-reference-demo {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          padding: 20px;
        }

        .controls {
          margin-bottom: 20px;
        }

        .options-container {
          display: flex;
          gap: 20px;
        }

        .option-column {
          flex: 1;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 16px;
        }

        .sample-item {
          margin-bottom: 16px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        h1 {
          margin-top: 0;
        }

        h2 {
          margin-top: 0;
        }
      `}</style>
    </div>
  );
};
