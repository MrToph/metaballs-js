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

void main(){
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float v = 0.0;
    for (int i = 0; i < ${options.numMetaballs}; i++) {
        vec3 mb = metaballs[i];
        float dx_1 = (mb.x / 100.0 * windowSize.x) - x;
        float dx_2 = ((mb.x < 50.0 ? mb.x + 100.0 : mb.x - 100.0) / 100.0 * windowSize.x) - x;
        float dx_sq = min(dx_1 * dx_1, dx_2 * dx_2);
        float dy_1 = (mb.y / 100.0 * windowSize.y) - y;
        float dy_2 = ((mb.y < 50.0 ? mb.y + 100.0 : mb.y - 100.0)/ 100.0 * windowSize.y) - y;
        float dy_sq =  min(dy_1 * dy_1, dy_2 * dy_2);
        float r = mb.z / 200.0 * min(windowSize.x, windowSize.y);
        v += r*r/(dx_sq + dy_sq);
        // float dx = (mb.x / 100.0 * windowSize.x) - x;
        // float dy = (mb.y / 100.0 * windowSize.y) - y;
        // float r = mb.z / 200.0 * min(windowSize.x, windowSize.y);
        // v += r*r/(dx*dx + dy*dy);
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
