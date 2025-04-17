// src/StackedAreaChartCity.jsx
import { useEffect, useState } from "react";
import * as d3 from "d3";

const StackedAreaChartCity = ({
  selectedYear,
  selectedMonth,
  selectedCity,
}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!selectedYear || !selectedMonth || selectedCity == null) return;
    setData([]);

    d3.csv("/data/city_day.csv").then((rawData) => {
      const parseDate = d3.timeParse("%Y-%m-%d");
      const targetMonth = new Date(`${selectedMonth} 1, 2000`).getMonth();
      const grouped = {};

      rawData.forEach((d) => {
        if (selectedCity !== "All" && d.City !== selectedCity) return;

        const date = parseDate(d.Date);
        if (!date) return;
        if (
          date.getFullYear() === +selectedYear &&
          date.getMonth() === targetMonth
        ) {
          const key = d3.timeFormat("%Y-%m-%d")(date);
          if (!grouped[key]) {
            grouped[key] = {
              date,
              pm25: 0,
              pm10: 0,
              no2: 0,
              so2: 0,
              o3: 0,
              count: 0,
            };
          }
          grouped[key].pm25 += +d["PM2.5"] || 0;
          grouped[key].pm10 += +d.PM10 || 0;
          grouped[key].no2 += +d.NO2 || 0;
          grouped[key].so2 += +d.SO2 || 0;
          grouped[key].o3 += +d.O3 || 0;
          grouped[key].count++;
        }
      });

      const aggregated = Object.values(grouped)
        .map((v) => ({
          date: v.date,
          pm25: v.count ? v.pm25 / v.count : 0,
          pm10: v.count ? v.pm10 / v.count : 0,
          no2: v.count ? v.no2 / v.count : 0,
          so2: v.count ? v.so2 / v.count : 0,
          o3: v.count ? v.o3 / v.count : 0,
        }))
        .sort((a, b) => a.date - b.date);

      setData(aggregated);
    });
  }, [selectedYear, selectedMonth, selectedCity]);
  useEffect(() => {
    if (!data) return;
    const svg = d3
      .select("#stacked-area-chart-city")
      .attr("width", 600)
      .attr("height", 400);

    svg.selectAll("*").remove();
    d3.selectAll(".tooltip").remove();

    if (data.length === 0) {
      svg
        .append("text")
        .attr("x", 300)
        .attr("y", 200)
        .attr("text-anchor", "middle")
        .text("No data for selected filters");
      return;
    }

    const margin = { top: 20, right: 30, bottom: 30, left: 40 },
      width = +svg.attr("width"),
      height = +svg.attr("height");
    const keys = ["pm25", "pm10", "no2", "so2", "o3"];
    const stackData = d3.stack().keys(keys)(data);
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(stackData, (layer) => d3.max(layer, (d) => d[1]))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10);

    const areaGen = d3
      .area()
      .x((d) => x(d.data.date))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]));
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "rgba(0,0,0,0.7)")
      .style("color", "#fff")
      .style("padding", "6px 8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("opacity", 0);
    svg
      .selectAll("path")
      .data(stackData)
      .enter()
      .append("path")
      .attr("fill", (d) => color(d.key))
      .attr("d", areaGen)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", d3.color(color(d.key)).brighter(0.7));
        tooltip
          .style("opacity", 1)
          .html(`Pollutant: ${d.key}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 25 + "px");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 25 + "px");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", color(d.key));
        tooltip.style("opacity", 0);
      });
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));
    return () => {
      tooltip.remove();
    };
  }, [data]);

  return <svg id="stacked-area-chart-city"></svg>;
};

export default StackedAreaChartCity;
