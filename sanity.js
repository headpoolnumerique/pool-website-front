// sanity.js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-10-10', // Use a specific date for API version
  useCdn: true, // Set to false if you need fresh data
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)
export default client
