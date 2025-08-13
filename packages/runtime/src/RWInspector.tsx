import React, { useState, useEffect } from "react";
import "highlight.js/styles/github-dark.css";
import { useInspectorEvents } from "./hooks/useInspectorEvents";
import { RWTooltip } from "./components/RWTooltip";
import { statusIndicatorStyle } from "./styles/styles";

const StatusIndicator = ({ isActive }: { isActive: boolean }) => (
  <div
    style={{
      ...statusIndicatorStyle,
      color: isActive ? "rgba(2,159,250,0.5)" : "rgba(0,0,0,0.5)",
      border: `1px solid ${
        isActive ? "rgba(2,159,250,0.5)" : "rgba(0,0,0,0.5)"
      }`,
    }}
    title="Press Shift+I to toggle"
  >
    Inspector: {isActive ? "ON" : "OFF"}
  </div>
);

export function RWInspector() {
  const [isActive, setActive] = useState(false);
  const {
    source,
    setSource,
    position,
    setPosition,
    isPinned,
    setPinned,
    tooltipRef,
  } = useInspectorEvents(isActive);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.shiftKey &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        event.key.toLowerCase() === "i"
      ) {
        event.preventDefault();
        setActive((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePinClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPinned((prev) => !prev);
  };

  const handleCloseClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPinned(false);
    setSource(null);
    setPosition(null);
  };

  return (
    <>
      <StatusIndicator isActive={isActive} />
      {source && position && (
        <RWTooltip
          source={source}
          position={position}
          isPinned={isPinned}
          tooltipRef={tooltipRef}
          onPinClick={handlePinClick}
          onCloseClick={handleCloseClick}
        />
      )}
    </>
  );
}
