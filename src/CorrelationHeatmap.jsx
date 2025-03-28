import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CorrelationHeatmap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 500; // hard coded for now
    const height = 500;
    const margin = 50;
    const numRows = 5; 
    const numCols = 5;

    // Hardcoded data; update as needed later
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
      .attr("height", height)
      .style("font-family", "Oswald, sans-serif"); // Set Oswald font on the SVG container

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
          .attr("font-family", "Oswald, sans-serif")
          .text(value.toFixed(2))
          .attr("fill", "black");
      });
    });
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: "center", fontSize: "2em", marginBottom: "1em", marginLeft: "1.5em"}}>
        Correlation Heatmap
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CorrelationHeatmap;
