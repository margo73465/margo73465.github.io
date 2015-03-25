var data; // a global
var grid_width = document.getElementById("grid").offsetWidth;
var marginal_width = document.getElementById("marginal").offsetWidth;
var num_days = 5;
var num_times = 16;
// var size_x = 120;
// var size_y = 80;
var pad = 5;
var text_top = 20;
var text_left = 50;
var size_x = (grid_width - pad - text_left) / num_days - pad;
var size_y = size_x > 75? 75 : size_x;
var height = num_times*(size_y+pad) + pad + text_top;

console.log(grid_width);
console.log(size_x);
console.log(height);
// var w = num_days*(size_x+pad) + pad + text_left;

d3.json("productivity3.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;
  visualizeit(data);
});

d3.json("marginal.json", function(error, marginalJson) {
  if(error) return console.warn(error);
  marginal = marginalJson;
  marginalGraph(marginal);
});

function visualizeit(data){
  
  var svgContainer = d3.select("#grid").append("svg")
            .attr("width", grid_width)
            .attr("height", height)
            .attr("id","productivity_fig");
        //  .attr("align","center");
        //  .style("border", "1px solid black");
  
  var dayOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  var time = ["10:30","11:00","11:30","12:00","12:30","1:00","1:30","2:00",
              "2:30","3:00","3:30","4:00","4:30","5:00","5:30","6:00"];
              // "6:30","7:00","7:30","8:00","8:30","9:00"];
  console.log(time.length);
  
  for(var j=0; j<5; j++){
    var dayGroup = svgContainer.append("g");
    var timeLabels = svgContainer.selectAll("text")
      .data(data[dayOfWeek[j]])
      .enter()
      .append("text")
      .text(function(d,i){ return time[i]; })
      .attr("x", pad + text_left/2)
      .attr("y",function(d,i){ return (size_y+pad)*i + pad + text_top + size_y/2; });
    var dayLabels = svgContainer.append("text")
      .text(dayOfWeek[j])
      .attr("x", (size_x+pad)*j + pad + size_x/2 + text_left)
      .attr("y", text_top-pad);
    var squares = dayGroup.selectAll("rect")
      .data(data[dayOfWeek[j]])
      .enter()
      .append("rect")
      .attr("x",(size_x+pad)*j + pad + text_left)
      .attr("y",function(d,i){ return (size_y+pad)*i + pad + text_top; })
      .attr("height", size_y)
      .attr("width", size_x)
      .attr("fill", "blue")
      //.attr("fill", function(d) { return "rgb(" + (d*300) + ",0,0)"; });
      .attr("fill", function(d) { return "rgba(0,100,0," + (d/3) + ")"; });
      //.style("fill", function(d) { return z(d); });
  }
}

function marginalGraph(marginal){
  var time = marginal.time;
  var maximum = Math.max.apply(null,time);
  var minimum = Math.min.apply(null,time);
  // console.log(maximum);
  var lineData = [];
  for(var i = 0; i < 16; i++){
    lineData[i] = {x:(time[i]-minimum)/(maximum-minimum)*marginal_width, y:i*(size_y + pad) + text_top + pad + size_y/2};
    //console.log(lineData[i]);
  }  
  
  var svgContainer = d3.select("#marginal").append("svg")
    .attr("width", marginal_width)
    .attr("height", height);      
  
  var areaFunction = d3.svg.area()
    .x1(function(d) { return d.x; })
    .x0(0)
    .y(function(d) { return d.y; });
  var lineFunction = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");  
  var area = svgContainer.append("path")
    .attr("d", areaFunction(lineData))
    .attr("fill","rgba(0,0,100,0.20");
  var line = svgContainer.append("path")
    .attr("d", lineFunction(lineData))
    .attr("stroke", "rgba(0,0,100,1)")
    .attr("stroke-width", 2)
    .attr("fill","none");
}  
