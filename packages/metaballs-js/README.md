# metaballs-js

[![NPM](https://img.shields.io/npm/v/metaballs-js.svg)](https://www.npmjs.com/package/metaballs-js)
![License](https://img.shields.io/npm/l/metaballs-js.svg)
[![BundlePhobia](https://img.shields.io/bundlephobia/min/metaballs-js.svg)](https://bundlephobia.com/result?p=metaballs-js)
![Last Commit](https://img.shields.io/github/last-commit/MrToph/metaballs-js.svg)

[Example / Demo](TODO)

## Features

- Light-weight: Written in plain WebGL without any other dependencies. (link to bundlephobia)
- Performant: Makes use of GPU hardware acceleration. The performance solely depends on the number of metaballs.

## Install

```bash
npm install --save metaballs-js
```

## Usage

```jsx
import initMetaballs from "metaballs-js";

const options = {
  numMetaballs: 100,
  minRadius: 3,
  maxRadius: 7.5,
  speed: 10.0,
  color: '#ff0024',
  backgroundColor: '#121212',
  useDevicePixelRatio: true
}

const cssSelector = '#canvasId'
initMetaballs(cssSelector, options)

// in your HTML
<html>
  <body>
    <canvas id="#canvasId"></canvas>
  </body>
</html>
```

### Options

| Name                | Description                                     | Type    |                            Default Value                             |
| :------------------ | :---------------------------------------------- | :------ | :------------------------------------------------------------------: |
| numMetaballs        | The number of metaballs to display              | Number  |                                `100`                                 |
| minRadius           | minimum radius of a metaball                    | Number  |                                 `3`                                  |
| maxRadius           | maximum radius of a metaball                    | Number  |                                `7.5`                                 |
| speed               | maximum speed of a metaball                     | Number  |                                `10.0`                                |
| color               | color of the metaballs                          | String  | ![#ff0024](https://placehold.it/15/ff0024/000000?text=+) `'#ff0024'` |
| backgroundColor     | The background color of the canvas              | String  | ![#121212](https://placehold.it/15/121212/000000?text=+) `'#121212'` |
| useDevicePixelRatio | Use more pixels matching the device pixel ratio | Boolean |                                `true`                                |

## Limitations

Metaballs-js currently uses uniforms to send the metaball positions to the GPU / shaders.
There are specific device restrictions on the max number of uniforms, i.e., also on the max number of metaballs one can render at a time.
If this happens you will see the following error thrown:

```
Shader compile failed with: ERROR: too many uniforms
```

This is especially problematic on mobile phones.

## Resources

* The code is largely based on [Jamie Wong's excellent tutorial](http://jamie-wong.com/2016/07/06/metaballs-and-webgl/)
* [Jamie Wong explaining the math](http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/)

## License

MIT © [MrToph](https://github.com/MrToph)
