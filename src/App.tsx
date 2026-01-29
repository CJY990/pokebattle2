import BattleScreen from "./components/BattleScreen";

function App() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen w-full select-none flex justify-center items-center">
      <BattleScreen />
    </div>
  );
}

export default App;
