import React, { Component } from "react";
import Metaballs from "react-metaballs-js";
import "../node_modules/react-dat-gui/build/react-dat-gui.css";
import DatGui, {
  DatColor,
  DatNumber,
  DatString,
  DatSelect
} from "react-dat-gui";
import Info from "./Info";
import "./App.css";

class App extends Component {
  ref = React.createRef();

  state = {
    data: {
      package: "metaballs-js",
      numMetaballs: 100,
      minRadius: 3,
      maxRadius: 7.5,
      speed: 10.0,
      color: "#ff0024",
      backgroundColor: "#121212",
      interactive: false
    }
  };

  handleUpdate = data => this.setState({ data });

  render() {
    const { data } = this.state;
    return (
      <>
        <Metaballs key={JSON.stringify(data)} {...data} className="balls" />

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
          <DatNumber path="speed" label="Speed" min={0} max={100} step={1.0} />
          <DatColor path="color" label="Color" />
          <DatColor path="backgroundColor" label="Background" />
          <DatSelect
            path="interactive"
            label="Interactive"
            options={[false, "window", "canvas"]}
          />
        </DatGui>
        <Info />
      </>
    );
  }
}

export default App;
