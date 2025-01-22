import { PortableText } from '@portabletext/react'
import client from '../../sanity'
import Header from "./navig_components/Header"

export default function PresentationPage({ presentation }) {
  return (
    <div>
      <Header />
      <h1>{presentation.title}</h1>
      <div>
        <PortableText value={presentation.content} />
      </div>
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