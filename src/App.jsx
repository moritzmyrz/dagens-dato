import Title from "./components/Title";
import Main from "./components/Main";

import { Dato } from "./functions/Dato";

const App = () => {
  return (
    <div id="app-main">
      <Main time={Dato}></Main>
      <Title time={Dato}></Title>
    </div>
  );
};

export default App;
