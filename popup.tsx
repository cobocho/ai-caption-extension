import { useLayoutEffect, useState } from "react"

import { clearStorage, getStorage, setStorage } from "~utils/storage"

function IndexPopup() {
  const [on, setOn] = useState(false)

  const onClickClear = async () => {
    const all = await clearStorage()
    console.log(Object.keys(all))
  }

  useLayoutEffect(() => {
    const setDefaultOn = async () => {
      const translateOn = await getStorage<boolean>("translate")

      if (translateOn === undefined) {
        await setStorage("translate", false)
        setOn(false)
        return
      }

      setOn(translateOn)
    }

    setDefaultOn()
  }, [])

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>Clear Caption Storage</h2>
      <button onClick={onClickClear}>Clear</button>
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => {
          setStorage("translate", e.target.checked ? true : false)
          setOn(e.target.checked)
        }}
      />
    </div>
  )
}

export default IndexPopup
