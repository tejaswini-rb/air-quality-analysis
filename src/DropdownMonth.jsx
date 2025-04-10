import React from "react";

const DropdownMonth = ({ selectedMonth, setSelectedMonth }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; // hard coded for now 

  return (
    <div>
      <label htmlFor="month-select">Select Month: </label>
      <select
        id="month-select"
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
