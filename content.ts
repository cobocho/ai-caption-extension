import "./content.css"

import { getStorage, setStorage } from "./utils/storage"

let then = Date.now()

let lastCaption = ""

const $ = <T extends Element>(selector: string) =>
  document.querySelector(selector) as T

const translate = async (text: string) => {
  try {
    const response = await fetch(process.env.PLASMO_PUBLIC_TRANSLATE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text
      })
    })

    const result = (await response.json()) as {
      translations: {
        text: string
      }[]
    }

    return result.translations[0].text
  } catch (e) {
    return "번역 실패) " + e
  }
}

const createTranslatedCaption = (
  captionText: string,
  parentNode: HTMLElement
) => {
  const translatedCaption = document.createElement("div")

  translatedCaption.textContent = captionText
  translatedCaption.className = "translated-caption"

  $(".translated-caption")?.remove()
  parentNode.style.display = "flex"
  parentNode.style.flexDirection = "column"
  parentNode.prepend(translatedCaption)

  lastCaption = captionText
}

const translateCaption = async (originalCaptionSelector: string) => {
  if (Date.now() - then > 50) {
    const translateOn = await getStorage("translate")

    if (!translateOn) {
      $(".translated-caption")?.remove()

      requestAnimationFrame(() => translateCaption(originalCaptionSelector))
      return
    }

    const captionDiv = $<HTMLDivElement>(originalCaptionSelector)

    if (!captionDiv) {
      requestAnimationFrame(() => translateCaption(originalCaptionSelector))
      return
    }

    const parentNode = captionDiv.parentNode! as HTMLDivElement

    const captionText = captionDiv.textContent.trim()
    const isBlankText = captionText.length === 0
    const isSameCaption = lastCaption === captionText

    if (isBlankText || isSameCaption) {
      requestAnimationFrame(() => translateCaption(originalCaptionSelector))
      return
    }

    const savedCaption = await getStorage<string>(captionText)

    if (savedCaption) {
      createTranslatedCaption(savedCaption, parentNode)

      requestAnimationFrame(() => translateCaption(originalCaptionSelector))
      return
    }

    const translateText = await translate(captionText)

    setStorage(captionText, translateText)

    createTranslatedCaption(translateText, parentNode)
  }

  requestAnimationFrame(() => translateCaption(originalCaptionSelector))
}

const main = () => {
  if (location.href.includes("threejs-journey.com/lessons/")) {
    translateCaption(".js-tracks-text")
    return
  }

  if (location.href.includes("youtube.com")) {
    translateCaption(".captions-text")
    return
  }

  if (location.href.includes("udemy.com")) {
    translateCaption('div[data-purpose="captions-cue-text"]')
    return
  }
}

main()
