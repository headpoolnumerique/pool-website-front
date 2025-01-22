import Header from "./navig_components/Header";
import P5Canvas from './p5_canvas/P5Canvas';

// Sketch for 3D rotating plane
const planeSketch = (p5, width, height) => {
  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);
    p5.background('white');
  };
  p5.draw = () => {
    p5.background('white');
    p5.normalMaterial();
    p5.push();
    p5.rotateZ(p5.frameCount * 0.01);
    p5.rotateX(p5.frameCount * 0.01);
    p5.rotateY(p5.frameCount * 0.01);
    p5.plane(100);
    p5.pop();
  };
};

// Sketch for interactive drawing
const drawingSketch = (p5, width, height) => {
  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.background(0);
    p5.strokeWeight(10);
    p5.colorMode(p5.HSB);
  };
  p5.mouseMoved = () => {
    let lineHue = (p5.mouseX - p5.mouseY) % 360;
    p5.stroke(lineHue, 90, 90);
    p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
  };
};

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Welcome to the super website of the Digital Pool</h1>
        <P5Canvas sketch={planeSketch} width={200} height={600} left={50} top={100} />
        <P5Canvas sketch={drawingSketch} width={600} height={200} left={300} top={400} />
      </main>
    </div>
  );
}
