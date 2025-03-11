export const planeSketch = (p5, width, height) => {
  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);
    p5.background('white');
  };
  p5.draw = () => {
    p5.background(255, 255, 255, 0);
    
    // Draw the rotating plane with a black border
    p5.push();
    p5.normalMaterial();
    
    // Rotate the object
    p5.rotateZ(p5.frameCount * 0.01);
    p5.rotateX(p5.frameCount * 0.01);
    p5.rotateY(p5.frameCount * 0.01);
    
    p5.push();  // Isolate 2D context for the border
    p5.stroke(0);  // Black border
    p5.strokeWeight(1);  // 1px border
    p5.noFill();
    p5.rectMode(p5.CENTER);
    p5.rect(0, 0, 100, 100);  // 1px border around the plane
    p5.pop();  // Restore 3D context
    // Draw the plane
    p5.plane(100);
    p5.pop();
  };
};

// Sketch for interactive drawing
export const drawingSketch = (p5, width, height) => {
  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.background(255, 255, 255, 0);
    p5.strokeWeight(10);
    p5.colorMode(p5.HSB);
  };
  p5.mouseMoved = () => {
    let lineHue = (p5.mouseX - p5.mouseY) % 360;
    p5.stroke(lineHue, 90, 90);
    p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
  };
};

export const drawingSketch2 = (p5, width, height) => {
  let alpha = 5; // Transparency fade value

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.background(255, 255, 255, 0);
    p5.strokeWeight(5);
    p5.colorMode(p5.HSB);
  };

  p5.draw = () => {
    // Fade the background with some transparency to create a trailing effect
    p5.fill(255, 255, 255, alpha);
    p5.noStroke();
    p5.rect(0, 0, width, height); // Apply fading effect on the background

    // Drawing lines with dynamic colors and thickness
    p5.mouseMoved = () => {
      let lineHue = (p5.mouseX - p5.mouseY) % 360;
      let lineSaturation = p5.map(p5.mouseX, 0, width, 50, 100); // Vary saturation based on mouseX
      let lineBrightness = p5.map(p5.mouseY, 0, height, 50, 100); // Vary brightness based on mouseY
      p5.stroke(lineHue, lineSaturation, lineBrightness);
      p5.strokeWeight(p5.map(p5.mouseX, 0, width, 1, 15)); // Vary stroke weight based on mouseX

      p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
    };
  };
};



export function movingCircleSketch(p5, width, height) {

  let x = 25;

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.colorMode(p5.HSB);
    p5.textSize(20);
    p5.noLoop();
  };

  p5.draw = () => {
    p5.background(0);
    p5.fill(x / 3, 90, 90);
    p5.circle(x, p5.height / 2, 50);
    x += 5;

    if (x > p5.width + 25) {
      x = -25;
    }

    p5.describe('circle moving to the right');
  };

  p5.mousePressed = () => {
    if (p5.isLooping()) {
      p5.noLoop();
    } else {
      p5.loop();
    }
  };

  p5.keyPressed = () => {
    p5.redraw();
  };
};


export const rotatingBoxSketch = (p5, width, height) => {
  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);
  };

  p5.draw = () => {
    p5.background(200);
    p5.rotateX(p5.frameCount * 0.001);
    p5.rotateY(p5.frameCount * 0.001);
    p5.box(100);
  };
};

export const bouncingBallSketch = (p5, width, height) => {
  let x = width / 2;
  let y = height / 2;
  let speedX = 0.5;
  let speedY = 0.5;
  const radius = 20;

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    p5.background(220);
    p5.ellipse(x, y, radius * 2);
    x += speedX;
    y += speedY;

    if (x + radius > width || x - radius < 0) speedX *= -1;
    if (y + radius > height || y - radius < 0) speedY *= -1;
  };
};

export const cameraSketch = (p5, width, height) => {
  let video;

  p5.setup = () => {
    p5.createCanvas(width, height);
    video = p5.createCapture(p5.VIDEO);
    video.size(width, height);
  };

  p5.draw = () => {
    p5.background(0);
    video.loadPixels();
    p5.image(video, 0, 0);
  };
};

