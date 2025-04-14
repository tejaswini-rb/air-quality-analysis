import { useEffect, useState } from "react";
import * as d3 from "d3";

const StackedAreaChart = ({ selectedYear, selectedMonth }) => {
  console.log("StackedAreaChart mounted with:", selectedYear, selectedMonth);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("StackedAreaChart useEffect for CSV fetch triggered.");
    if (!selectedYear || !selectedMonth) {
      console.log("Missing selectedYear or selectedMonth");
      return;
    }
    d3.csv("/data/data_pollutants.csv")
      .then((rawData) => {
        console.log("CSV loaded. Number of rows:", rawData.length);
        const parseDate = d3.timeParse("%Y-%m-%d");
        const targetMonth = new Date(`${selectedMonth} 1, 2000`).getMonth();
        console.log("Target month (number):", targetMonth);

        rawData.slice(0, 5).forEach((d, i) => {
          console.log(`Sample row ${i}:`, d);
        });

        const grouped = {};

        rawData.forEach((d) => {
          const date = parseDate(d.date);
          if (!date) {
            console.warn("Invalid date format in row:", d);
            return;
          }
          if (date.getFullYear() === +selectedYear && date.getMonth() === targetMonth) {
            const dateKey = d3.timeFormat("%Y-%m-%d")(date);
            if (!grouped[dateKey]) {
              grouped[dateKey] = {
                date,
                so2: 0,
                no2: 0,
                rspm: 0,
                spm: 0,
                pm2_5: 0,
                count: 0,
              };
            }
            grouped[dateKey].so2 += +d.so2 || 0;
            grouped[dateKey].no2 += +d.no2 || 0;
            grouped[dateKey].rspm += +d.rspm || 0;
            grouped[dateKey].spm += +d.spm || 0;
            grouped[dateKey].pm2_5 += +d.pm2_5 || 0;
            grouped[dateKey].count++;
          }
        });

        const aggregatedData = Object.values(grouped).map((val) => ({
          date: val.date,
          so2: val.count > 0 ? val.so2 / val.count : 0,
          no2: val.count > 0 ? val.no2 / val.count : 0,
          rspm: val.count > 0 ? val.rspm / val.count : 0,
          spm: val.count > 0 ? val.spm / val.count : 0,
          pm2_5: val.count > 0 ? val.pm2_5 / val.count : 0,
        }));

        aggregatedData.sort((a, b) => a.date - b.date);
        console.log("Aggregated Data:", aggregatedData);
        setData(aggregatedData);
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
      });
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (!data) return;

    console.log("StackedAreaChart drawing chart with data:", data);
    const svg = d3.select("#stacked-area-chart");
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

    const keys = ["so2", "no2", "rspm", "spm", "pm2_5"];
    const stackedData = d3.stack().keys(keys)(data);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1]))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeCategory10);

    const areaGen = d3.area()
      .x((d) => xScale(d.data.date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    svg.selectAll("path")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("fill", (d) => color(d.key))
      .attr("d", areaGen)
      .append("title")
      .text((d) => d.key);

    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5));

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));
  }, [data]);

  return <svg id="stacked-area-chart"></svg>;
};

export default StackedAreaChart;