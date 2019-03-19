const createMetaballs = ({ options, canvasWidth, canvasHeight }) => {
  return Array.from({ length: options.numMetaballs }, () => {
    var radius =
      options.minRadius +
      Math.random() * (options.maxRadius - options.minRadius)
    return {
      x: Math.random() * (canvasWidth - 2 * radius) + radius,
      y: Math.random() * (canvasHeight - 2 * radius) + radius,
      vx: (Math.random() - 0.5) * 2 * options.speed,
      vy: (Math.random() - 0.5) * 2 * options.speed,
      r: radius
    }
  })
}

const simulateStep = ({ metaballs, canvasWidth, canvasHeight }) => {
  metaballs.forEach(mb => {
    mb.x += mb.vx
    if (mb.x - mb.r < 0) {
      mb.x = mb.r + 1
      mb.vx = Math.abs(mb.vx)
    } else if (mb.x + mb.r > canvasWidth) {
      mb.x = canvasWidth - mb.r
      mb.vx = -Math.abs(mb.vx)
    }
    mb.y += mb.vy
    if (mb.y - mb.r < 0) {
      mb.y = mb.r + 1
      mb.vy = Math.abs(mb.vy)
    } else if (mb.y + mb.r > canvasHeight) {
      mb.y = canvasHeight - mb.r
      mb.vy = -Math.abs(mb.vy)
    }
  })
}

const getMetaballsHandle = ({ gl, program }) => {
  // Utility to complain loudly if we fail to find the uniform
  function getUniformLocation(program, name) {
    const uniformLocation = gl.getUniformLocation(program, name)
    if (uniformLocation === -1) {
      throw new Error(`Can not find uniform ${name}.`)
    }
    return uniformLocation
  }

  const metaballsHandle = getUniformLocation(program, 'metaballs')
  return metaballsHandle
}

export { createMetaballs, getMetaballsHandle, simulateStep }
