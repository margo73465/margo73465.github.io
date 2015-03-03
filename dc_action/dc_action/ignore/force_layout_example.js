
function updateMap(js) {
  var tproj = d3.geo.equirectangular().scale(1).translate([0,0]),
    bounds0 = d3.geo.bounds(js),
    bounds = bounds0.map(tproj),
    xscale = (width-2*margin-clistw)/
      Math.abs(bounds[1][0] - bounds[0][0]),
    yscale = (height-5*margin)/
      Math.abs(bounds[1][1] - bounds[0][1]),
    pscale = Math.min(xscale, yscale);

  if(map.selectAll("path").empty()) {
    if(xscale > yscale) {
      // center horizontally
      var d = xscale * Math.abs(bounds[1][0] - bounds[0][0]) -
        yscale * Math.abs(bounds[1][0] - bounds[0][0]);
      map.attr("transform", "translate(" + d/2 + ", 0)");
    } else {
      var d = yscale * Math.abs(bounds[1][1] - bounds[0][1]) -
        xscale * Math.abs(bounds[1][1] - bounds[0][1]);
      map.attr("transform", "translate(0, " + d/5 + ")");
    }
    wscale = pscale;
    proj.scale(pscale);
    proj.translate(proj([-bounds0[0][0], -bounds0[1][1]]));
    map.selectAll("path")
      .data(js.features).enter()
      .append("svg:path")
      .attr("fill", "none")
      .attr("d", path);
  } else {
    label.selectAll("text").remove();
    label.append("svg:text")
      .attr("y", -10)
      .classed("label", true)
      .text(js.p.n + ": " + Math.round(js.p.d * 1000)/10 +
          "% of GDP per capita is income");
    map.selectAll("path")
      .attr("fill", "none")
      .attr("stroke-width", 1);
    map.selectAll("path").data([js], function(d) { return d.p.n; })
      .attr("fill", cscale(js.p.d))
      .attr("stroke-width", 2);
    proj.scale(Math.min(wscale*5, pscale));
    tproj.scale(Math.min(wscale*5, pscale));
    var off = tproj([-bounds0[0][0], -bounds0[1][1]]),
      other = tproj([-bounds0[1][0], -bounds0[0][1]]),
      len = [off[0] - other[0], off[1] - other[1]],
      dx = off[0] + (width - clistw - 2*margin)/2 - len[0]/2,
      dy = off[1] + (height - 7.5*margin)/2 - len[1]/2;
    proj.translate([dx, dy]);
    map.selectAll("path")
      .transition().duration(1000)
      .attr("d", path);
  }
}

var margin = 25,
  width = window.innerWidth - margin,
  height = window.innerHeight - margin,
  cscale = d3.scale.linear().domain([0, 1])
    .range(["#fae893", "#756518"]),
  proj = d3.geo.equirectangular().scale(1).translate([0,0]),
  path = d3.geo.path().projection(proj),
  wscale = 0,
  svg = d3.select("body")
    .append("svg:svg")
    .attr("height", height)
    .attr("width", width),
  defs = svg.append("svg:defs"),
  canvas = svg.append("svg:g").attr("height", height - 5*margin)
    .attr("transform", "translate("+margin+","+3*margin+")"),
  clistw = 250,
  clist = canvas.append("svg:g").attr("width", clistw),
  labels = [], links = [],
  force = d3.layout.force()
    .nodes(labels)
    .links(links)
    .gravity(0)
    .friction(0.5)
    .size([clistw, height - 5*margin]),
  label = canvas.append("svg:g")
    .attr("transform", "translate("+clistw+",0)"),
  map = canvas.append("svg:svg")
    .attr("x", clistw)
    .append("svg:g"),
  l = d3.svg.line();

force.on("tick", function() {
  clist.selectAll("text.label")
    .attr("x", function(d) { d.x = 100; return d.x; })
    .attr("y", function(d, i) {
      if(d.y < 0) d.y = 0;
      if(d.y > height-5*margin) d.y = height-5*margin;
      if(i > 0 && d.y < labels[i-1].y) d.y = labels[i-1].y;
      return d.y;
    });
  clist.selectAll("path.pointer")
    .attr("d", function(d, i) {
        var s = [25, scale(d.p.d * 100)],
          m = [65, scale(d.p.d * 100)],
          e = [labels[i].x - 5, labels[i].y - 5];
        return l([s, m, e]);
      });
});

var grad = defs.append("svg:linearGradient")
  .attr("id", "grad")
  .attr("x1", "100%")
  .attr("x2", "100%")
  .attr("y1", "100%")
  .attr("y2", "0%")
  .attr("spreadMethod", "pad");
grad.append("svg:stop")
  .attr("offset", "0%")
  .attr("stop-color", "#fae893");
grad.append("svg:stop")
  .attr("offset", "100%")
  .attr("stop-color", "#756518");

svg.append("svg:text")
  .classed("title", true)
  .attr("text-anchor", "start")
  .attr("x", 1.5*margin)
  .attr("y", 1*margin)
  .text("What part of GDP per capita is peoples' income?");
svg.append("svg:text")
  .attr("text-anchor", "start")
  .attr("y", height-5)
  .text("GDP data from IMF for 2005, average income from http://www.worldsalaries.org");
svg.append("svg:text")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height-5)
  .text("Lars Kotthoff 2011");

var scale = d3.scale.linear().domain([0, 100])
    .range([height - 5*margin, 0]),
  axis = d3.svg.axis().scale(scale).ticks(10)
    .orient("left");
clist.append("svg:rect")
  .attr("fill", "url(#grad)")
  .attr("x", 30)
  .attr("width", 30)
  .attr("height", height - 5*margin);
clist.append("svg:g")
  .attr("transform", "translate(30,0)")
  .classed("axis", true)
  .call(axis);
clist.append("svg:text")
  .classed("expl", true)
  .attr("transform", "translate(0," + (height - 4*margin) + ")")
  .text("% of GDP per capita is income")

d3.json("countries.geojson", function(json) {
  var countries = json.features.filter(function(d, i) {
      return d.p.d != null;
      }).sort(function(a, b) { return b.p.d - a.p.d; });
  $.each(countries, function(i, d) {
    var n = {x: 100, y: scale(d.p.d * 100), t: d.p.n};
    labels.push(n);
    if(i > 0) links.push({source: labels[i-1], target: n});
  });

  console.log(countries);

  clist.selectAll("text.label")
    .data(labels).enter()
    .append("svg:text")
    .classed("label", true)
    .attr("x", function(d) { return d.x })
    .attr("y", function(d) { return d.y })
    .text(function(d) { return d.t; })
    .on("mouseover", function(d, i) {
        d3.selectAll(".active").classed("active", false);
        d3.select(d3.event.target).classed("active", true);
        updateMap(countries[i]);
      });

  console.log(labels);

  force.start();
  clist.selectAll("path.pointer")
    .data(countries).enter()
    .append("svg:path")
    .classed("pointer", true)
    .attr("fill", "none")
    .attr("d", function(d, i) {
        var s = [25, scale(d.p.d * 100)],
          m = [65, scale(d.p.d * 100)],
          e = [95, labels[i].y];
        return l([s, m, e]);
      });
  updateMap(json);
});
