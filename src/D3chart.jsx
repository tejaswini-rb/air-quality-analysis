import { useEffect, useState } from "react";
import * as d3 from "d3";

const D3Chart = () => {
  const [geoData, setGeoData] = useState(null);
  const [aqiData, setAqiData] = useState(null);

  useEffect(() => {
    // Load GeoJSON data
    d3.json("/india.geojson")
      .then((data) => {
        console.log("GeoJSON Data Loaded:", data);
        setGeoData(data);
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));

    // Load AQI CSV data
    d3.csv("/india_aqi_dummy.csv")
      .then((data) => {
        console.log("Raw AQI CSV Data:", data);
        const formattedData = data.reduce((acc, d) => {
          acc[d.State] = +d.AQI; // Convert AQI to a number
          return acc;
        }, {});
        console.log("Formatted AQI Data:", formattedData);
        setAqiData(formattedData);
      })
      .catch((error) => console.error("Error loading AQI CSV:", error));
  }, []);

  useEffect(() => {
    if (!geoData || !aqiData) return;

    console.log("Rendering Map with AQI Data:", aqiData);

    const width = 600, height = 500;

    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const pathGenerator = d3.geoPath().projection(projection);

    const svg = d3.select("#d3-container")
      .attr("width", width)
      .attr("height", height);

    // Define color scale (White to Dark Red)
    const colorScale = d3.scaleThreshold()
      .domain([100, 150, 200, 300, 400])
      .range(["#ffffff", "#ffb3b3", "#ff6666", "#cc0000", "#660000"]);

    // Draw states
    svg.selectAll("path").remove();
    svg.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("fill", (d) => {
        const stateName = d.properties.st_nm;
        const aqi = aqiData[stateName] || 50; // Default AQI if missing
        console.log(`State: ${stateName}, AQI: ${aqi}`); // Debugging each state's AQI
        return colorScale(aqi);
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .on("mouseover", function () {
        d3.select(this).attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 0.5);
      });

  }, [geoData, aqiData]);

  return <svg id="d3-container" style={{ border: "1px solid black" }} />;
};

export default D3Chart;
