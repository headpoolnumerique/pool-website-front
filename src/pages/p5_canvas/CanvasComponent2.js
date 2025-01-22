import dynamic from 'next/dynamic';

const NextReactP5Wrapper = dynamic(
  () => import('@p5-wrapper/next').then(mod => mod.NextReactP5Wrapper),
  { ssr: false }
);

const sketch = (p5, width, height) => {
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

export default function CanvasComponent2({ width = 600, height = 400, left = 0, top = 0 }) {
  const style = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    zIndex: 1, // Optional
  };

  return <div style={style}><NextReactP5Wrapper sketch={(p5) => sketch(p5, width, height)} /></div>;
}
