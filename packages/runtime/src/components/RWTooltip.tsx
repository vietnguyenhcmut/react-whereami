import React, { useRef, useEffect, useState } from "react";
import hljs from "highlight.js";
import { RWTooltipHeader } from "./RWTooltipHeader";
import { getTooltipStyle, codeContainerStyle } from "../styles/styles";
import type { SourceInfo, Position } from "../types";

interface RWTooltipProps {
  source: SourceInfo;
  position: Position;
  isPinned: boolean;
  tooltipRef: React.Ref<HTMLDivElement>;
  onPinClick: (event: React.MouseEvent) => void;
  onCloseClick: (event: React.MouseEvent) => void;
}

export function RWTooltip({
  source,
  position,
  isPinned,
  tooltipRef,
  onPinClick,
  onCloseClick,
}: RWTooltipProps) {
  const [highlightedContent, setHighlightedContent] = useState("");

  useEffect(() => {
    if (source.content && !source.isLoading) {
      const highlighted = hljs.highlight(source.content, {
        language: "tsx",
      }).value;
      setHighlightedContent(highlighted);
    } else {
      setHighlightedContent("");
    }
  }, [source.content, source.isLoading]);

  return (
    <div style={getTooltipStyle(position)} ref={tooltipRef}>
      <RWTooltipHeader
        source={source}
        isPinned={isPinned}
        onPinClick={onPinClick}
        onCloseClick={onCloseClick}
      />
      <div style={codeContainerStyle}>
        {source.isLoading ? (
          <div>Loading...</div>
        ) : (
          <pre style={{ margin: 0, height: "100%" }}>
            <code
              className="language-tsx"
              style={{
                fontFamily: "inherit",
                backgroundColor: "inherit",
                height: "100%",
              }}
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
            ></code>
          </pre>
        )}
      </div>
    </div>
  );
}
