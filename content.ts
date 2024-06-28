import { sendToBackground } from "@plasmohq/messaging"

import "./content.css"

import { getStorage, setStorage } from "./utils/storage"

const $ = <T extends Element>(selector: string) =>
  document.querySelector(selector) as T

const translate = async (text: string) => {
  try {
    const response = await sendToBackground({
      name: "translate",
      body: {
        text
      }
    })

    return response.translate
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

let then = Date.now()
let lastCaption = ""

const translateCaption = async (originalCaptionSelector: string) => {
  if (Date.now() - then > 50) {
    const captionDiv = $<HTMLDivElement>(originalCaptionSelector)
    const captionText = captionDiv.textContent.trim()
    const isBlankText = captionText.length === 0
    const isSameCaption = lastCaption === captionText

    if (!captionDiv) {
      requestAnimationFrame(() => translateCaption(originalCaptionSelector))
      return
    }

    if (isBlankText || isSameCaption) {
      requestAnimationFrame(() => translateCaption(originalCaptionSelector))
      return
    }

    const savedCaption = await getStorage<string>(captionText)
    const parentNode = captionDiv.parentNode! as HTMLDivElement

    if (savedCaption) {
      createTranslatedCaption(savedCaption, parentNode)
      lastCaption = captionText
      requestAnimationFrame(() => translateCaption(originalCaptionSelector))
      return
    }

    const translateText = await translate(captionText)
    await setStorage(captionText, translateText)

    createTranslatedCaption(translateText, parentNode)
    lastCaption = captionText
  }

  requestAnimationFrame(() => translateCaption(originalCaptionSelector))
}

const main = async () => {
  if (location.href.includes("threejs-journey.com/lessons/")) {
    translateCaption(".js-tracks-text")
    return
  }
}

main()
