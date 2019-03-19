import getOptions from './get-options'
import shaders from './shaders'
import geometry from './geometry'
import { createMetaballs, getMetaballsHandle, simulateStep } from './metaballs'

function resize({ gl }) {
  var realToCSSPixels = window.devicePixelRatio

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  var displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels)
  var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels)

  // Check if the canvas is not the same size.
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // Make the canvas the same size
    gl.canvas.width = displayWidth
    gl.canvas.height = displayHeight
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  }
}

export default function initMetaballs(canvas, passedOptions = {}) {
  const options = getOptions(passedOptions)

  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas)
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

  // user might now have set correct canvasWidth / canvasHeight
  resize({ gl })
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  console.log({ canvasWidth, canvasHeight })
  const metaballs = createMetaballs({
    options,
    canvasWidth,
    canvasHeight
  })
  const metaballsHandle = getMetaballsHandle({ gl, program })

  /**
   * Simulation step, data transfer, and drawing
   */
  let run = true
  const step = function() {
    // Update positions and speeds
    simulateStep({ metaballs, canvasWidth, canvasHeight })

    // To send the data to the GPU, we first need to
    // flatten our data into a single array.
    const dataToSendToGPU = new Float32Array(3 * metaballs.length)
    metaballs.forEach((mb, i) => {
      const baseIndex = 3 * i
      dataToSendToGPU[baseIndex + 0] = mb.x
      dataToSendToGPU[baseIndex + 1] = mb.y
      dataToSendToGPU[baseIndex + 2] = mb.r
    })
    gl.uniform3fv(metaballsHandle, dataToSendToGPU)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    if (run) window.requestAnimationFrame(step)
  }

  step()

  const destroy = () => {
    run = false
  }

  return destroy
}
