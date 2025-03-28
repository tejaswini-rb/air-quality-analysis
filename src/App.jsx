import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import D3Chart from './D3chart'
import Dropdown from './dropdown'
import CorrelationHeatmap from './CorrelationHeatmap'

function App() {
    return (
      <>
        <h1>Air Quality Analysis</h1>
        <Dropdown />
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
          <D3Chart />
          <CorrelationHeatmap />
        </div>
      </>
    )
  }

export default App
