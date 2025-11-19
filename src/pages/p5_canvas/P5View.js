import P5Canvas from './P5Canvas';
import {
    rotatingBoxSketch, 
    gradientSketch,
    bouncingBallSketch,
    planeSketch, 
    drawingSketch,
    movingCircleSketch,
    spiralSketch
} from "./sketches";

export default function P5View({ isVisible }) {
  return (
    <div className="p5-view">
      <P5Canvas sketch={movingCircleSketch} width={200} height={200} left={700} top={500} zIndex={1} isVisible={isVisible} />
      <P5Canvas sketch={planeSketch} width={200} height={200} left={50} top={300} zIndex={1} isVisible={isVisible} />
      <P5Canvas sketch={drawingSketch} width={600} height={200} left={300} top={400}  zIndex={-1} isVisible={isVisible} />
      <P5Canvas sketch={bouncingBallSketch} width={100} height={100} left={1000} top={200}  zIndex={2} isVisible={isVisible} />
      <P5Canvas sketch={rotatingBoxSketch} width={200} height={200} left={800} top={400}  zIndex={2} isVisible={isVisible} />
      <P5Canvas sketch={gradientSketch} width={100} height={100} left={800} top={200}  zIndex={2} isVisible={isVisible} />
      <P5Canvas sketch={spiralSketch} width={100} height={100} left={800} top={200}  zIndex={2} isVisible={isVisible} />
    </div>
  );
}
