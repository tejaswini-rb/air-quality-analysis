import React from "react";

const Dropdown = ({ selectedYear, setSelectedYear }) => {
  const years = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]; // hard coded for now 

  return (
    <div>
      <label htmlFor="year-select">Select Year: </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
