import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DivisionInequalityProperty from './components/DivisionInequalityProperty'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <DivisionInequalityProperty />
    </div>
);

}

export default App