export const webcamCircleSketch = (p5, width, height) => {
  let video;

  p5.setup = () => {
    p5.createCanvas(width, height);
    video = p5.createCapture(p5.VIDEO);
    video.size(width, height);
    video.hide();
  };

  p5.draw = () => {
    p5.background(0);
    video.loadPixels();
    for (let y = 0; y < height; y += 20) {
      for (let x = 0; x < width; x += 20) {
        let i = (y * width + x) * 4;
        let r = video.pixels[i];
        let g = video.pixels[i + 1];
        let b = video.pixels[i + 2];
        p5.fill(r, g, b);
        p5.noStroke();
        p5.ellipse(x, y, 15, 15);
      }
    }
  };
};

export const mouseMoveSketch = (p5, width, height) => {
  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    p5.background(255);
    p5.fill(0);
    p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
  };
};

export const gradientSketch = (p5, width, height) => {
  let offset = 0;

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    offset += 0.01;
    p5.background(0);
    for (let i = 0; i < height; i++) {
      let c = p5.color((i + offset) % 255, 100, 255);
      p5.stroke(c);
      p5.line(0, i, width, i);
    }
  };
};

export const spiralSketch = (p5, width, height) => {
  let angle = 0;
  let radius = 0;

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.frameRate(2);  
  };

  p5.draw = () => {
    p5.background(0);
    p5.stroke(255);
    p5.noFill();
    p5.push();
    p5.translate(width / 2, height / 2);
    for (let i = 0; i < 300; i++) {
      p5.line(0, 0, radius * p5.cos(angle), radius * p5.sin(angle));
      angle += 0.1;
      radius += 0.5;
    }
    p5.pop();
  };
};

export const particleSketch = (p5, width, height) => {
  let particles = [];

  class Particle {
    constructor(x, y) {
      this.position = p5.createVector(x, y);
      this.velocity = p5.createVector(p5.random(-2, 2), p5.random(-2, 2));
      this.lifespan = 255;
    }

    update() {
      this.position.add(this.velocity);
      this.lifespan -= 4;
    }

    display() {
      p5.noStroke();
      p5.fill(255, this.lifespan);
      p5.ellipse(this.position.x, this.position.y, 10);
    }

    isDead() {
      return this.lifespan < 0;
    }
  }

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    p5.background(0);
    particles.push(new Particle(p5.mouseX, p5.mouseY));

    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.display();
      if (p.isDead()) {
        particles.splice(i, 1);
      }
    }
  };
};

export const terrainSketch = (p5, width, height) => {
  let terrain = [];

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);
    let rows = 100;
    let cols = 100;
    for (let y = 0; y < rows; y++) {
      terrain[y] = [];
      for (let x = 0; x < cols; x++) {
        terrain[y][x] = p5.random(-100, 100);
      }
    }
  };

  p5.draw = () => {
    p5.background(200);
    p5.rotateX(p5.frameCount * 0.01);
    p5.rotateZ(p5.frameCount * 0.01);
    p5.translate(-width / 2, -height / 2);

    for (let y = 0; y < terrain.length - 1; y++) {
      p5.beginShape(p5.TRIANGLE_STRIP);
      for (let x = 0; x < terrain[y].length; x++) {
        p5.vertex(x * 10, y * 10, terrain[y][x]);
        p5.vertex(x * 10, (y + 1) * 10, terrain[y + 1][x]);
      }
      p5.endShape();
    }
  };
};

export const edgeDetectionSketch = (p5, width, height) => {
  let video;

  p5.setup = () => {
    p5.createCanvas(width, height);
    video = p5.createCapture(p5.VIDEO);
    video.size(width, height);
    video.hide();
  };

  p5.draw = () => {
    p5.background(0);
    video.loadPixels();

    for (let y = 1; y < video.height - 1; y++) {
      for (let x = 1; x < video.width - 1; x++) {
        let i = (y * video.width + x) * 4;
        let left = (y * video.width + (x - 1)) * 4;
        let right = (y * video.width + (x + 1)) * 4;

        let diffR = abs(video.pixels[i] - video.pixels[left]);
        let diffG = abs(video.pixels[i + 1] - video.pixels[left + 1]);
        let diffB = abs(video.pixels[i + 2] - video.pixels[left + 2]);

        let brightness = (diffR + diffG + diffB) / 3;

        if (brightness > 50) {
          p5.stroke(255);
        } else {
          p5.noStroke();
        }

        p5.point(x, y);
      }
    }
  };
};
