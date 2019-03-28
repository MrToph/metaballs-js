# metaballs-js

[Example / Demo](TODO)
> React component for metaballs-js

[![NPM](https://img.shields.io/npm/v/react-metaballsjs.svg)](https://www.npmjs.com/package/metaballs-js)

## Install

```bash
npm install --save metaballs-js
```

## Usage

```jsx
import React, { Component } from "react";
import Metaballs from "react-metaballs-js";

class Example extends Component {
  render() {
    return (
      <Metaballs
        numMetaballs={100}
        minRadius={3}
        maxRadius={7.5}
        speed={10.0}
        color="#ff0024"
        backgroundColor="#121212"
      />
    );
  }
}
```

### Props

Accepts all options from [metaballs-js](../metaballs-js)

| Name                | Description                                     | Type    | Required |                            Default Value                             |
| :------------------ | :---------------------------------------------- | :------ | :------: | :------------------------------------------------------------------: |
| numMetaballs        | The number of metaballs to display              | Number  |          |                                `100`                                 |
| minRadius           | minimum radius of a metaball                    | Number  |          |                                 `3`                                  |
| maxRadius           | maximum radius of a metaball                    | Number  |          |                                `7.5`                                 |
| speed               | maximum speed of a metaball                     | Number  |          |                                `10.0`                                |
| color               | color of the metaballs                          | String  |          | ![#ff0024](https://placehold.it/15/ff0024/000000?text=+) `'#ff0024'` |
| backgroundColor     | The background color of the canvas              | String  |          | ![#121212](https://placehold.it/15/121212/000000?text=+) `'#121212'` |
| useDevicePixelRatio | Use more pixels matching the device pixel ratio | Boolean |          |                                `true`                                |

> Additionally, any **other props will be forwarded to the underlying `canvas` element**. This enabled styling and setting the size through `className` or `style` props.

## License

MIT © [MrToph](https://github.com/MrToph)
