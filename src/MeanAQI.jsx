import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MeanAQI = () => {
  const svgRef = useRef();

  const data = [ // data from aqi visualization
    { variable: "Ahmedabad", mean_aqi: 452.122939 },
    { variable: "Aizawl", mean_aqi: 34.765766 },
    { variable: "Amaravati", mean_aqi: 95.299643 },
    { variable: "Armitsar", mean_aqi: 95.299643 },
    { variable: "Bangaluru", mean_aqi: 94.318325 },
    { variable: "Bhopal", mean_aqi: 132.827338 },
    { variable: "Brajrajnagar", mean_aqi: 150.280505 },
    { variable: "Chandigarh", mean_aqi: 96.498328 },
    { variable: "Chennai", mean_aqi: 114.502654 },
    { variable: "Coimbatore", mean_aqi: 73.023256 },
    { variable: "Delhi", mean_aqi: 259.487744 },
    { variable: "Ernakulam", mean_aqi: 92.359477 },
    { variable: "Gurugram", mean_aqi: 225.123882 },
    { variable: "Guwahati", mean_aqi: 140.111111 },
    { variable: "Hyderabad", mean_aqi: 109.207447 },
    { variable: "Jaipur", mean_aqi: 133.679159 },
    { variable: "Jorapokhar", mean_aqi: 159.251621 },
    { variable: "Kochi", mean_aqi: 104.284810 },
    { variable: "Kolkata", mean_aqi: 140.566313 },
    { variable: "Lucknow", mean_aqi: 217.973059 },
    { variable: "Mumbai", mean_aqi: 105.352258 },
    { variable: "Patna", mean_aqi: 240.782042 },
    { variable: "Shillong", mean_aqi: 53.795122 },
    { variable: "Talcher", mean_aqi: 172.886819 },
    { variable: "Thiruvananthapuram", mean_aqi: 75.878327 },
    { variable: "Visakhpatnam", mean_aqi: 117.269855 },
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 120, left: 60 };

    const sortedData = data.slice().sort((a, b) => b.mean_aqi - a.mean_aqi);

    const xScale = d3.scaleBand()
      .domain(sortedData.map(d => d.variable))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.mean_aqi)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.mean_aqi)])
      .range(["#ffffff", "#a13634"]);

    svg.attr("width", width).attr("height", height);

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

    // bars
    svg.selectAll("rect")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.variable))
      .attr("y", d => yScale(d.mean_aqi))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.mean_aqi))
      .attr("fill", d => colorScale(d.mean_aqi))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`<strong>${d.variable}</strong><br/>AQI: ${d.mean_aqi.toFixed(1)}`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    // axes
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("fill", "white");

    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "white");

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "white")
      .text("Mean AQI per City");

  }, []);

  return <svg ref={svgRef} />;
};

export default MeanAQI;
