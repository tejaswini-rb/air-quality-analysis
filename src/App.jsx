import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import D3Chart from "./D3chart";
import DropdownYear from "./DropdownYear";
import DropdownMonth from "./DropdownMonth";
import CorrelationHeatmap from "./CorrelationHeatmap";
import AQILineChart from "./aqi_line";
import CityHeatmap from "./CityHeatmap";
import MeanAQI from "./MeanAQI";
import StackedAreaChartCity from "./StackedAreaChartCity.jsx";
import LinReg from './LinReg';
import HistoricalAQI from './historical_aqi';
import ARIMA from './Arima';
import XGBoost from './XGBoost';
import SARIMA from './Sarima';
import RandomForest from './RandomForest';

function App() {
  const [selectedYear, setSelectedYear] = useState(2015);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYearCity, setSelectedYearCity] = useState(2015);
  const [selectedMonthCity, setSelectedMonthCity] = useState("January");
  const [activeSection, setActiveSection] = useState("Statistical Analysis");

  return (
    <>
      <div className="header">
        <h1>Analyzing and Forecasting Air Quality in India</h1>
        <div className="nav-buttons">
          <button onClick={() => setActiveSection("Statistical Analysis")}>
            Statistical Analysis
          </button>
          <button onClick={() => setActiveSection("Models")}>Models</button>
          <button onClick={() => setActiveSection("About")}>About</button>
        </div>
      </div>

      <div className="main-content">
        {activeSection === "Statistical Analysis" && (
          <div>
            <h2>Statistical Analysis</h2>

            <h3>Overall Trends</h3>
            <div
              style={{
                display: "flex",
                gap: "2rem",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <div>
                <CorrelationHeatmap />
              </div>
              <div>
                <MeanAQI />
              </div>
            </div>

            <h3>Monthly Trends</h3>
            <p>
              Update the year in the dropdown and interact with the heat map for
              more information.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <DropdownYear
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
              <DropdownMonth
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
            <h4>
              AQI Trends by Area Classification - {selectedMonth},{" "}
              {selectedYear}
            </h4>
            <CityHeatmap
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
            <AQILineChart
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />

            <h3>Pollutant Stacked Area Chart</h3>
            <p>
              Daily aggregated air quality data for the selected month and year.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <DropdownYear
                  selectedYear={selectedYearCity}
                  setSelectedYear={setSelectedYearCity}
                />
                <DropdownMonth
                  selectedMonth={selectedMonthCity}
                  setSelectedMonth={setSelectedMonthCity}
                />
              </div>
              <StackedAreaChartCity
                selectedYear={selectedYearCity}
                selectedMonth={selectedMonthCity}
              />
            </div>
          </div>
        )}

        {activeSection === "Models" && (
          <div>
            <h2>Models</h2>
            <p>
              We used various methods in order to attempt forecasting air
              quality. The results of each of the methods are shown below.
            </p>
            
      <p>The following image is of historical AQI data for the city of Amaravati from December 2019 to July 2020</p>
      
      <HistoricalAQI />
      
      <p>Each of the following approaches were used to predict the last month of data (July 2020)</p>
      <h3>ARIMA Model</h3>
      <ARIMA />

      <h3>ARIMAX</h3>
      <SARIMA />

      <h3>Linear Regression</h3>
      <LinReg />
      <h3>XGBoost</h3>
      <XGBoost />

            
      

      <h3>Random Forest</h3>
      <RandomForest />

            <h2>Area Classifications</h2>
      <p>We also explored factoring in the area classification (Urban, Suburban, Rural) into the prediction models:</p>


      <h3>Urban: Bengaluru</h3>
      <img src="/bengaluru.png" alt="Linear Regression" />

      <h3>Subrban: Amaravati</h3>
      <img src="/amaravati.png" alt="Linear Regression" />

      
      
      <h3>Rural: Shillong</h3>
      <img src="/shillong.png" alt="Linear Regression" />
          </div>
        )}

        {activeSection === "About" && (
          <div>
            <h2>About</h2>
            <p>
              Our project approaches this problem through two main areas of
              focus. We have studied both statistical analysis of air quality
              data to identify trends across different factors, as well as
              forecasting future air quality based on current data.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
