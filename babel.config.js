module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false
      }
    ],
    "@babel/preset-react",
    "@babel/preset-flow"
  ],
  plugins: [
    "@babel/proposal-class-properties"
    // "@babel/proposal-object-rest-spread"
  ]
};
