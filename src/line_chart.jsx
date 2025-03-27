import { useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ selectedYear, selectedState }) => {
  useEffect(() => {
    // Dummy AQI data (Replace with actual CSV data)
    const data = [
      { month: "Jan", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Feb", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Mar", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Apr", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "May", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Jun", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Jul", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Aug", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Sep", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Oct", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Nov", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
      { month: "Dec", Rural: Math.random() * 100, Urban: Math.random() * 150, Industrial: Math.random() * 200 },
    ];

    const width = 500, height = 300, margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const svg = d3.select("#line-chart")
      .attr("width", width)
      .attr("height", height)
      .selectAll("*").remove();

    const xScale = d3.scalePoint()
      .domain(data.map(d => d.month))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.Rural, d.Urban, d.Industrial))])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => xScale(d.month))
      .y(d => yScale(d.Rural));

    const svgContainer = d3.select("#line-chart").append("g");

    // Draw lines for Rural, Urban, and Industrial
    ["Rural", "Urban", "Industrial"].forEach((type, index) => {
      svgContainer.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", index === 0 ? "#1f77b4" : index === 1 ? "#ff7f0e" : "#2ca02c")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(d => xScale(d.month))
          .y(d => yScale(d[type]))
        );
    });

    // Axes
    svgContainer.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svgContainer.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

  }, [selectedYear, selectedState]);

  return <svg id="line-chart"></svg>;
};

export default LineChart;
