import React, { useState } from "react";
import "./Info.css";
import { ReactComponent as GithubSvg } from "./assets/github.svg";
import packageJson from "react-metaballs-js/package.json";

export default function Info() {
  const [visible, setVisible] = useState(true);

  return (
    <div
      id="info"
      className={visible && "visible"}
      onClick={() => setVisible(v => !v)}
    >
      <div>
        <h1>{`${packageJson.name}@${packageJson.version}`}</h1>
        <a href="https://github.com/MrToph/metaballs-js">
          <span>GitHub</span>
          <GithubSvg width={18} height={18} />
        </a>
      </div>
    </div>
  );
}
