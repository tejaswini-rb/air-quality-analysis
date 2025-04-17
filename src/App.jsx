import { useState } from "react";
import "./App.css";
import DropdownYear from "./DropdownYear";
import DropdownMonth from "./DropdownMonth";
import DropdownCity from "./DropdownCity";
import DropdownModelYear from "./DropdownModelYear";
import CorrelationHeatmap from "./CorrelationHeatmap";
import AQILineChart from "./aqi_line";
import CityHeatmap from "./CityHeatmap";
import MeanAQI from "./MeanAQI";
import StackedAreaChartCity from "./StackedAreaChartCity.jsx";

import LinReg from "./LinReg";
import HistoricalAQI from "./historical_aqi";
import ARIMA from "./Arima";
import XGBoost from "./XGBoost";
import SARIMA from "./Sarima";
import RandomForest from "./RandomForest";

function App() {
  const [selectedYearCity, setSelectedYearCity] = useState(2015);
  const [selectedMonthCity, setSelectedMonthCity] = useState("January");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedYear, setSelectedYear] = useState(2015);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [activeSection, setActiveSection] = useState("Statistical Analysis");
  const [selectedModelYear, setSelectedModelYear] = useState("July 2020");

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
              style={{ display: "flex", gap: "2rem", justifyContent: "center" }}
            >
              <CorrelationHeatmap />
              <MeanAQI />
            </div>

            <h3>Monthly Trends</h3>
            <p>
              Update the year in the dropdown and interact with the heat map for
              more information.
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
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
              AQI Trends by Area Classification – {selectedMonth},{" "}
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
              Daily aggregated air quality data for the selected month, year,
              and city (or all cities).
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <DropdownYear
                selectedYear={selectedYearCity}
                setSelectedYear={setSelectedYearCity}
              />
              <DropdownMonth
                selectedMonth={selectedMonthCity}
                setSelectedMonth={setSelectedMonthCity}
              />
              <DropdownCity
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
              />
            </div>
            <StackedAreaChartCity
              selectedYear={selectedYearCity}
              selectedMonth={selectedMonthCity}
              selectedCity={selectedCity}
            />
          </div>
        )}

        {activeSection === "Models" && (
          <div>
            <DropdownModelYear
              selectedModelYear={selectedModelYear}
              setSelectedModelYear={setSelectedModelYear}
            />

            {selectedModelYear === "July 2020" ? (
              <>
                <h2>Forecasted AQI for July 2020</h2>
                <p>
                  We used various methods in order to attempt forecasting air
                  quality.
                </p>
                <p>
                  The following image is of historical AQI data for Amaravati
                  (Dec 2019–Jul 2020):
                </p>
                <HistoricalAQI />

                <p>
                  Each approach was used to predict the last month of data
                  (July 2020):
                </p>
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
              </>
            ) : (
              <>
                <h2>Forecasted AQI for November to December 2019</h2>
                <p>
                  We also explored AQI forecasting using ARIMA (Model 1) and
                  ARIMAX in 2019.
                </p>
                <h3>Urban: Bengaluru</h3>
                <img
                  src="/bengaluru.png"
                  alt="Bengaluru"
                  style={{ width: "75%", height: "auto" }}
                />

                <h3>Suburban: Amaravati</h3>
                <img
                  src="/amaravati.png"
                  alt="Amaravati"
                  style={{ width: "75%", height: "auto" }}
                />

                <h3>Rural: Shillong</h3>
                <img
                  src="/shillong.png"
                  alt="Shillong"
                  style={{ width: "75%", height: "auto" }}
                />
              </>
            )}
          </div>
        )}

        {activeSection === "About" && (
          <div className="about-section">
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
