import Header from "./navig_components/Header";
import P5Canvas from './p5_canvas/P5Canvas';
import {planeSketch, drawingSketch} from "./p5_canvas/sketches"

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Welcome to the super website of the Digital Pool</h1>
        <P5Canvas sketch={planeSketch} width={200} height={200} left={50} top={300} />
        <P5Canvas sketch={drawingSketch} width={600} height={200} left={300} top={400} />
      </main>
    </div>
  );
}
