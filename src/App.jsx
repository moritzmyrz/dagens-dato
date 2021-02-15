import Main from "./components/Main";

const App = () => {
  Timer();

  return (
    <div id="app-main">
      <Main time={Timer()}></Main>
    </div>
  );
};

const Timer = () => {
  return new Date();
};

export default App;
