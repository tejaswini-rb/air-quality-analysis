import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import D3Chart from './D3chart'
import DropdownYear from './DropdownYear'
import DropdownMonth from './DropdownMonth'
import CorrelationHeatmap from './CorrelationHeatmap'
import AQILineChart from './aqi_line'
import CityHeatmap from './CityHeatmap'
import MeanAQI from './MeanAQI'

function App() {
  const [count, setCount] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2015);
  const [selectedMonth, setSelectedMonth] = useState("January");

  return (
    <>
      <h1>Analyzing and Forecasting Air Quality in India</h1>
      <h2>About</h2>
      <p>Our project approaches this problem through two main areas of focus. We have studied both statistical analysis of air quality data to identify trends across different factors, as well as forecasting future air quality based on current data.</p>
      <h2>Statistical Analysis</h2>
      <h3>Overall Trends</h3>
      <CorrelationHeatmap />
      <MeanAQI /> 
      <h3>Monthly Trends</h3>

      <p>Update the year in the dropdown and interact with the heat map for more information</p>
      <DropdownYear selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <DropdownMonth selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}/>
      <CityHeatmap selectedYear={selectedYear} selectedMonth={selectedMonth} />
      
      <AQILineChart selectedYear={selectedYear} selectedMonth={selectedMonth}/>
      
      <h2>Forecasting</h2>
      <p>We used various methods in order to attempt forecasting air quality. The results of each of the methods are shown below.</p>
      <h3>ARIMA Model</h3>

      <h3>Linear Regression</h3>
      <img src="/linear_regression.png" alt="Linear Regression" />
      <p>Data: R-squared: 0.9217139055744
      Mean Squared Error: 651.3567823009216</p>
      <h3>Logistic Regression</h3>
      <img src="/logistic_regression.png" alt="Logistic Regression" />

      <h3>Random Forest</h3>
      <img src="/random_forest.png" alt="Random Forest" />

      <h3>SVM</h3>
      <img src="/svm.png" alt="SVM" />

      <h3>Sarima</h3>
      <p>Still working on this one, could make it interactive possibly</p>

      
      
    </>
  )
}

export default App
