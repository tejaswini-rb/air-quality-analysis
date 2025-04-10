import { useEffect, useState } from "react";
import * as d3 from "d3";

const D3Chart = () => {
  const [geoData, setGeoData] = useState(null);

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
    if (!geoData) return;

    console.log("Rendering Map");

    const width = 600, height = 500;

    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const pathGenerator = d3.geoPath().projection(projection);

    const svg = d3.select("#d3-container")
      .attr("width", width)
      .attr("height", height);

    // Draw states
    svg.selectAll("path").remove();
    svg.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .on("mouseover", function () {
        d3.select(this).attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 0.5);
      });

  }, [geoData]);

  return <svg id="d3-container" style={{ border: "1px solid black" }} />;
};

export default D3Chart;
