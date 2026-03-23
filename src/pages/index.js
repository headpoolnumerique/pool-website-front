import { useState } from "react";
import { PortableText } from '@portabletext/react';
import client, { urlFor } from '../../sanity';
import Header from "./navig_components/Header";
import P5Canvas from './p5_canvas/P5Canvas';
import P5View from './p5_canvas/P5View';

export default function Home({ presentation, iframeLinks }) {
  const [showP5, setShowP5] = useState(true);

  return (
    <div className="home-container">
      <Header logo={presentation.logo ? urlFor(presentation.logo).url() : null} />

      {showP5 && <P5View />}

      <main className="main-container-index">
        <h1>{presentation.title}</h1>
        <div>
          <PortableText value={presentation.content} />
        </div>
      </main>

      <nav className="nav_general_infos">

      <div className="general_info_one_liner">
        <span>Interdisciplinary space in the dark depths of @headgeneve for experimenting with technology through art and design.</span>
      </div>

      <div className="general_info_ig">
        <span>
          <a 
            href="https://www.instagram.com/headdigitalpool/" 
            target="_blank"
            rel="noopener noreferrer"
          >
          Instagram
          </a>
        </span>
      </div>

      <div className="slider-toggle-wrapper">
        <span className="toggle-label">TOGGLE SKETCHES</span>
        <div className="slider-toggle">
          <input
            type="checkbox"
            id="p5-toggle"
            checked={showP5}
            onChange={() => setShowP5(!showP5)}
          />
          <label htmlFor="p5-toggle" className="slider"></label>
        </div>
       </div> 

      </nav>   
    </div>
  );
}

export async function getStaticProps() {
  const presentation = await client.fetch(`*[_type == "presentation"][0]{
    title,
    content,
    logo
  }`);

  const iframeLinks = await client.fetch(`*[_type == "iframelinks"]{
    _id,
    links[]{ url }
  }`);

  return {
    props: {
      presentation: presentation || {},
      iframeLinks: iframeLinks || [],
    },
    revalidate: 60,
  };
}
