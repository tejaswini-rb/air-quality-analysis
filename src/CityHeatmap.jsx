import { useEffect, useState } from "react";
import * as d3 from "d3";

const CityHeatmap = ({ selectedYear, selectedMonth }) => {
    console.log("CityHeatmap received:", selectedYear, selectedMonth);
    const [geoData, setGeoData] = useState(null);
    const [cityData, setCityData] = useState(null);

    useEffect(() => {
        // Load GeoJSON data
        d3.json("/india.geojson")
        .then((data) => {
            console.log("GeoJSON Data Loaded:", data);
            setGeoData(data);
        })
        .catch((error) => console.error("Error loading GeoJSON:", error));
    }, []);

    useEffect(() => {
        if (!geoData || !cityData) return; 
        
        const width = 550, height = 400;

        const projection = d3.geoMercator().fitSize([width, height], geoData);
        const pathGenerator = d3.geoPath().projection(projection);

        const svg = d3.select("#d3-container")
        .attr("width", width)
        .attr("height", height);

        svg.selectAll("*").remove(); 

    // Draw states
    svg.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("stroke", "#fff")
      .attr("fill","#316334")
      .attr("stroke-width", 0.5);

    // Draw cities
    const colorScale = d3.scaleThreshold()
      .domain([100, 150, 200, 300, 400])
      .range(["#ffffff", "#ffb3b3", "#ff6666", "#cc0000", "#660000"]);

    svg.selectAll("circle")
      .data(cityData)
      .enter()
      .append("circle")
      .attr("cx", (d) => projection([d.lon, d.lat])[0])
      .attr("cy", (d) => projection([d.lon, d.lat])[1])
      .attr("r", 6)
      .attr("fill", (d) => colorScale(d.avgAQI))
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", 2);

        d3.select("#tooltip")
          .style("visibility", "visible")
          .html(`<strong>${d.city}</strong><br/>AQI: ${Math.round(d.avgAQI)}`);
      })
      .on("mousemove", function (event) {
        d3.select("#tooltip")
          .style("top", (event.pageY - 40) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 0.5);
        d3.select("#tooltip").style("visibility", "hidden");
      });
  }, [geoData, cityData]);

  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;
    // get city =data
    d3.csv("/data/city_aqi_data.csv").then((data) => {
      const parseDate = d3.timeParse("%Y-%m-%d");

      // Hardcode year and month for now
      const targetYear = 2019;
      const targetMonth = new Date(`${selectedMonth} 1, 2015`).getMonth();

      // Filter & average AQI per city
      const cityAQIs = {};
      data.forEach((d) => {
        const date = parseDate(d.Date);
        if (!date || +d.AQI < 1) return;

        if (date.getFullYear() === +selectedYear && date.getMonth() === targetMonth) {
          const city = d.City;
          if (!cityAQIs[city]) {
            cityAQIs[city] = { sum: 0, count: 0, lat: +d.Latitude, lon: +d.Longitude };
          }
          cityAQIs[city].sum += +d.AQI;
          cityAQIs[city].count += 1;
        }
      });

      const averaged = Object.entries(cityAQIs).map(([city, val]) => ({
        city,
        avgAQI: val.sum / val.count,
        lat: val.lat,
        lon: val.lon,
      }));

      setCityData(averaged);
    });
  }, [selectedYear, selectedMonth]);

  return (
    <>
      <svg id="d3-container" />
      <div
        id="tooltip"
        style={{
            position: "absolute",
            visibility: "hidden",
            backgroundColor: "#fff",
            color: "#000", 
            border: "1px solid #333",
            padding: "6px 8px",
            borderRadius: "4px",
            pointerEvents: "none",
            fontSize: "13px",
            fontWeight: "bold", 
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 10,
            whiteSpace: "nowrap", 
        }}
      />
    </>
  );
};

export default CityHeatmap;
