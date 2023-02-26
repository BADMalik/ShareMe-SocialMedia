import { createClient } from "@sanity/client";
import createImageUrlBuilder from '@sanity/image-url'
const config = {
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2023-02-24',
    useCdn: false,
    token: process.env.REACT_APP_SANITY_TOKEN,
}

export const client = createClient(config)
const builder = createImageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)