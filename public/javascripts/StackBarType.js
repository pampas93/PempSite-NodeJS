window.onload=function(){

var margin = {
  top: 20,
  right: 160,
  bottom: 35,
  left: 30
};

var width = 960 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

var svg = d3.select(".GraphClass")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/* Data in strings like it would be if imported from a csv */

var data = JSON.parse(document.getElementById('data').innerHTML);

var items = JSON.parse(document.getElementById('axis').innerHTML);

var colorsDB = ["#b33040", "#d25c4d", "#f2b447", "#d9d574", "#de887c", "#b33040"];
var colors = [];
for(i=0;i<items.length; i++){
    colors.push(colorsDB[i]);
}

// Transpose the data into layers
var dataset = d3.layout.stack()(items.map(function(item) { 
  return data.map(function(d) { 
    var xT = Object.keys(d)[0];
     return {x: d[xT], y: +d[item]};
  });
}));


// Set x, y and colors
var x = d3.scale.ordinal()
  .domain(dataset[0].map(function(d) {
    return d.x;
  }))
  .rangeRoundBands([10, width - 10], 0.02);

var y = d3.scale.linear()
  .domain([0, d3.max(dataset, function(d) {
    return d3.max(d, function(d) {
      return d.y0 + d.y;
    });
  })])
  .range([height, 0]);

// Define and draw axes
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(5)
  .tickSize(-width, 0, 0)
  .tickFormat(function(d) {
    return d
  });

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")

svg.append("g")
  .style("font-size","14px")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("g")
  .style("font-size","20px")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);


// Create groups for each series, rects for each segment 
var groups = svg.selectAll("g.cost")
  .data(dataset)
  .enter().append("g")
  .attr("class", "cost")
  .style("fill", function(d, i) {
    return colors[i];
  });

var rect = groups.selectAll("rect")
  .data(function(d) { 
    return d;
  })
  .enter()
  .append("rect")
  .attr("x", function(d) {
    return x(d.x);
  })
  .attr("y", function(d) {
    return y(d.y0 + d.y);
  })
  .attr("height", function(d) {
    return y(d.y0) - y(d.y0 + d.y);
  })
  .attr("width", x.rangeBand())
  .on("mouseover", function() {
    tooltipTemp.style("display", null);
  })
  .on("mouseout", function() {
    tooltipTemp.style("display", "none");
  })
  .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 25;
    tooltipTemp.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    tooltipTemp.select("text").text(d.y);
  });

// Draw legend
var legend = svg.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(45," + i * 40 + ")"; });
 
legend.append("rect")
  .attr("x", width - 35)
  .attr("width", 35)
  .attr("height", 35)
  .style("fill", function(d, i) {return colors.slice()[i];});
 
legend.append("text")
  .attr("x", width + 5)
  .attr("y", 9)
  .attr("dy", ".35em")
  .attr("font-size", "14px")
  .attr("font-weight", "bold")
  .style("text-anchor", "start")
  .text(function(d, i) { 
  return items[i];
  });


// Prep the tooltipTemp bits, initial display is hidden
var tooltipTemp = svg.append("g")                       //var tooltip was overwritten by bootstrap.css; so changed it to tooltipTemp
  .attr("class", "tooltipTemp")
  .style("display", "none");

tooltipTemp.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltipTemp.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "14px")
  .attr("font-weight", "bold");

}