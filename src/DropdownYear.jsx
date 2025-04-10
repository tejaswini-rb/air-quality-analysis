import React from "react";

const DropdownYear = ({ selectedYear, setSelectedYear }) => {
  const years = [2015, 2016, 2017, 2018, 2019];

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


export default DropdownYear;
