export const planeSketch = (p5, width, height) => {
  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);
    p5.background('white');
  };
  p5.draw = () => {
    p5.background(255, 255, 255, 0);
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
export const drawingSketch = (p5, width, height) => {
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