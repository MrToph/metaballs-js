import React, { Component } from "react";
import initMetaballs from "metaballs-js";
import '../node_modules/react-dat-gui/build/react-dat-gui.css';
import DatGui, {
  DatBoolean,
  DatColor,
  DatNumber,
  DatString
} from "react-dat-gui";
import "./App.css";

class App extends Component {
  ref = React.createRef();

  state = {
    data: {
      package: "react-dat-gui",
      power: 9000,
      isAwesome: true,
      feelsLike: "#2FA1D6"
    }
  };

  componentDidMount() {
    initMetaballs(this.ref.current);
    console.log(this.ref.current.width);
  }

  // rendering handled by metaballs-js
  shouldComponentUpdate() {
    return false;
  }

  handleUpdate = data => this.setState({ data });

  render() {
    const { data } = this.state;
    return (
      <>
        <canvas
          // width="500"
          // height="400"
          ref={this.ref}
        />

        <DatGui className="gui" data={data} onUpdate={this.handleUpdate}>
          <DatString path="package" label="Package" />
          <DatNumber
            path="power"
            label="Power"
            min={9000}
            max={9999}
            step={1}
          />
          <DatBoolean path="isAwesome" label="Awesome?" />
          <DatColor path="feelsLike" label="Feels Like" />
        </DatGui>
      </>
    );
  }
}

export default App;
