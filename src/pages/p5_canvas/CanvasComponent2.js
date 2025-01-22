import dynamic from 'next/dynamic';

const NextReactP5Wrapper = dynamic(() => import('@p5-wrapper/next').then(mod => mod.NextReactP5Wrapper), { ssr: false });

const sketch = (p5, width, height) => {
  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL)
    mouseMoved()
  }

  p5.draw = () => {
    p5.background("red")
    p5.strokeWeight(10)
    p5.colorMode("HSB")
  }

   const mouseMoved = () => {
    let lineHue = p5.mouseX - p5.mouseY;
    p5.stroke(p5.lineHue, 90, 90);
    p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
  }
}

export default function CanvasComponent2({ width = 600, height = 400 }) {
  return <NextReactP5Wrapper sketch={(p5) => sketch(p5, width, height)} />;
}