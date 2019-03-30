import getOptions from './get-options'
import shaders from './shaders'
import geometry from './geometry'
import {
  createMetaballs,
  getMetaballsHandle,
  simulateMovement
} from './metaballs'
import { getUniformLocation } from './utils'

export default function initMetaballs(canvas, passedOptions = {}) {
  const options = getOptions(passedOptions)

  if (typeof canvas === 'string') {
    canvas = document.querySelector(canvas)
  }
  if (
    !(canvas instanceof window.Element) ||
    canvas.tagName.toLowerCase() !== 'canvas'
  ) {
    throw new Error(
      `First argument of "initMetaballs" must be a valid canvas element or a selector to an existing canvas element.`
    )
  }

  /**
   * Shaders setup
   */
  const gl = canvas.getContext('webgl')
  const { vertexShader, fragmentShader } = shaders({ gl, options })

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  /**
   * Canvas & Metaballs setup
   */
  geometry({ gl, program })

  // resize handler
  const resize = () => {
    const realToCSSPixels = options.useDevicePixelRatio ? window.devicePixelRatio : 1

    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.
    const displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels)
    const displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels)

    // Check if the canvas is not the same size.
    if (
      gl.canvas.width !== displayWidth ||
      gl.canvas.height !== displayHeight
    ) {
      // Make the canvas the same size
      gl.canvas.width = displayWidth
      gl.canvas.height = displayHeight
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    }
  }

  // user might now have set correct canvasWidth / canvasHeight
  resize()

  const metaballs = createMetaballs({
    options,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height
  })
  const metaballsHandle = getMetaballsHandle({ gl, program })

  // get windowSize uniform
  const windowSizeHandle = getUniformLocation({
    gl,
    program,
    name: 'windowSize'
  })

  /**
   * Simulation step, data transfer, and drawing
   */
  let run = true
  const step = function() {
    const canvasWidth = gl.canvas.width
    const canvasHeight = gl.canvas.height
    // Update positions and speeds
    simulateMovement({ metaballs, canvasWidth, canvasHeight })

    // To send the data to the GPU, we first need to
    // flatten our data into a single array.
    const dataToSendToGPU = new Float32Array(3 * metaballs.length)
    metaballs.forEach((mb, i) => {
      const baseIndex = 3 * i
      dataToSendToGPU[baseIndex + 0] = mb.x
      dataToSendToGPU[baseIndex + 1] = mb.y
      // TODO: radius should change when resizing according to
      // min{WIDTH,HEIGHT} * r
      dataToSendToGPU[baseIndex + 2] = mb.r
    })
    gl.uniform3fv(metaballsHandle, dataToSendToGPU)
    gl.uniform2fv(
      windowSizeHandle,
      Float32Array.from({ length: 2 }, (_, index) =>
        index === 0 ? canvasWidth : canvasHeight
      )
    )

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    if (run) window.requestAnimationFrame(step)
  }

  step()
  window.addEventListener('resize', resize)

  const destroy = () => {
    run = false
    window.removeEventListener('resize', resize)
  }
  return destroy
}
