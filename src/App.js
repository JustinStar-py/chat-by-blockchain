import space from './images/space.png';
import Header from './components /Header';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './custom-js-codes/hover.js'

function App() {
  return (
    <div className="App">
      <div id='section-1'>
        <Header />
        <img src={space} id='fantasy-main' alt='planet'></img>
        <button id='launch-btn' className='btn btn-primary'>Open App</button>
      </div>
      <div id='section-2'>
      </div>
    </div>
  );
}

export default App;
