import dynamic from 'next/dynamic';

const NextReactP5Wrapper = dynamic(
  () => import('@p5-wrapper/next').then(mod => mod.NextReactP5Wrapper),
  { ssr: false }
);

const sketch = (p5, width, height) => {
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

export default function CanvasComponent({ width = 600, height = 400, left = 0, top = 0 }) {
  const style = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    zIndex: 1, // Optional: adjust stacking order if needed
  };

  return <div style={style}><NextReactP5Wrapper sketch={(p5) => sketch(p5, width, height)} /></div>;
}
