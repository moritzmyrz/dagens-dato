import { Dato } from "functions/Dato";
import * as React from "react";
import "style/App.scss";
import Main from "./Main";
import Title from "./Title";

const App: React.FC = () => {
  return (
    <div id="app-main">
      <Main time={Dato}></Main>
      <Title time={Dato}></Title>
    </div>
  );
};

export default App;
