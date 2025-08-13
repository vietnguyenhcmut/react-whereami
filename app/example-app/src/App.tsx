import { Button } from "./components/Button";
import { Card } from "./components/Card";

function App() {
  return (
    <div
      style={{
        padding: "20px",
        height: "100vh",
        width: "calc(100vw - 40px)",
      }}
    >
      <h1>React! Where am I ? 🚀</h1>
      <p>Drag your pointer to below and see what happens.</p>
      <div style={{ width: "300px" }}>
        <Card>
          <p>hello</p>
          <Button>Hover me!</Button>
        </Card>
      </div>
    </div>
  );
}

export default App;
