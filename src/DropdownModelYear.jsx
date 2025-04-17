import React from "react";

const DropdownModelYear = ({ selectedModelYear, setSelectedModelYear }) => {
  const options = ["July 2020", "Nov-Dec 2019"];
  return (
    <div className="dropdown">
      <label className="dropdown-label" htmlFor="model-year-select">
        Select Period:
      </label>
      <select
        id="model-year-select"
        className="dropdown-select"
        value={selectedModelYear}
        onChange={(e) => setSelectedModelYear(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownModelYear;
