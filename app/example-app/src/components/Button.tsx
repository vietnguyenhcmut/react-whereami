import React from "react";

type ButtonProps = {
  children: React.ReactNode;
} & React.ComponentProps<"button">;

export function Button({ children, ...rest }: ButtonProps) {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#61DAFB",
    border: "none",
    color: "black",
    padding: "12px 24px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    borderRadius: "8px",
  };

  return (
    <button style={buttonStyle} {...rest}>
      {children}
    </button>
  );
}
