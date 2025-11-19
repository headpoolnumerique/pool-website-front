import { useState } from 'react'; // Import useState for managing state
import Header from "./navig_components/Header";
import LogoPool from "./other_components/LogoPool"
import P5Canvas from './p5_canvas/P5Canvas';



import {
    rotatingBoxSketch, 
    gradientSketch,
    bouncingBallSketch,
    planeSketch, 
    drawingSketch,
    movingCircleSketch,
    spiralSketch
} from "./p5_canvas/sketches";

export default function Home() {

  const [isVisible, setIsVisible] = useState(true); // State to toggle visibility

    const toggleVisibility = () => {
      setIsVisible(!isVisible);      
    };
  

  return (
    <div>
      <Header />
      <main>
      
      </main>
    </div>
  );
}

