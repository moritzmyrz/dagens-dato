import Title from "./components/Title";
import Main from "./components/Main";

const Timer = () => {
  return new Date();
};

const Dato = Timer();

const App = () => {
  return (
    <div id="app-main">
      <Main time={Dato}></Main>
      <Title time={Dato}></Title>
    </div>
  );
};

export default App;
