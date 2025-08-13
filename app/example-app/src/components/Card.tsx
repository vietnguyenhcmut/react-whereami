export function Card({ children, ...rest }: React.ComponentProps<"div">) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.05)",
    border: "1px solid #ccc",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
  };

  return (
    <div style={cardStyle} {...rest}>
      {children}
    </div>
  );
}
