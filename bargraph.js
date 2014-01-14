//23786660
var margin = {top: 40, bottom: 0, left:60, right:400}
var color = d3.scale.ordinal().range(["#19304D","#2E5D8A","#6285CB","#B6C9E7","#A0C0B6","#7EA993","#4D714B","#253729","#464931","#71684B","#958C50","#BFBD88","#B4632D","#8F3724","#85170F","#3D1431","#67225C","#76427B","#39846D","#48A883","#8DBF69","#DEE82C","#A2CB0B","#676E1C","#612C00","#452208","#45130C","#15281C","#19570A", "#D63600", "#A80000"]);
var width = 1400-margin.left-margin.right,	
height = 700-margin.top-margin.bottom;

$(document).ready( function(){

var scaler = d3.scale.linear()
				.range([height,0]);

var graph = d3.select("#catcount")
				.attr("width", width+margin.left+margin.right)
				.attr("height", height+margin.top+margin.bottom)
			.append("g")
				.attr("transform", "translate("+ margin.left+"," + margin.top + ")");

var catcount = d3.json("category_counts.json", function(root){
	scaler.domain([0, d3.entries(root).sort(function(a,b){return d3.descending(a.value.value,b.value.value);})[0].value.value ]);

	var barwidth = width / d3.entries(root).length;

	var bar = graph.selectAll("g")
					.data(root)
				.enter().append("g")
					.attr("transform", function(d,i){ return "translate(" + i * barwidth + ",0)"; })
				.append("rect")
					.attr("width", barwidth-2)
					.attr("fill", function(d){ return color(d.name);})
					.attr("y", function(d) { return height; })
				.transition().duration(500)
					.delay(function(d,i){ return i*200 })
					.attr("height", function(d){return height - scaler(d.value); })
					.attr("y", function(d) {return scaler(d.value); });

	/*graph.selectAll("g")
				.append("text")
				.attr("transform", function(d){ return "translate(" + barwidth/2 + ","+ height +") rotate(-90)"; })
				.text(function(d) {return d.name})
				.transition().duration(500)
					.delay(function(d,i){ return i*200 })
					.attr("transform", function(d){ return "translate(" + barwidth/2 + ","+ ((scaler(d.count))) +") rotate(-90)"; });*/	

    var legend = graph.append("g")
    					.attr("class", "legend");

    legend.selectAll("rect")
    	.data(root)
	.enter().append("rect")
		.attr("x", width+50)
		.attr("width", 16)
		.attr("height", 16)
		.attr("y", function(d,i){ return (i-2)*20; })
		.attr("fill", function(d){ return color(d.name);});

	legend.selectAll("text")
		.data(root)
	.enter().append("text")
		.attr("x", width+75)
		.attr("dy", ".74em")
		.attr("y", function(d,i){ return (i-2)*20 ; })
		.text(function(d){return d.name});

	});

});
