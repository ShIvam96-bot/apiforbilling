import CoreLayout from './components/layouts/CoreLayout';
import DeclarationState from './context/declaration/DeclarationState';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function App() {
  return (
    <div className="App">
     <DeclarationState>
        <CoreLayout />
      </DeclarationState>
    </div>
  );
}

export default App;
