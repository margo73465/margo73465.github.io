
    //USES ETHDATA

    var label_array = [];
    var anchor_array = [];

    for(i=0; i<4; i++){
      var label = {
        x: - 10,
        y: scale(ethdata[i].under18),
        width: 0.0,
        height: 0.0,
        name: Math.round(ethdata[i].under18*100) + "% " + ethdata[i].name,
        ethnicity: ethdata[i].name,
        agegroup: "under18"
      };
      label_array.push(label);
      var label = {
        x: w + 10,
        y: scale(ethdata[i].over18),
        width: 0.0,
        height: 0.0,
        name: Math.round(ethdata[i].over18*100) + "% " + ethdata[i].name,
        ethnicity: ethdata[i].name,
        agegroup: "over18"
      };
      label_array.push(label);
      
      var anchor = {
        x: 0,
        y: scale(ethdata[i].under18),
        r: 4,
        ethnicity: ethdata[i].name
      };
      anchor_array.push(anchor);
      var anchor = {
        x: w,
        y: scale(ethdata[i].over18),
        r: 4,
        ethnicity: ethdata[i].name
      };
      anchor_array.push(anchor);
    }

    function redrawLabels() {
      // Redraw labels and leader lines
      labels
      .transition()
      .duration(800)
      //.attr("x", function(d) { return (d.x); })
      .attr("y", function(d) { return (d.y); });

      links
      .transition()
      .duration(800)
      .attr("x2",function(d) { return (d.x); })
      .attr("y2",function(d) { return (d.y); });
    }
    
    anchors = svg.selectAll(".dot")
          .data(anchor_array)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", function(d) { return (d.r); })
          .attr("cx", function(d) { return (d.x); })
          .attr("cy", function(d) { return (d.y); })
          .style("fill", function(d) { return color(d.ethnicity); });

    labels = svg.selectAll(".label")
          .data(label_array)
          .enter()
          .append("text")
          .attr("class", "label")
          .attr("text-anchor", function(d) {
            if(d.agegroup == "under18")
              return "end";
            else
              return "start";
          })
          .attr("alignment-baseline","central")
          .text(function(d) { return d.name; })
          .attr("x", function(d) { return (d.x); })
          .attr("y", function(d) { return (d.y); })
          .attr("fill", function(d) { return color(d.ethnicity); });

    var index = 0;
    labels.each(function() {
        label_array[index].width = this.getBBox().width;
        label_array[index].height = this.getBBox().height;
        index += 1;
    });

    links = svg.selectAll(".link")
          .data(label_array)
          .enter()
          .append("line")
          .attr("class", "link")
          .attr("x1", function(d) { return (d.x); })
          .attr("y1", function(d) { return (d.y); })
          .attr("x2", function(d) { return (d.x); })
          .attr("y2", function(d) { return (d.y); });

    var sim_ann = d3.labeler()
          .label(label_array)
          .anchor(anchor_array)
          .width(10)
          .height(h)
          sim_ann.start(1000);

    redrawLabels();


    //USES DATA


    var label_array = [];
      var anchor_array = [];

      for(i=0; i<4; i++){
        var label = {
          x: - 10,
          y: scale(data[i].under18),
          width: 0.0,
          height: 0.0,
          name: Math.round(data[i].under18*100) + "% " + data[i].name,
          ethnicity: data[i].name,
          agegroup: "under18"
        };
        label_array.push(label);
        var label = {
          x: w + 10,
          y: scale(data[i].over18),
          width: 0.0,
          height: 0.0,
          name: Math.round(data[i].over18*100) + "% " + data[i].name,
          ethnicity: data[i].name,
          agegroup: "over18"
        };
        label_array.push(label);
        
        var anchor = {
          x: 0,
          y: scale(data[i].under18),
          r: 4,
          ethnicity: data[i].name
        };
        anchor_array.push(anchor);
        var anchor = {
          x: w,
          y: scale(data[i].over18),
          r: 4,
          ethnicity: data[i].name
        };
        anchor_array.push(anchor);
      }

      function redrawLabels() {
        // Redraw labels and leader lines
        labels
        .transition()
        .duration(800)
        //.attr("x", function(d) { return (d.x); })
        .attr("y", function(d) { return (d.y); });

        links
        .transition()
        .duration(800)
        .attr("x2",function(d) { return (d.x); })
        .attr("y2",function(d) { return (d.y); });
      }
      
      anchors = svg.selectAll(".dot")
            .data(anchor_array)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return (d.r); })
            .attr("cx", function(d) { return (d.x); })
            .attr("cy", function(d) { return (d.y); })
            .style("fill", function(d) { return color(d.ethnicity); });

      labels = svg.selectAll(".label")
            .data(label_array)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("text-anchor", function(d) {
              if(d.agegroup == "under18")
                return "end";
              else
                return "start";
            })
            .attr("alignment-baseline","central")
            .text(function(d) { return d.name; })
            .attr("x", function(d) { return (d.x); })
            .attr("y", function(d) { return (d.y); })
            .attr("fill", function(d) { return color(d.ethnicity); });

      var index = 0;
      labels.each(function() {
          label_array[index].width = this.getBBox().width;
          label_array[index].height = this.getBBox().height;
          index += 1;
      });

      links = svg.selectAll(".link")
            .data(label_array)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("x1", function(d) { return (d.x); })
            .attr("y1", function(d) { return (d.y); })
            .attr("x2", function(d) { return (d.x); })
            .attr("y2", function(d) { return (d.y); });

      var sim_ann = d3.labeler()
            .label(label_array)
            .anchor(anchor_array)
            .width(10)
            .height(h)
            sim_ann.start(1000);

      redrawLabels();





   makeGraph(activeId,all_data)

      function makeGraph(activeId, data){
  var margin = {top: 30, right: 100, bottom: 30, left: 100};
  var width = 360;
  var height = 200;
  var w = width - margin.left - margin.right;
  var h = height - margin.top - margin.bottom;
  var activeID = activeId;

  var svg = d3.select(".chart").append("svg")
    .attr("width",width)
    .attr("height",height)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var color = d3.scale.category20();

  var scale = d3.scale.linear()
    .domain([0, 1])
    .range([h, 0])

  var ord_scale = d3.scale.ordinal()
    .domain(["Under 18", "Over 18"])
    .range([0, w]);

  console.log(data[activeId]);

  var ethdata = [
    {
      name: "white", 
      under18: data[activeId].pop_nothisp_white_under18,
      over18: data[activeId].pop_nothisp_white
    },
    {
      name: "black",
      under18: data[activeId].pop_nothisp_black_under18,
      over18: data[activeId].pop_nothisp_black
    },
    {
      name: "hispanic",
      under18: data[activeId].pop_hisp_under18,
      over18: data[activeId].pop_hisp_under18
    },
    {
      name: "other",
      under18: data[activeId].pop_nothisp_other_under18,
      over18: data[activeId].pop_nothisp_other
    }
  ];

  console.log(ethdata);

  // Plot data
  var ethnicity = svg.selectAll(".ethnicity")
      .data(ethdata)
    .enter().append("g")
      .attr("class","ethnicity");

  ethnicity.append("line")
    .attr("x1",0)
    .attr("x2",w)
    .attr("y1",function(d){ return scale(d.under18); })
    .attr("y2",function(d){ return scale(d.over18); })
    .style("stroke",function(d){ return color(d.name); })
    .style("stroke-width",2);

  // Add axes
  var left_axis = d3.svg.axis()
    .scale(scale)
    .tickFormat("")
    .orient("right")
    .ticks(5);
  var right_axis = d3.svg.axis()
    .scale(scale)
    .tickFormat("")
    .orient("left")
    .ticks(5);

  svg.append("g")
      .attr("class","axis")
      .call(left_axis)
    .append("text")
      .text("Under 18")
      .attr("text-anchor","middle")
      .attr("x",0)
      .attr("y",-10);
  
  svg.append("g")
      .attr("class","axis")
      .attr("transform","translate(" + w + ",0)")
      .call(right_axis)
    .append("text")
      .text("Over 18")
      .attr("text-anchor","middle")
      .attr("x",0)
      .attr("y",-10);

  // Add labels (use simulated annealing to prevent overlap)
  var label_array = [];
  var anchor_array = [];

  for(i=0; i<4; i++){
    var label = {
      x: - 10,
      y: scale(ethdata[i].under18),
      width: 0.0,
      height: 0.0,
      name: Math.round(ethdata[i].under18*100) + "% " + ethdata[i].name,
      ethnicity: ethdata[i].name,
      agegroup: "under18"
    };
    label_array.push(label);
    var label = {
      x: w + 10,
      y: scale(ethdata[i].over18),
      width: 0.0,
      height: 0.0,
      name: Math.round(ethdata[i].over18*100) + "% " + ethdata[i].name,
      ethnicity: ethdata[i].name,
      agegroup: "over18"
    };
    label_array.push(label);
    
    var anchor = {
      x: 0,
      y: scale(ethdata[i].under18),
      r: 4,
      ethnicity: ethdata[i].name
    };
    anchor_array.push(anchor);
    var anchor = {
      x: w,
      y: scale(ethdata[i].over18),
      r: 4,
      ethnicity: ethdata[i].name
    };
    anchor_array.push(anchor);
  }

  function redrawLabels() {
    // Redraw labels and leader lines
    labels
    .transition()
    .duration(800)
    .attr("x", function(d) { return (d.x); })
    .attr("y", function(d) { return (d.y); });

    links
    .transition()
    .duration(800)
    .attr("x2",function(d) { return (d.x); })
    .attr("y2",function(d) { return (d.y); });
  }
  
  anchors = svg.selectAll(".dot")
        .data(anchor_array)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return (d.r); })
        .attr("cx", function(d) { return (d.x); })
        .attr("cy", function(d) { return (d.y); })
        .style("fill", function(d) { return color(d.ethnicity); });

  labels = svg.selectAll(".label")
        .data(label_array)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", function(d) {
          if(d.agegroup == "under18")
            return "end";
          else
            return "start";
        })
        .attr("alignment-baseline","central")
        .text(function(d) { return d.name; })
        .attr("x", function(d) { return (d.x); })
        .attr("y", function(d) { return (d.y); })
        .attr("fill", function(d) { return color(d.ethnicity); });

  var index = 0;
  labels.each(function() {
      label_array[index].width = this.getBBox().width;
      label_array[index].height = this.getBBox().height;
      index += 1;
  });

  links = svg.selectAll(".link")
        .data(label_array)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return (d.x); })
        .attr("y1", function(d) { return (d.y); })
        .attr("x2", function(d) { return (d.x); })
        .attr("y2", function(d) { return (d.y); });

  var sim_ann = d3.labeler()
        .label(label_array)
        .anchor(anchor_array)
        .width(10)
        .height(h)
        sim_ann.start(1000);

  redrawLabels();

}