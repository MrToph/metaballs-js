import React, { Component } from 'react'
import PropTypes from 'prop-types'
import initMetaballs from 'metaballs-js'

class Metaballs extends Component {
  static propTypes = {
    numMetaballs: PropTypes.number,
    minRadius: PropTypes.number,
    maxRadius: PropTypes.number,
    speed: PropTypes.number,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    interactive: PropTypes.bool,
    useDevicePixelRatio: PropTypes.bool
  }

  ref = React.createRef()

  componentDidMount() {
    const { options } = this.splitProps()
    try {
      this.stopMetaballsAnimation = initMetaballs(this.ref.current, options)
    } catch (err) {
      console.error(err.message)
    }
  }

  componentWillUnmount() {
    if (typeof this.stopMetaballsAnimation === 'function') {
      this.stopMetaballsAnimation()
    }
  }

  // rendering handled by metaballs-js
  shouldComponentUpdate() {
    return false
  }

  splitProps() {
    const {
      numMetaballs,
      minRadius,
      maxRadius,
      speed,
      color,
      backgroundColor,
      interactive,
      useDevicePixelRatio,
      ...canvasProps
    } = this.props

    const options = {
      numMetaballs,
      minRadius,
      maxRadius,
      speed,
      color,
      backgroundColor,
      interactive,
      useDevicePixelRatio
    }

    return {
      options,
      canvasProps
    }
  }

  render() {
    const { canvasProps } = this.splitProps()

    return <canvas {...canvasProps} ref={this.ref} />
  }
}

export default Metaballs
