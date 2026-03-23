import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import client from '../../sanity';
import Header from "./navig_components/Header";
import Seo from "../components/Seo";

export default function PresentationPage({ presentation: staticPresentation }) {
  const [presentation, setPresentation] = useState(staticPresentation);

  useEffect(() => {
    client.fetch(`*[_type == "presentation"][0]`).then((data) => {
      if (data) setPresentation(data);
    });
  }, []);

  if (!presentation?.title) return null;

  return (
    <div>
      <Seo
        title="Presentation"
        description={presentation.title}
        url="https://head-digital-pool.ch/presentation"
      />
      <Header />
      <main className="main-container">
        <h1>{presentation.title}</h1>
        <div>
          <PortableText value={presentation.content} />
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const presentation = await client.fetch(`*[_type == "presentation"][0]`);
  return {
    props: {
      presentation: presentation || {},
    },
  };
}