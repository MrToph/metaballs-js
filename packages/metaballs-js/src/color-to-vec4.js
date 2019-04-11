export default color => {
  const isValid = /^#[0-9A-F]{6,8}$/i.test(color)

  if (!isValid) {
    throw new Error(
      `${color} is not a valid hex color. Must be a 6 (8) character hex (+alpha) color.`
    )
  }

  const hexChannels = [
    color.slice(1, 3),
    color.slice(3, 5),
    color.slice(5, 7),
    color.slice(7, 9)
  ]
  const unitChannels = hexChannels
    .map(hex => Number.parseInt(hex, '16'))
    .map(val => val / 0xff)
  if (!Number.isFinite(unitChannels[3])) unitChannels[3] = 1.0

  return unitChannels
}
