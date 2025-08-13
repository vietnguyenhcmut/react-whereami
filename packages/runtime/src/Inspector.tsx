import React, { useState, useEffect } from "react";
import "highlight.js/styles/github-dark.css";
import { useInspectorEvents } from "./hooks/useInspectorEvents";
import { Tooltip } from "./components/Tooltip";
import { statusIndicatorStyle } from "./styles/styles";

const StatusIndicator = ({ isActive }: { isActive: boolean }) => (
  <div
    style={{
      ...statusIndicatorStyle,
      color: isActive ? "rgba(2, 159, 250, 0.5)" : "rgba(55,55,55, 0.5)",
      border: isActive
        ? "1px solid rgba(2, 159, 250, 0.5)"
        : "1px solid rgba(55,55,55, 0.5)",
    }}
    title="Press Alt+Shift+I to toggle"
  >
    Inspector: {isActive ? "ON" : "OFF"}
  </div>
);

export function Inspector() {
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
      console.log(`Key pressed: ${event.key}, Shift: ${event.shiftKey}`);
      if (event.shiftKey && event.key.toLowerCase() === "i") {
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
        <Tooltip
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

// import React from "react";
// import "highlight.js/styles/github-dark.css";
// import { useInspectorEvents } from "./hooks/useInspectorEvents";
// import { Tooltip } from "./components/Tooltip";

// export function Inspector() {
//   const {
//     source,
//     setSource,
//     position,
//     setPosition,
//     isPinned,
//     setPinned,
//     tooltipRef,
//   } = useInspectorEvents();

//   const handlePinClick = (event: React.MouseEvent) => {
//     event.stopPropagation();
//     setPinned((prev) => !prev);
//   };

//   const handleCloseClick = (event: React.MouseEvent) => {
//     event.stopPropagation();
//     setPinned(false);
//     setSource(null);
//     setPosition(null);
//   };

//   if (!source || !position) {
//     return null;
//   }

//   return (
//     <Tooltip
//       source={source}
//       position={position}
//       isPinned={isPinned}
//       tooltipRef={tooltipRef}
//       onPinClick={handlePinClick}
//       onCloseClick={handleCloseClick}
//     />
//   );
// }
