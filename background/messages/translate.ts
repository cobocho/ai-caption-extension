import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const text = req.body.text

    const translateResponse = await fetch(
      "https://api-free.deepl.com/v2/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "DeepL-Auth-Key 846cd420-f694-458c-8c6e-ed29285ad0e9:fx"
        },
        body: JSON.stringify({
          text: [text],
          target_lang: "KO"
        })
      }
    )

    if (translateResponse.ok) {
      const result = await translateResponse.json()

      res.send({
        translate: result.translations[0].text
      })
    }
  } catch (e) {
    res.send({
      translate: "번역 실패) " + e
    })
  }
}

export default handler
