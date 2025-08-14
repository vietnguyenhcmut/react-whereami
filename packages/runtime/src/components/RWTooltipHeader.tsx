import React from "react";
import {
  headerStyle,
  iconsContainerStyle,
  fileInfoStyle,
} from "../styles/styles";
import type { SourceInfo } from "../types";

interface RWTooltipHeaderProps {
  source: SourceInfo;
  isPinned: boolean;
  onPinClick: (event: React.MouseEvent) => void;
  onCloseClick: (event: React.MouseEvent) => void;
}

export function RWTooltipHeader({
  source,
  isPinned,
  onPinClick,
  onCloseClick,
}: RWTooltipHeaderProps) {
  const definitionFileName = source.definitionFile.split("/").pop();

  const vsCodeLink = `vscode://file/${source.definitionAbsoluteFile}`;
  const vsCodeUsageLink = `vscode://file/${source.usageAbsoluteFile}:${source.usageLine}`;

  return (
    <div style={headerStyle}>
      <div style={iconsContainerStyle}>
        <span title={isPinned ? "Unpin" : "Pin"} onClick={onPinClick}>
          {isPinned ? "📌" : "📍"}
        </span>
        {isPinned && (
          <span title="Close" onClick={onCloseClick}>
            ❌
          </span>
        )}
      </div>
      <div style={fileInfoStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <div
            style={{
              border: "1px solid #91bcff",
              padding: "4px",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          >
            <strong>{definitionFileName}</strong>
          </div>
          <p
            style={{
              color: "inherit",
              opacity: 0.7,
              textDecoration: "none",
              margin: 0,
            }}
          >
            Being used at: {source.usageFile}:{source.usageLine}{" "}
          </p>
          <a
            href={vsCodeUsageLink}
            title={`Click to open in VS Code: ${source.usageFile}:${source.usageLine}`}
            style={{
              color: "rgb(171, 110, 36)",
              textDecoration: "none",
              cursor: "pointer",
              fontSize: "9px",
              fontWeight: "bold",
            }}
          >
            Click to open in VS Code 👉
          </a>
        </div>
      </div>
    </div>
  );
}
