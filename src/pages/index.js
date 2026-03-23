import { useState, useEffect } from "react";
import { PortableText } from '@portabletext/react';
import client, { urlFor } from '../../sanity';
import Header from "./navig_components/Header";
import P5Canvas from './p5_canvas/P5Canvas';
import P5View from './p5_canvas/P5View';
import Seo from "../components/Seo";

export default function Home({ presentation: staticPresentation }) {
  const [showP5, setShowP5] = useState(true);
  const [presentation, setPresentation] = useState(staticPresentation);

  // Fetch fresh data client-side
  useEffect(() => {
    client.fetch(`*[_type == "presentation"][0]{
      title,
      content,
      logo
    }`).then((data) => {
      if (data) setPresentation(data);
    });
  }, []);

  if (!presentation) return null;

  const logoUrl = presentation.logo ? urlFor(presentation.logo).url() : null;

  return (
    <div className="home-container">
      <Seo
        title="Home"
        description="Interdisciplinary space in the dark depths of @headgeneve for experimenting with technology through art and design."
        url="https://head-digital-pool.ch"
      />
      <Header logo={logoUrl} />
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
  return {
    props: {
      presentation: presentation || {},
    },
  };
}