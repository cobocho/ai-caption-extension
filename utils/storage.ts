import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const STORAGE_PREFIX = "caption-"

export const getStorage = async <T>(
  key: string
): Promise<Awaited<T | undefined>> => {
  return storage.get(`${STORAGE_PREFIX}${key}`) as Awaited<T> | undefined
}

export const setStorage = async (key: string, value: any) => {
  if (Object.keys(await storage.getAll()).length > 1_000) {
    await clearStorage()
  }

  return storage.set(`${STORAGE_PREFIX}${key}`, value)
}

export const clearStorage = async () => {
  return storage.getAll().then((all) => {
    const keys = Object.keys(all)

    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        storage.remove(key)
      }
    })

    return all
  })
}
