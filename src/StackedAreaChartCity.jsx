import { useEffect, useState } from "react";
import * as d3 from "d3";

const StackedAreaChartCity = ({ selectedYear, selectedMonth }) => {
  console.log("StackedAreaChartCity mounted with:", selectedYear, selectedMonth);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("StackedAreaChartCity useEffect for CSV fetch triggered.");
    if (!selectedYear || !selectedMonth) {
      console.log("Missing selectedYear or selectedMonth");
      return;
    }

    // Load the CSV from public/data/city_day.csv
    d3.csv("/data/city_day.csv")
      .then(function(rawData) {
        console.log("City CSV loaded. Number of rows:", rawData.length);
        const parseDate = d3.timeParse("%Y-%m-%d");
        const targetMonth = new Date(`${selectedMonth} 1, 2000`).getMonth();
        console.log("Target month (number):", targetMonth);
        const grouped = {};

        rawData.forEach(function(d) {
          const date = parseDate(d.Date);
          if (!date) {
            console.warn("Invalid date format in row:", d);
            return;
          }
          if (date.getFullYear() === +selectedYear && date.getMonth() === targetMonth) {
            const dateKey = d3.timeFormat("%Y-%m-%d")(date);
            if (!grouped[dateKey]) {
              grouped[dateKey] = {
                date: date,
                pm25: 0,
                pm10: 0,
                no2: 0,
                so2: 0,
                o3: 0,
                count: 0,
              };
            }
            grouped[dateKey].pm25 += +d["PM2.5"] || 0;
            grouped[dateKey].pm10 += +d["PM10"] || 0;
            grouped[dateKey].no2  += +d["NO2"]  || 0;
            grouped[dateKey].so2  += +d["SO2"]  || 0;
            grouped[dateKey].o3   += +d["O3"]   || 0;
            grouped[dateKey].count++;
          }
        });

        const aggregatedData = Object.values(grouped).map(function(val) {
          return {
            date: val.date,
            pm25: val.count > 0 ? val.pm25 / val.count : 0,
            pm10: val.count > 0 ? val.pm10 / val.count : 0,
            no2:  val.count > 0 ? val.no2  / val.count : 0,
            so2:  val.count > 0 ? val.so2  / val.count : 0,
            o3:   val.count > 0 ? val.o3   / val.count : 0,
          };
        });

        aggregatedData.sort(function(a, b) { return a.date - b.date; });
        console.log("Aggregated City Data:", aggregatedData);
        setData(aggregatedData);
      })
      .catch(function(error) {
        console.error("Error loading City CSV:", error);
      });
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (!data) return;
    const svg = d3.select("#stacked-area-chart-city");
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    svg.attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    if (data.length === 0) {
      svg.append("text")
         .attr("x", width / 2)
         .attr("y", height / 2)
         .attr("text-anchor", "middle")
         .text("No data available for the selected filters");
      return;
    }

    // Set up keys and stack
    const keys = ["pm25", "pm10", "no2", "so2", "o3"];
    const stackedData = d3.stack().keys(keys)(data);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData, layer => d3.max(layer, d => d[1]))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeCategory10);
    const areaGen = d3.area()
      .x(d => xScale(d.data.date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("font-size", "11px")
      .style("padding", "6px 8px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)");

    svg.selectAll("path")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("fill", d => color(d.key))
      .attr("d", areaGen)
      // Mouse events for interactivity
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("fill", d3.color(color(d.key)).brighter(0.7));
        tooltip
          .style("opacity", 1)
          .html(`Pollutant: ${d.key}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("fill", color(d.key));
        tooltip
          .style("opacity", 0);
      });

    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5));
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return <svg id="stacked-area-chart-city"></svg>;
};

export default StackedAreaChartCity;
