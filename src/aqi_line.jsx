import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const AQILineChart = ({ selectedYear, selectedMonth }) => {
  console.log("AQL LIne received:", selectedYear, selectedMonth);
  const svgRef = useRef();
  const [aqiData, setAqiData] = useState(null);

  useEffect(() => {
    d3.csv("/data/city_aqi_data.csv", d => {
      const date = new Date(d.Date);
      return {
        ...d,
        Date: date,
        Month: date.getMonth(),
        Year: date.getFullYear(),
        AQI: +d.AQI,
      };
    }).then(data => {
      setAqiData(data);
    });
  }, []);

  useEffect(() => {
    if (!aqiData) return;

    const monthIndex = new Date(`${selectedMonth} 1, 2022`).getMonth();

    const filteredData = aqiData.filter(
      d =>
        d.Year === +selectedYear &&
        d.Month === monthIndex &&
        !isNaN(d.AQI) &&
        ["rural", "urban", "suburban"].includes(d.Area_Classification?.toLowerCase())
    );


    const grouped = d3.groups(filteredData, d => d.Area_Classification.toLowerCase(), d => d.Date.toISOString().split("T")[0]);

    const dailyAverages = {
      rural: [],
      urban: [],
      suburban: []
    };

    grouped.forEach(([area, dates]) => {
      const values = dates.map(([dateStr, entries]) => ({
        date: new Date(dateStr),
        avgAQI: d3.mean(entries, d => d.AQI)
      })).sort((a, b) => a.date - b.date);

      dailyAverages[area] = values;
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 50 };

    const allDates = [
      ...dailyAverages.rural,
      ...dailyAverages.urban,
      ...dailyAverages.suburban
    ].map(d => d.date);

    const allAQIs = [
      ...dailyAverages.rural,
      ...dailyAverages.urban,
      ...dailyAverages.suburban
    ].map(d => d.avgAQI);

    if (allDates.length === 0 || allAQIs.length === 0) {
      return;
    }

    const xScale = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(allAQIs)])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.avgAQI));

    const colors = {
      rural: "#1f77b4",
      urban: "#660000",
      suburban: "#ff7f0e"
    };

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat("%d")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    ["rural", "urban", "suburban"].forEach((type) => {
      const data = dailyAverages[type];
      if (data.length === 0) return;

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colors[type])
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .attr("fill", "white")

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width / 2 - 100}, ${height - 30})`);

    ["rural", "urban", "suburban"].forEach((type, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(${i * 100}, 0)`);

      legendRow.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", colors[type]);

      legendRow.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(type.charAt(0).toUpperCase() + type.slice(1));
    });

  }, [aqiData, selectedMonth, selectedYear]);

  return (
    <svg ref={svgRef} width={700} height={400}></svg>
  );
};

export default AQILineChart;
