# react-metaballs-js

> React component for metaballs-js

[![NPM](https://img.shields.io/npm/v/react-metaballs-js.svg)](https://www.npmjs.com/package/react-metaballs-js)
![License](https://img.shields.io/npm/l/react-metaballs-js.svg)
[![BundlePhobia](https://img.shields.io/bundlephobia/min/react-metaballs-js.svg)](https://bundlephobia.com/result?p=react-metaballs-js)
![Last Commit](https://img.shields.io/github/last-commit/MrToph/metaballs-js.svg)

## Install

```bash
npm install --save react-metaballs-js
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
        className="balls"
      />
    );
  }
}
```

### Props

Accepts all options from [metaballs-js](../metaballs-js).

> Additionally, any **other props will be forwarded to the underlying `canvas` element**. This enables styling and setting the size through `className` or `style` props.

## License

MIT © [MrToph](https://github.com/MrToph)
