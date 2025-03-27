import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import D3Chart from './D3chart'
import Dropdown from './dropdown'
import CorrelationHeatmap from './CorrelationHeatmap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Map</h1>
      <Dropdown />
      <D3Chart />
      <CorrelationHeatmap />
      
    </>
  )
}

export default App
