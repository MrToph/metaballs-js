export default function initInteractive({ options, gl }) {
  let cursorPos = {
    x: 0,
    y: 0
  }

  function cursorMove(e) {
    cursorPos.x = (e.offsetX || e.clientX) / gl.canvas.clientWidth
    cursorPos.y = (e.offsetY || e.clientY) / gl.canvas.clientHeight
    cursorPos.x = cursorPos.x * 100
    cursorPos.y = (1 - cursorPos.y) * 100
  }

  if (options.interactive) {
    gl.canvas.addEventListener('mousemove', cursorMove)
  }

  return {
    cursorPos,
    cursorMove
  }
}
