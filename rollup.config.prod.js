import path from "path";

import { configs } from "./rollup.config.common";

function getConfig(pathname, base) {
  const dist = path.resolve(pathname, "dist");
  const pkg = require(path.resolve(pathname, "package.json"));
  return {
    ...base,
    // output: {
    //   dir: dist,
    //   entryFileNames: '[name].prod.js',
    //   chunkFileNames: '[name]-[hash].prod.js',
    //   format: 'cjs',
    //   exports: 'named',
    // },
    output: [
      {
        file: path.resolve(pathname, pkg.main),
        format: "cjs",
        sourcemap: true
    },
    {
        file: path.resolve(pathname, pkg.module),
        format: "es",
        sourcemap: true
      }
    ],
    plugins: [
      ...base.plugins,
    ]
  };
}

export default configs.map(([pathname, config]) => getConfig(pathname, config));
