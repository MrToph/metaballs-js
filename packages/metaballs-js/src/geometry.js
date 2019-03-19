export default function geometry({ gl, program }) {
  // Set up 4 vertices, which we'll draw as a rectangle
  // via 2 triangles
  //
  //   A---C
  //   |  /|
  //   | / |
  //   |/  |
  //   B---D
  //
  // We order them like so, so that when we draw with
  // gl.TRIANGLE_STRIP, we draw triangle ABC and BCD.
  var vertexData = new Float32Array([
    -1.0,
    1.0, // top left
    -1.0,
    -1.0, // bottom left
    1.0,
    1.0, // top right
    1.0,
    -1.0 // bottom right
  ])
  var vertexDataBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)

  /**
   * Attribute setup
   */

  // Utility to complain loudly if we fail to find the attribute

  function getAttribLocation(program, name) {
    var attributeLocation = gl.getAttribLocation(program, name)
    if (attributeLocation === -1) {
      throw new Error(`Can not find attribute ${name}.`)
    }
    return attributeLocation
  }

  // To make the geometry information available in the shader as attributes, we
  // need to tell WebGL what the layout of our data in the vertex buffer is.
  var positionHandle = getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(positionHandle)
  gl.vertexAttribPointer(
    positionHandle,
    2, // position is a vec2
    gl.FLOAT, // each component is a float
    gl.FALSE, // don't normalize values
    2 * 4, // two 4 byte float components per vertex
    0 // offset into each span of vertex data
  )
}
