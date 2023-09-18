import planet from './images/planet.png';
import github from './images/github.png';
import lock from './images/lock.png';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './custom-js-codes/hover.js'

function App() {
  return (
      <div className="App">
        <div id='section-1'>
            <img src={planet} id='first-fantasy' className='fantasy-img' alt='planet'></img>
            <button id='launch-btn' className='btn btn-light'>Open App</button>
            <button id='github-btn' className='btn btn-light'>See in Github</button>
        </div>
        <div id='section-2'>
            <img src={github} id='secend-fantasy' className='fantasy-img' alt='planet'></img>
        </div>
        <div id='section-3'>
            <img src={lock} id='third-fantasy' className='fantasy-img' alt='planet'></img>
        </div>
      </div>
  );
}

export default App;
