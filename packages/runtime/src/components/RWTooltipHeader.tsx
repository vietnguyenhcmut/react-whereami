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

  const vsCodeLink = `vscode://file/${source.usageAbsoluteFile}:${source.usageLine}`;

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
        <div>
          <strong>{definitionFileName}</strong>
        </div>
        <a
          href={vsCodeLink}
          title={`Click to open in VS Code: ${source.usageFile}:${source.usageLine}`}
          style={{
            color: "inherit",
            opacity: 0.7,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Being used at: {source.usageFile}:{source.usageLine}
        </a>
      </div>
    </div>
  );
}
