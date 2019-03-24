import React, { Component } from "react";
import Metaballs from "react-metaballs-js";
import "../node_modules/react-dat-gui/build/react-dat-gui.css";
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
      package: "metaballs-js",
      numMetaballs: 100,
      minRadius: 3,
      maxRadius: 5,
      speed: 10.0,
      color: "#ff0024",
      backgroundColor: "#121212"
    }
  };

  handleUpdate = data => this.setState({ data });

  render() {
    const { data } = this.state;
    return (
      <>
        <Metaballs key={JSON.stringify(data)} {...data} />

        <DatGui className="gui" data={data} onUpdate={this.handleUpdate}>
          <DatString path="package" label="Package" />
          <DatNumber
            path="numMetaballs"
            label="Number of Metaballs"
            min={1}
            max={500}
            step={1}
          />
          <DatNumber
            path="minRadius"
            label="Min. Radius"
            min={0}
            max={100}
            step={0.1}
          />
          <DatNumber
            path="maxRadius"
            label="Max. Radius"
            min={0}
            max={100}
            step={0.1}
          />
          <DatNumber
            path="speed"
            label="Speed"
            min={0}
            max={100}
            step={1.00}
          />
          <DatColor path="color" label="Color" />
          <DatColor path="backgroundColor" label="Background" />
        </DatGui>
      </>
    );
  }
}

export default App;
