const defaultOptions = {
  numMetaballs: 100,
  minRadius: 6,
  maxRadius: 36,
  speed: 1.0,
  color: '#ff0024',
  backgroundColor: '#121212'
}

export default function getOptions(passedOptions) {
  const mergedOptions = Object.keys(defaultOptions).reduce(
    (acc, key) =>
      Object.assign(acc, {
        [key]:
          passedOptions[key] !== undefined
            ? passedOptions[key]
            : defaultOptions[key]
      }),
    {}
  )

  return mergedOptions
}
