import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CorrelationHeatmap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 500; // hard code everything for now, will need to use actual data
    const height = 500;
    const margin = 50;
    const numRows = 5; 
    const numCols = 5;

    // hardcoded from imageo on google doc - will need to use json reader to convert from python output 
    const data = [
      [1, 0.34, 0.17, 0.15, 0.36],
      [0.34, 1, 0.37, 0.33, 0.51],
      [0.17, 0.37, 1, 0.8, 0.75],
      [0.15, 0.33, 0.8, 1, 0.75],
      [0.36, 0.51, 0.75, 0.75, 1],
    ];

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const colorScale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(["yellow", "white", "darkred"]);

    const cellSize = (width - margin) / numCols;

    data.forEach((row, i) => {
      row.forEach((value, j) => {
        svg.append("rect")
          .attr("x", j * cellSize + margin)
          .attr("y", i * cellSize + margin)
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("fill", colorScale(value))
          .attr("stroke", "black");


        svg.append("text")
          .attr("x", j * cellSize + margin + cellSize / 2)
          .attr("y", i * cellSize + margin + cellSize / 2)
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .text(value.toFixed(2))
          .attr("fill", "black");
      });
    });

  }, []);

  return (
    <div>
      <h3>Correlation Heatmap</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CorrelationHeatmap;
