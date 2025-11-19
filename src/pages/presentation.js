import { PortableText } from '@portabletext/react'
import client from '../../sanity';
import Header from "./navig_components/Header";
import P5View from './p5_canvas/P5View'; // Import the new P5View component


export default function PresentationPage({ presentation }) {
  return (
    <div>
      <Header />
      <P5View />
      <main className="main-container">
      <h1>{presentation.title}</h1>
      <div>
        <PortableText value={presentation.content} />
      </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const presentation = await client.fetch(`*[_type == "presentation"][0]`)

  return {
    props: {
      presentation,
    },
  }
}