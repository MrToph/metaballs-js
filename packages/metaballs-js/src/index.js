import hexToVec4 from "./hex-to-vec4";

const defaultOptions = {
  numMetaballs: 100,
  minRadius: 6,
  maxRadius: 36,
  speed: 1.0,
  color: "#ff0024",
  backgroundColor: "#121212"
};

export default function initMetaballs(canvas, passedOptions = {}) {
  const options = Object.keys(defaultOptions).reduce(
    (acc, key) =>
      Object.assign(acc, { [key]: passedOptions[key] !== undefined ? passedOptions[key] : defaultOptions[key] }),
    {}
  );

  if (typeof canvas === "string") {
    canvas = document.getElementById(canvas);
  }
  if (!canvas instanceof Element || canvas.tagName.toLowerCase() !== "canvas") {
    throw new Error(
      `First argument of "initMetaballs" must be a valid canvas element or a selector to an existing canvas element.`
    );
  }

  var NUM_METABALLS = options.numMetaballs;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;
  console.log({ WIDTH, HEIGHT });
  /**
   * Shaders
   */
  var gl = canvas.getContext("webgl");

  // Utility to fail loudly on shader compilation failure
  function compileShader(shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  var vertexShader = compileShader(
    "\n\
attribute vec2 position;\n\
\n\
void main() {\n\
    // position specifies only x and y.\n\
    // We set z to be 0.0, and w to be 1.0\n\
    gl_Position = vec4(position, 0.0, 1.0);\n\
}\
",
    gl.VERTEX_SHADER
  );

  const colorVec4 = hexToVec4(options.color);
  const backgroundColorVec4 = hexToVec4(options.backgroundColor);
  var fragmentShader = compileShader(
    `
precision highp float;
uniform vec3 metaballs[${NUM_METABALLS}];

void main(){
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float v = 0.0;
    for (int i = 0; i < ${NUM_METABALLS}; i++) {
        vec3 mb = metaballs[i];
        float dx = mb.x - x;
        float dy = mb.y - y;
        float r = mb.z;
        v += r*r/(dx*dx + dy*dy);
    }
    if (v > 1.0) {
        gl_FragColor = vec4(${colorVec4.join(", ")});
    } else {
        gl_FragColor = vec4(${backgroundColorVec4.join(", ")});
    }
}
`,
    gl.FRAGMENT_SHADER
  );

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  /**
   * Geometry setup
   */

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
  ]);
  var vertexDataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  /**
   * Attribute setup
   */

  // Utility to complain loudly if we fail to find the attribute

  function getAttribLocation(program, name) {
    var attributeLocation = gl.getAttribLocation(program, name);
    if (attributeLocation === -1) {
      throw "Can not find attribute " + name + ".";
    }
    return attributeLocation;
  }

  // To make the geometry information available in the shader as attributes, we
  // need to tell WebGL what the layout of our data in the vertex buffer is.
  var positionHandle = getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionHandle);
  gl.vertexAttribPointer(
    positionHandle,
    2, // position is a vec2
    gl.FLOAT, // each component is a float
    gl.FALSE, // don't normalize values
    2 * 4, // two 4 byte float components per vertex
    0 // offset into each span of vertex data
  );

  /**
   * Simulation setup
   */

  var metaballs = [];

  for (var i = 0; i < NUM_METABALLS; i++) {
    var radius =
      options.minRadius +
      Math.random() * (options.maxRadius - options.minRadius);
    metaballs.push({
      x: Math.random() * (WIDTH - 2 * radius) + radius,
      y: Math.random() * (HEIGHT - 2 * radius) + radius,
      vx: (Math.random() - 0.5) * 2 * options.speed,
      vy: (Math.random() - 0.5) * 2 * options.speed,
      r: radius
    });
  }

  /**
   * Uniform setup
   */

  // Utility to complain loudly if we fail to find the uniform
  function getUniformLocation(program, name) {
    var uniformLocation = gl.getUniformLocation(program, name);
    if (uniformLocation === -1) {
      throw "Can not find uniform " + name + ".";
    }
    return uniformLocation;
  }
  var metaballsHandle = getUniformLocation(program, "metaballs");

  /**
   * Simulation step, data transfer, and drawing
   */

  let run = true;
  var step = function() {
    // Update positions and speeds
    for (var i = 0; i < NUM_METABALLS; i++) {
      var mb = metaballs[i];

      mb.x += mb.vx;
      if (mb.x - mb.r < 0) {
        mb.x = mb.r + 1;
        mb.vx = Math.abs(mb.vx);
      } else if (mb.x + mb.r > WIDTH) {
        mb.x = WIDTH - mb.r;
        mb.vx = -Math.abs(mb.vx);
      }
      mb.y += mb.vy;
      if (mb.y - mb.r < 0) {
        mb.y = mb.r + 1;
        mb.vy = Math.abs(mb.vy);
      } else if (mb.y + mb.r > HEIGHT) {
        mb.y = HEIGHT - mb.r;
        mb.vy = -Math.abs(mb.vy);
      }
    }

    // To send the data to the GPU, we first need to
    // flatten our data into a single array.
    var dataToSendToGPU = new Float32Array(3 * NUM_METABALLS);
    for (var i = 0; i < NUM_METABALLS; i++) {
      var baseIndex = 3 * i;
      var mb = metaballs[i];
      dataToSendToGPU[baseIndex + 0] = mb.x;
      dataToSendToGPU[baseIndex + 1] = mb.y;
      dataToSendToGPU[baseIndex + 2] = mb.r;
    }
    gl.uniform3fv(metaballsHandle, dataToSendToGPU);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (run) requestAnimationFrame(step);
  };

  step();

  return () => {
    run = false;
  };
}
