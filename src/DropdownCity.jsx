import React from "react";

const DropdownCity = ({ selectedCity, setSelectedCity }) => {
  const cities = [
    "All",
    "Ahmedabad",
    "Aizawl",
    "Amaravati",
    "Amritsar",
    "Bengaluru",
    "Bhopal",
    "Brajrajnagar",
    "Chandigarh",
    "Chennai",
    "Coimbatore",
    "Delhi",
    "Ernakulam",
    "Gurugram",
    "Guwahati",
    "Hyderabad",
    "Jaipur",
    "Jorapokhar",
    "Kochi",
    "Kolkata",
    "Lucknow",
    "Mumbai",
    "Patna",
    "Shillong",
    "Talcher",
    "Thiruvananthapuram",
    "Visakhapatnam",
  ];

  return (
    <div className="dropdown">
      <label className="dropdown-label" htmlFor="city-select">
        City:
      </label>
      <select
        id="city-select"
        className="dropdown-select"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownCity;
