import React from "react";

const DropdownMonth = ({ selectedMonth, setSelectedMonth }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="dropdown">
      <label className="dropdown-label" htmlFor="month-select">
        Month:
      </label>
      <select
        id="month-select"
        className="dropdown-select"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMonth;
