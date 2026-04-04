export default function Home() {
  return (
    <iframe
      src="/cube-app.html"
      style={{
        position: "fixed",
        inset: "0",
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
      }}
      title="Rubik's Cube"
    />
  );
}
