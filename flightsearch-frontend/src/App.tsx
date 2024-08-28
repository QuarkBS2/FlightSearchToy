import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import FlightSearch from './components/FlightsSearch';
import FlightResults from './components/FlightResults';

function App() {
  return (

    <BrowserRouter>
      <Routes>
          <Route path='/' element={<FlightSearch />}/>
          <Route path='/FlightResults' element={<FlightResults />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
