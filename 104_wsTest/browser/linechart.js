var t = -1
var n = 40,
    duration = 50,
    data = d3.range(n).map(next);

var queue = [];

// cavans size
var margin = { top: 6, right: 0, bottom: 20, left: 40 },
    width = 560 - margin.right,
    height = 120 - margin.top - margin.bottom;

// data range
var x = d3.scale.linear()
    .domain([t-n+1, t])
    .range([0, width]);

var y = d3.time.scale()
    .range([height, 0])
    .domain([0, 10]);;

// the line
var line = d3.svg.line()
    .interpolate("linear")
    .x(function (d, i) {return x(d.time);})
    .y(function (d, i) {return y(d.value);});

var svg = initVis();

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x.axis=xAxis);

var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .data([data])
    .attr("class", "line");

tick();

host = 'localhost';
var ws = new WebSocket('ws://' + host + ':3000');
ws.onmessage = function (event) {
    queue.push( JSON.parse(event.data).count );
};
d3.select(window).on("click", function() { 
    
});

function tick() {
    // update the domains
    x.domain([t - n + 2 , t]);
    
    if(queue.length == 0)
        data.push(next());
    else {
        data.push(next(queue.shift()));
    }
    data.shift();

    // redraw the line
    svg.select(".line")
        .attr("d", line)
        .attr("transform", null);

    // slide the x-axis left
    axis.transition()
        .duration(duration)
        .ease("linear")
        .call(x.axis);

    // slide the line left
    path.transition()
        .duration(duration)
        .ease("linear")
        .attr("transform", "translate(" + x(t-n) + ")")
        .each("end", tick);
}

function next(x){
    x = x || 0;
    return {
        time: ++t, 
        value: x
    }
}

function initVis() {
    var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    return svg;
}
