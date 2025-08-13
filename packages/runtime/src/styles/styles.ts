import type { CSSProperties } from "react";
import type { Position } from "../types";

export const getTooltipStyle = (position: Position | null): CSSProperties => {
  if (!position) return { display: "none" };

  const dynamicMaxHeight = position.top
    ? `calc(100vh - ${position.top}px - 40px)`
    : `calc(100vh - ${position.bottom}px - 40px)`;

  return {
    ...position,
    position: "fixed",
    maxWidth: "600px",
    maxHeight: dynamicMaxHeight,
    overflow: "auto",
    backgroundColor: "rgba(19, 21, 27, 0.9)",
    backdropFilter: "blur(5px)",
    color: "#D4D4D4",
    borderRadius: "8px",
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: "13px",
    zIndex: 99999,
    whiteSpace: "pre",
    pointerEvents: "auto",
    boxShadow: "1px 1px 40px 2px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  };
};

export const headerStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: "rgba(19, 21, 27, 0.1)",
  backdropFilter: "blur(5px)",
  padding: "10px",
  paddingBottom: "8px",
  borderBottom: "1px solid #333",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
};

export const iconsContainerStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  cursor: "pointer",
  marginRight: "16px",
};

export const fileInfoStyle: CSSProperties = {
  color: "#91bcff",
  fontSize: "14px",
};

export const codeContainerStyle: CSSProperties = {
  paddingTop: "40px",
  paddingLeft: "10px",
  paddingRight: "10px",
};

export const statusIndicatorStyle: CSSProperties = {
  position: "fixed",
  bottom: "10px",
  right: "10px",
  padding: "5px 10px",
  color: "white",
  borderRadius: "4px",
  fontSize: "12px",
  zIndex: 999999,
  opacity: 0.8,
  backdropFilter: "blur(5px)",
};
