// Global variables
var margin = {top: 50, right: 70, bottom: 50, left: 70}
var width = 650 - margin.right - margin.left; 
var height = 600 - margin.top - margin.bottom;
var svg, lines;
var cell = {};
var j = 0;
var color = d3.scale.category20();

var params = ['u_o', 'u_u', 'theta_v', 'theta_w', 'theta_v_minus', 'theta_o', 'tau_v1_minus', 'tau_v2_minus', 'tau_v_plus', 'tau_w1_minus', 'tau_w2_minus', 'k_w_minus', 'u_w_minus', 'tau_w_plus', 'tau_fi', 'tau_o1', 'tau_o2', 'tau_so1', 'tau_so2', 'k_so', 'u_so', 'tau_s1', 'tau_s2', 'k_s', 'u_s', 'tau_si', 'tau_w_inf', 'w_inf_star', 'm', 'b'];

var x = d3.scale.linear()
  .range([0, width]) 
  .domain([180, 240]);
var y = d3.scale.linear()
  .range([height, 0])
	.domain([-100, 60]);
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickSize(-height);
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickSize(-width);

var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d) { return x(d.time); })
  .y(function(d) { return y(d.voltage); });

var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 10])
    .on("zoom", zoomed);


$(document).ready(function() {
  init();
});


function init() {
	svg = d3.select(".stochastic").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.bottom + margin.top)
	.append("g")
		.attr("transform","translate(" + margin.left + "," + margin.top + ")");
		//.call(zoom);

  var clip = svg.append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("id", "clip-rect")
    .attr("x", "0")
    .attr("y", "0")
    .attr("width", width)
    .attr("height", height);

  var chartBody = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .call(zoom);

  var rect = chartBody.append("rect")
    .attr("width", width)
    .attr("height", height);

  lines = svg.append("g").attr("class","lines");

	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis)
	  .append("text")
	  	.text("Time (ms)")
	  	.attr("y", margin.bottom - 15)
	    .attr("x", width/2)
	    .style("text-anchor", "middle");

	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	  .append("text")
	  	.text("Voltage (mV)")
	  	.attr("y", -margin.left + 25)
	    .attr("x", -height/2)
	    .attr("transform", "rotate(-90)")
	    .style("text-anchor", "middle")
}

function readModel(form) {
  model_name = form.model_name.value; 
  d3.tsv("input_parameters/FK4V_IC_" + model_name + ".dat", function(data) {
  	data.forEach(function(d,i) {
  		cell[params[i]] = +d.input_parameter;
  	})
  	//console.log(cell);
  	var voltage = calculateVoltage(cell);	
  	//console.log(voltage);
		graphVoltage(voltage);
  })
}

function drawGrandi() {
  d3.tsv("grandi_model.dat", function(error, data) {
    data.forEach(function(d) {
      d.time = +d.time;
      d.voltage = +d.voltage;
    });

    graphVoltage(data);
  });
}

function readScaleFactors(form) {
	var scaleFactors = {};
	var newCell = {};
	for(param in cell){
		scaleFactors[param] = +form[param].value;
		newCell[param] = cell[param]*scaleFactors[param];
		//console.log("param = " + param + " scaleFactor = " + scaleFactors[param] + " newCell[" + param + "] = " + newCell[param] + " cell[" + param + "] = " + cell[param]);
	}
	var voltage = calculateVoltage(newCell);
	graphVoltage(voltage);
}

function resetScaleFactors(form) {
	for(param in cell) {
		form[param].value = 1.0;
	}
}

function getParameters(form) {
	var scaleFactors = {};
	var newCell = {};
	for(param in cell){
		scaleFactors[param] = +form[param].value;
		newCell[param] = cell[param]*scaleFactors[param];
		//console.log("param = " + param + " scaleFactor = " + scaleFactors[param] + " newCell[" + param + "] = " + newCell[param] + " cell[" + param + "] = " + cell[param]);
	}
	alert(JSON.stringify(newCell, null, 4));
}

function graphVoltage(voltage) {
  lines.append("path")
    .datum(voltage)
    .attr("class", "line")
    .attr("clip-path", "url(#clip)")
    .attr("d", line)
    .style("stroke", color(j));

  zoom.x(x);
  zoom.y(y);

	j++;
}

function zoomed() {
  svg.select(".x.axis").call(xAxis);
  svg.select(".y.axis").call(yAxis);
  svg.selectAll("path.line").attr("d", line);
}

