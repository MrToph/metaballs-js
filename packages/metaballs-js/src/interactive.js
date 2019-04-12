export default function initInteractive({ options, gl }) {
  const { interactive } = options

  if (interactive && ![`window`, `canvas`].includes(interactive)) {
    throw new Error(
      `options.interactive must be one of "false", "'window'", or "'canvas'". Provided "${interactive}" (${typeof interactive}).`
    )
  }

  let cursorPos = {
    x: 0,
    y: 0
  }

  function cursorMoveCanvas(e) {
    cursorPos.x = (e.offsetX || e.clientX) / gl.canvas.clientWidth
    cursorPos.y = (e.offsetY || e.clientY) / gl.canvas.clientHeight
    cursorPos.x = cursorPos.x * 100
    cursorPos.y = (1 - cursorPos.y) * 100
  }

  function cursorMoveWindow(e) {
    cursorPos.x = e.clientX / gl.canvas.clientWidth
    cursorPos.y = e.clientY / gl.canvas.clientHeight
    cursorPos.x = cursorPos.x * 100
    cursorPos.y = (1 - cursorPos.y) * 100
  }

  let cursorMove = () => null
  let unsubscribe = () => null

  if (interactive) {
    if (interactive === `window`) {
      cursorMove = cursorMoveWindow
      window.addEventListener('mousemove', cursorMove)
      unsubscribe = () => window.removeEventListener('mousemove', cursorMove)
    } else if (interactive === `canvas`) {
      cursorMove = cursorMoveCanvas
      gl.canvas.addEventListener('mousemove', cursorMove)
      unsubscribe = () => gl.canvas.removeEventListener('mousemove', cursorMove)
    }
  }

  return {
    cursorPos,
    unsubscribe
  }
}
