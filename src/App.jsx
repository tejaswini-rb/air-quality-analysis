import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import D3Chart from './D3chart'
import Dropdown from './dropdown'
import CorrelationHeatmap from './CorrelationHeatmap'
import AQILineChart from './aqi_line'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Map</h1>
      <Dropdown />
      <D3Chart />
      <CorrelationHeatmap />
      <AQILineChart />
      
    </>
  )
}

export default App
