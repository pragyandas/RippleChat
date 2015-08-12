var socket = io();


var height = document.getElementById('chart').offsetHeight;
var width = document.getElementById('chart').offsetWidth;
var r = 500;

var svg = d3.select('#chart')
	.append('svg')
	.attr('height', height)
	.attr('width', width)
	.attr('id', 'chart_svg');

svg.on('click', function() {
	var e = document.getElementById("ddlViewBy");
	var color = e.options[e.selectedIndex].value;
	var position = d3.mouse(svg.node());
	var textboxValue = document.getElementById("rippleText").value
	var obj = {
		position: position,
		color: color,
		rippleText: textboxValue
	};
	socket.emit('svg_click', obj);

	var circle = svg.append("circle")
		.attr("cx", position[0])
		.attr("cy", position[1])
		.attr("r", 0)
		.style("stroke-width", 2)
		.style("stroke-dasharray", "5,5")
		.style('fill', 'none')
		.style('stroke', color)
		.transition()
		.delay(50)
		.duration(2000)
		.ease('quad-in')
		.attr("r", r)
		.style("stroke-opacity", 0)
		.each("end", function() {
			d3.select(this).remove();
		});
});


socket.on('svg_click_server', function(obj) {
	for (var i = 1; i < 3; i++) {
		var position = obj.position;
		var rippleText = obj.rippleText;
		var circle = svg.append("circle")
			.attr("cx", position[0])
			.attr("cy", position[1])
			.attr("r", 0)
			.style("stroke-width", 5 / (i))
			.style('fill', 'none')
			.style('stroke', obj.color)
			.transition()
			.delay(Math.pow(i, 2.5) * 50)
			.duration(2000)
			.ease('quad-in')
			.attr("r", r)
			.style("stroke-opacity", 0)
			.each("end", function() {
				d3.select(this).remove();
			});

		if (i === 2) {
			svg.append('text')
				.text(rippleText)
				.attr('x', position[0])
				.attr('y', position[1])
				.style('fill',obj.color);
		}
	}

});