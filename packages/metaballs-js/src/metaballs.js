import { getUniformLocation } from './utils'

const createMetaballs = ({ options, canvasWidth, canvasHeight }) => {
  return Array.from({ length: options.numMetaballs }, () => {
    const radius =
      options.minRadius +
      Math.random() * (options.maxRadius - options.minRadius)
    return {
      x: Math.random() * (100 - radius / 100) + radius / 200,
      y: Math.random() * (100 - radius / 100) + radius / 200,
      vx: (Math.random() - 0.5) * 2 * options.speed / 100,
      vy: (Math.random() - 0.5) * 2 * options.speed / 100,
      r: radius
    }
  })
}

const simulateMovement = ({ metaballs, canvasWidth, canvasHeight }) => {
  metaballs.forEach(mb => {
    mb.x += mb.vx
    if (mb.x < 0) {
      mb.x = 100 - mb.x
    } else if (mb.x > 100) {
      mb.x = mb.x - 100
    }
    mb.y += mb.vy
    if (mb.y < 0) {
      mb.y = 100 - mb.y
    } else if (mb.y > 100) {
      mb.y = mb.y - 100
    }
  })
}

const getMetaballsHandle = ({ gl, program }) => {
  const metaballsHandle = getUniformLocation({ gl, program, name: 'metaballs' })
  return metaballsHandle
}

export { createMetaballs, getMetaballsHandle, simulateMovement }
