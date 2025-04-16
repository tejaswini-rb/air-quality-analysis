import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const ARIMA = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("data/forecast_results.csv").then((raw) => {
      const parsed = raw.map((d) => ({
        date: new Date(d.Date),
        aqi: +d.ARIMA,
      }));
      console.log(parsed);
      setData(parsed);
    });
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.aqi)])
      .nice()
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.aqi));

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%b %d")));

    g.append("g").call(d3.axisLeft(y));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ff7f0e")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg.append("text")
      .attr("x", (width + margin.left + margin.right) / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .attr("fill", "#ffffff")
      .text("Vanilla ARIMA Prediction Model for Amaravati July 2020");

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ARIMA;
