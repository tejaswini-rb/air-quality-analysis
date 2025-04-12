import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const AQICorrelationHeatmap = () => {
  const svgRef = useRef();

  const data = [
    { variable: "PM2.5", correlation: 0.924 },
    { variable: "PM10", correlation: 0.917 },
    { variable: "NOx", correlation: 0.658 },
    { variable: "NO", correlation: 0.622 },
    { variable: "NH3", correlation: 0.590 },
    { variable: "NO2", correlation: 0.576 },
    { variable: "CO", correlation: 0.495 },
    { variable: "Toluene", correlation: 0.466 },
    { variable: "O3", correlation: 0.335 },
    { variable: "SO2", correlation: 0.255 },
    { variable: "Benzene", correlation: 0.208 },
    { variable: "Xylene", correlation: 0.074 },
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 30, left: 150 };
    const cellHeight = 30;

    const colorScale = d3.scaleLinear()
      .domain([0, 1])
      .range(["#ffffff", "#a13634"]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.variable))
      .range([margin.top, margin.top + cellHeight * data.length])
      .padding(0.1);

    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([margin.left, width - margin.right]);

    svg.attr("width", width).attr("height", height);

    // Tooltip div
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "#333")
      .style("color", "white")
      .style("padding", "6px 10px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Heatmap bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => yScale(d.variable))
      .attr("width", d => xScale(d.correlation) - margin.left)
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.correlation))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`<strong>${d.variable}</strong><br/>${(d.correlation * 100).toFixed(1)}%`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    // Labels
    svg.selectAll("text.label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 10)
      .attr("y", d => yScale(d.variable) + yScale.bandwidth() / 2)
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .style("font-size", "13px")
      .text(d => d.variable);

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "white")
      .text("Predictor Correlations with AQI");

  }, []);

  return <svg ref={svgRef}/>;
};

export default AQICorrelationHeatmap;