function updateGraph(voltage) {

  svg.selectAll("path")
      .datum(voltage)
      .transition()
      .duration(1000)
      .attr("d", line);

	x.domain(d3.extent(voltage, function(d) { return d.time; }));
	y.domain(d3.extent(voltage, function(d) { return d.voltage; }));

	//Update X axis
	svg.select(".x.axis")
    	.transition()
    	.duration(1000)
		.call(xAxis);
	
	//Update Y axis
	svg.select(".y.axis")
    	.transition()
    	.duration(1000)
		.call(yAxis);
}

function calculateVoltage(cell) {
	var voltage;

	var BCL = 1000;
	var dt = 0.01;
	var stim_dur = 1.0;
	var stim_amp = 1.0;
	var numAPs = 3;

  // Simulation variables
  var n = 0;
  var N_BCL = BCL/dt, N_stim = stim_dur/dt, N=0;
  var t=0.0, t_end = numAPs*BCL - 0.01;
  var rec_start = t_end - BCL - 200, rec_end = t_end - 200;

  // Model variables
  var p, q, r, dv_dt, dw_dt, du_dt, ds_dt;
  var u = 0.0, v = 1.0, w = 1.0, s = 0.0;
  var V, J_fi, J_so, J_si, J_stim; 
  var tau_v_minus, tau_w_minus, tau_o, tau_so, tau_s;
  var v_inf, w_inf;

	var voltage_array = [];

	while (t < t_end) {
	  //if(n < 5){
	  //	console.log("V = " + V + "\tu = " + u + "\tv = " + v + "\tw = " + w + "\ts = " + s);
	  //}

	  if (u >= cell.theta_v) { p = 1.0; }
	  else { p = 0.0; }
	  if (u >= cell.theta_w) { q = 1.0; }
	  else { q = 0.0; }
	  if (u >= cell.theta_o) { r = 1.0; }
	  else { r = 0.0; }

	  // Infinity values
	  if (u >= cell.theta_v_minus) { v_inf = 0.0; }
	  else { v_inf = 1.0; }
	  w_inf = (1 - r) * (1 - u/cell.tau_w_inf) + r * cell.w_inf_star;

	  // Stimulus current
	  if(n % N_BCL == 0) { N++; }
	  if(n % N_BCL <= N_stim) { J_stim = stim_amp; }
	  else { J_stim = 0.0; }

	  // Time Contants
	  tau_v_minus = v_inf * cell.tau_v1_minus + (1 - v_inf) * cell.tau_v2_minus;
	  tau_w_minus = cell.tau_w1_minus + (cell.tau_w2_minus - cell.tau_w1_minus) * (1 + rational_tanh(cell.k_w_minus * (u - cell.u_w_minus)))/2;
	  tau_so = cell.tau_so1 + (cell.tau_so2 - cell.tau_so1) * (1 + rational_tanh(cell.k_so * (u - cell.u_so)))/2;
	  tau_s = (1 - q) * cell.tau_s1 + q * cell.tau_s2;
	  tau_o = (1 - r) * cell.tau_o1 + r * cell.tau_o2;

	  // dv_dt
	  dv_dt = ((1 - p) * (v_inf - v)/tau_v_minus) - (p * v/cell.tau_v_plus);
	  v = v + dt * dv_dt;

	  // dw_dt
	  dw_dt = ((1-q) * (w_inf - w)/tau_w_minus) - (q * w/cell.tau_w_plus);
	  w = w + dt * dw_dt;

	  // ds_dt
	  ds_dt = ((1 + rational_tanh(cell.k_s * (u - cell.u_s)))/2 - s)/tau_s;
	  s = s + dt * ds_dt;

	  // Model currents
	  J_fi = -v * p * (cell.u_u - u) * (u - cell.theta_v)/cell.tau_fi;
	  J_so = (u - cell.u_o) * (1 - q)/tau_o + q/tau_so;
	  J_si = -(q * w * s)/cell.tau_si;

	  // du_dt
	  du_dt = - (J_fi + J_so + J_si - J_stim);
	  u = u + dt * du_dt;

	  V = cell.m * u - cell.b;

	  if(t > rec_start && t < rec_end && n%100 == 0){
	  	var voltage = {time: +(t - rec_start).toFixed(2), voltage: V};
	  	voltage_array.push(voltage);
	  }

	  n++;
	  t = n * dt;
	}
	return voltage_array;
}

function rational_tanh(x) {
    if( x < -3 )
        return -1;
    else if( x > 3 )
        return 1;
    else
        return x * ( 27 + x * x ) / ( 27 + 9 * x * x );
}

