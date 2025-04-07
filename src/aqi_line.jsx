import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const AQILineChart = ({ selectedYear, selectedState }) => {
  const svgRef = useRef();

  // hard coding data for now - AQi 
  const dummyData = {
    "Karnataka": {
      "2022": {
        rural: [80, 85, 82, 75, 70, 72, 74, 76, 79, 85, 87, 90],
        urban: [110, 120, 115, 108, 100, 102, 105, 107, 109, 115, 120, 125],
        suburban: [95, 100, 98, 92, 88, 90, 92, 93, 94, 97, 100, 102]
      }

    }
  };

  useEffect(() => {
    // comment this out once we get actual data
    selectedState = "Karnataka"
    selectedYear = "2022"
    const data = dummyData[selectedState]?.[selectedYear];
    if (!data) return;

    const months = d3.range(12).map(i => new Date(2022, i, 1));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 50 };

    const xScale = d3.scaleTime()
      .domain(d3.extent(months))
      .range([margin.left, width - margin.right]);

    const yMax = d3.max([
      ...data.rural,
      ...data.urban,
      ...data.suburban
    ]);
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x((d, i) => xScale(months[i]))
      .y(d => yScale(d));

    const colors = {
      rural: "#1f77b4",
      urban: "#ff7f0e",
      suburban: "#2ca02c"
    };

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(12).tickFormat(d3.timeFormat("%b")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    ["rural", "urban", "suburban"].forEach((type) => {
      svg.append("path")
        .datum(data[type])
        .attr("fill", "none")
        .attr("stroke", colors[type])
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add labels
      svg.append("text")
        .attr("x", width - margin.right)
        .attr("y", yScale(data[type][11]))
        .attr("dy", "-0.5em")
        .attr("text-anchor", "end")
        .attr("fill", colors[type])
        .style("font-size", "12px")
        .text(type);
    });
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`AQI Trends in ${selectedState} (${selectedYear})`);

  }, [selectedState, selectedYear]);

  return (
    <svg ref={svgRef} width={600} height={400}></svg>
  );
};

export default AQILineChart;
