import "../style/App.scss";
import Title from "./Title";
import Main from "./Main";
import * as React from "react";
import { Dato } from "../functions/Dato";

const App: React.FC = () => {
  return (
    <div id="app-main">
      <Main time={Dato}></Main>
      <Title time={Dato}></Title>
    </div>
  );
};

export default App;
