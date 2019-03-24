// Utility to complain loudly if we fail to find the uniform
export function getUniformLocation({ gl, program, name }) {
  const uniformLocation = gl.getUniformLocation(program, name)
  if (uniformLocation === -1) {
    throw new Error(`Can not find uniform ${name}.`)
  }
  return uniformLocation
}
