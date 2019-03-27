import colorToVec4 from './color-to-vec4'

export default function shaders({ gl, options }) {
  // Utility to fail loudly on shader compilation failure
  function compileShader(shaderSource, shaderType) {
    const shader = gl.createShader(shaderType)
    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        `Shader compile failed with: ${gl.getShaderInfoLog(shader)}`
      )
    }

    return shader
  }

  const vertexShader = compileShader(
    `
attribute vec2 position;

void main() {
    // position specifies only x and y.
    // We set z to be 0.0, and w to be 1.0
    gl_Position = vec4(position, 0.0, 1.0);
}
`,
    gl.VERTEX_SHADER
  )

  const colorVec4 = colorToVec4(options.color)
  const backgroundColorVec4 = colorToVec4(options.backgroundColor)
  const fragmentShader = compileShader(
    `
precision highp float;
uniform vec2 windowSize;
uniform vec3 metaballs[${options.numMetaballs}];
// scaling from [0,100] to [0, canvasWidth/Height]
float radiusMultiplier = min(windowSize.x, windowSize.y) / 200.0;
float xMultiplier = windowSize.x / 100.0;
float yMultiplier = windowSize.y / 100.0;

void main(){
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float v = 0.0;
    for (int i = 0; i < ${options.numMetaballs}; i++) {
        vec3 mb = metaballs[i];
        float dx = abs((mb.x * xMultiplier) - x);
        // width - dx is needed for the wrap-around-the-edges logic
        dx = min(dx, windowSize.x - dx);
        float dy = abs((mb.y * yMultiplier) - y);
        // height - dy is needed for the wrap-around-the-edges logic
        dy = min(dy, windowSize.y - dy);
        float r = mb.z * radiusMultiplier;
        v += r*r/(dx*dx + dy*dy);
    }
    if (v > 1.0) {
        gl_FragColor = vec4(${colorVec4.join(', ')});
    } else {
        gl_FragColor = vec4(${backgroundColorVec4.join(', ')});
    }
}
`,
    gl.FRAGMENT_SHADER
  )

  return {
    vertexShader,
    fragmentShader
  }
}
