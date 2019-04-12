const defaultOptions = {
  numMetaballs: 100,
  minRadius: 3,
  maxRadius: 7.5,
  speed: 10.0,
  color: '#ff0024',
  backgroundColor: '#121212',
  useDevicePixelRatio: true,
  interactive: false
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
