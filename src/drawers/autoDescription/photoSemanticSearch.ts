import localforage from 'localforage';
import OpenAI from 'openai';

const MODEL = 'text-embedding-3-small'
const STORAGE_KEY = 'photo-semantic-embeddings'

export type Photo = {
  id: string
  description: string
}

type StoredPhoto = Photo & {
  embedding: number[]
}

const db = localforage.createInstance({
  name: 'photo-search',
  storeName: 'embeddings',
})

const cosineSimilarity = (a: number[], b: number[]) => {
  let dot = 0
  let magA = 0
  let magB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

const createEmbeddings = async (
  client: OpenAI,
  texts: string[],
) => {
  const response = await client.embeddings.create({
    model: MODEL,
    input: texts,
  })

  return response.data
    .sort((a, b) => a.index - b.index)
    .map(x => x.embedding)
}

export const indexPhotos = async (
  apiKey: string,
  photos: Photo[],
  batchSize = 100,
) => {
  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const existing =
    (await db.getItem<Record<string, StoredPhoto>>(STORAGE_KEY)) ?? {}

  const missing = photos.filter(
    photo =>
      photo.description &&
      !existing[photo.id],
  )

  console.log(
    `Embedding ${missing.length} new photos...`,
  )

  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize)

    const embeddings = await createEmbeddings(
      client,
      batch.map(photo => photo.description),
    )

    batch.forEach((photo, index) => {
      existing[photo.id] = {
        ...photo,
        embedding: embeddings[index],
      }
    })

    await db.setItem(STORAGE_KEY, existing)

    console.log(
      `Indexed ${Math.min(
        i + batch.length,
        missing.length,
      )}/${missing.length}`,
    )
  }

  return Object.values(existing)
}

export const searchPhotos = async (
  apiKey: string,
  query: string,
  limit = 50,
) => {
  const stored =
    (await db.getItem<Record<string, StoredPhoto>>(STORAGE_KEY)) ?? {}

  const photos = Object.values(stored)

  if (!photos.length) {
    return []
  }

  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const response = await client.embeddings.create({
    model: MODEL,
    input: query,
  })

  const queryEmbedding = response.data[0].embedding

  return photos
    .map(photo => ({
      id: photo.id,
      description: photo.description,
      score: cosineSimilarity(
        queryEmbedding,
        photo.embedding,
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
