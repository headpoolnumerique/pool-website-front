import Link from "next/link";
import Header from "./navig_components/Header";
import CanvasComponent from './p5_canvas/CanvasComponent';
import CanvasComponent2 from './p5_canvas/CanvasComponent2';


export default function Home() {
  return (
    <div>
      {/* Header with Navigation */}
      <Header />
      {/* Main Content */}
      <main style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Welcome to the super website of the Digital Pool</h1>
        <CanvasComponent width={200} height={600} />
        <CanvasComponent2 width={200} height={600} />
      </main>
    </div>
  );
}