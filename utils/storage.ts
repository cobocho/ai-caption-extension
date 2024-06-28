import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const CAPTION_CACHE_KEY = "caption-cache"

export const getStorage = async <T>(
  key: string
): Promise<Awaited<T | undefined>> => {
  const captionCache =
    ((await storage.get(CAPTION_CACHE_KEY)) as Awaited<T> | undefined) || {}

  return captionCache[key]
}

export const setStorage = async (key: string, value: any) => {
  const captionCache =
    ((await storage.get(CAPTION_CACHE_KEY)) as Record<string, any>) || {}

  if (Object.keys(await storage.getAll()).length > 1_000) {
    await clearStorage()
  }

  const newCaptionCache = {
    ...captionCache,
    [key]: value
  }

  return storage.set(CAPTION_CACHE_KEY, newCaptionCache)
}

export const clearStorage = async () => {
  return storage.remove(CAPTION_CACHE_KEY)
}
