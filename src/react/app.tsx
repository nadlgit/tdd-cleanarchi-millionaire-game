import { Jokers } from './components/jokers/jokers';
import { Pyramid } from './components/pyramid/pyramid';
import { Question } from './components/question/question';

const App = () => {
  return (
    <main>
      <h1>Qui veut gagner des millions ?</h1>
      <div className="app-zone">
        <div className="main-zone">
          <Question />
        </div>
        <div className="side-zone">
          <Jokers />
          <Pyramid />
        </div>
      </div>
    </main>
  );
};

export default App;
