import { PortableText } from '@portabletext/react';
import client from '../../sanity';
import Header from "./navig_components/Header";
import P5View from './p5_canvas/P5View';

export default function PresentationPage({ presentation }) {
  return (
    <div>
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
      presentation,
    },
    revalidate: 60,
  };
}
