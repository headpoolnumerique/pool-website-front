import { useState } from 'react'; // Import useState for managing state
import Header from "./navig_components/Header";
import P5Canvas from './p5_canvas/P5Canvas';
import {planeSketch, drawingSketch, movingCircleSketch} from "./p5_canvas/sketches"

export default function Home() {

  const [isVisible, setIsVisible] = useState(true); // State to toggle visibility

    const toggleVisibility = () => {
      setIsVisible(!isVisible);      
    };
  

  return (
    <div>
      <Header toggleVisibility={toggleVisibility} />
      <main style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Welcome to the super website of the Digital Pool</h1>
        <P5Canvas sketch={movingCircleSketch} width={200} height={200} left={700} top={500} zIndex={1} isVisible={isVisible} />
        <P5Canvas sketch={planeSketch} width={200} height={200} left={50} top={300} zIndex={1} isVisible={isVisible} />
        <P5Canvas sketch={drawingSketch} width={600} height={200} left={300} top={400}  zIndex={-1} isVisible={isVisible} />
      </main>
    </div>
  );
}
