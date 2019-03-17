# Metaballs-js

Monorepo for all the official `metaballs-js` libraries.

See the individual packages' READMEs for more information:

* [metaballs-js](packages/metaballs-js): The core WebGL & vanilla JavaScript metaballs package
* [react-metaballs-js](packages/react-metaballs-js): The official react-wrapper for metaballs-js

## Development

```
yarn # or npm i
lerna start # starts the example app in packages/example

# make changes to packages
lerna bootstrap # propagates changes and hot-reloads example app
```