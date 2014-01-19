
var book_count_total = 23786660;
var color = d3.scale.ordinal().range(["#19304D","#2E5D8A","#6285CB","#B6C9E7","#A0C0B6","#7EA993","#4D714B","#253729","#464931","#71684B","#958C50","#BFBD88","#B4632D","#8F3724","#85170F","#3D1431","#67225C","#76427B","#39846D","#48A883","#8DBF69","#DEE82C","#A2CB0B","#676E1C","#612C00","#452208","#45130C","#15281C","#19570A", "#D63600", "#A80000"]);
var width =1000, //default graph width
height = 700; //default graph height


$(document).ready( function(){

bubble_chart();
line_graph();
bar_graph();
});

function line_graph(){
	var margin = {top:70, bottom:60, left:140, right:50};
	var width = 1400; //overwrite default width
	d3.json("date_counts.json", function(root){
		//init scale for x data to map range to the graph dimensions
		var scalex = d3.scale.linear()
						.range([0,width-margin.left-margin.right])
						.domain([1750,2014]);

		//init axis with scale data to graph dimensions
		var xaxis = d3.svg.axis()
						.scale(scalex)
						.orient("bottom");

		//init scale for y data
		var scaley = d3.scale.linear()
						.range([height-margin.top-margin.bottom,0])
						.domain([0,(d3.entries(root).sort(function(a, b) { return d3.descending(a.value.value, b.value.value); })[0].value.value)]);

		//init yaxis with scalar
		var yAxis = d3.svg.axis()
				    .scale(scaley)
				    .orient("left");

		//function variable that will generate line coordinates based on data
		var line = d3.svg.line()
		    .x(function(d) { return scalex(d.year); })
		    .y(function(d) { return scaley(d.value); });

		//create initial svg with margins
		var graph = d3.select("#line").append("svg")
							.attr("width", width)
							.attr("height", height)
						.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		//add grid lines for y axis
		graph.selectAll("line.gridy").data(scaley.ticks(10)).enter()
			    .append("line")
			        .attr("class","gridy")
			        .attr("x1", 0)
			        .attr("x2",width)
			        .attr("y1", function(d){ return scaley(d);})
			        .attr("y2", function(d){ return scaley(d);})
			        .attr("fill", "none");

		//add grid lines for x axis
		graph.selectAll("line.gridx").data(scalex.ticks(13)).enter()
			    .append("line")
			        .attr("class","gridx")
			        .attr("x1", function(d){return scalex(d);})
			        .attr("x2", function(d){return scalex(d);})
			        .attr("y1", 0)
			        .attr("y2", height-margin.top-margin.bottom)
			        .attr("fill", "none");

		//generate x axis
		graph.append("g")
			.attr("class", "x axis")
		    .style("fill", "#8A8A8A")
			.attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
			.call(xaxis);

		//generate y axis
		graph.append("g")
			.attr("class", "y axis")
		    .style("fill", "#8A8A8A")
			.call(yAxis)
	   		.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".75em")
		      .style("fill", "#8A8A8A")
		      .style("text-anchor", "end")
		      .text("Books Published");

		//draw line graph
	    graph.append("path")
		      .datum(root)
		      .attr("class", "line")
		      .attr("d", line);

		//draws circle for each data point
		graph.selectAll("circle")
				.data(root)
			.enter().append("circle")
				.style("fill", "#C95DF0")
				.attr("cx", function(d){return scalex(d.year);})
        		.attr("cy", function(d){return scaley(d.value);})
        		.attr("r", 3)
        		.attr("stroke", "#B641E0")
        		.attr("stroke-width", "1px")
			    .on("mouseover", function(d){
			    	d3.select(this).transition()
			   			.style("fill", "white")
			    		.attr("stroke-width", "20px");

			    	var point = "(" + d.year + "," + d.value+")";
			    	graph.append("text") //displays coordinate text above circle when hover
			    		.attr("class", "coordinate")
			    		.style("text-anchor", "middle")
			    		.attr("fill", "white")
    					.attr("x", scalex(d.year))
						.attr("y", scaley(d.value)-40)
			    		.text(function(d){return point;});
			    })
			    .on("mouseout", function(d){
			    	d3.select(this).transition()
	    				.style("fill", "#C95DF0")
			    		.attr("stroke-width", "1px");
			    	d3.select((".coordinate")).remove();
			    });

	});
}


function bubble_chart(){

var bubble = d3.layout.pack()
				.size([width, height])
				.padding(1.5);

var bubblegraph = d3.select("#catcount").append("svg")	
				.attr("width", width)
				.attr("height", height)
				.attr("class", "bubble");

var catcount = d3.json("category_counts.json", function(root){

	var node = bubblegraph.selectAll("node")
				.data(bubble.nodes({name: "undef", children: root}).filter(function(d) { return !d.children; }))
			.enter().append("g")
				.filter(function(d){return d.name!=="undef";})
				.attr("class", "node");


			node.append("circle")
				.attr("r", function(d){return d.r;})
				.style("fill", function(d){return color(d.name);})
			    .on("mouseover", MouseOver)
			    .on("mouseout", MouseOut)
				.attr("transform", function(d) { return "translate(" + (d.x-140 )+ "," + d.y + ")"; } );

	  		node.append("rect")
				.attr("x", 	width-240)
				.attr("width", 16)
				.attr("height", 16)
				.attr("y", function(d,i){ return (i+1)*20; })
				.attr("fill", function(d){ return color(d.name);});

			node.append("text")
				.attr("x", width-195)
				.attr("dy", ".74em")
				.attr("fill", "#8A8A8A")
				.attr("y", function(d,i){ return (i+1)*20 ; })
				.text(function(d){return d.name});

	});	
}

function MouseOver(){
	var that = this;
	var parent = this.parentNode;
	var txt = parent.getElementsByTagName("text")[0];
	var name = d3.select(this).data()[0].name;
	txt.style.fontWeight = "bold";
	txt.setAttribute("fill", "#FFFFFF");

	d3.select(this).attr("stroke", "white")
					.attr("stroke-width", "0em")
					.transition()
					.attr("stroke-width", ".5em");
	var rectangle = parent.getElementsByTagName("rect")[0];
	rectangle.setAttribute("stroke", "white");
	rectangle.setAttribute("stroke-width", ".1em");	

	function piechart(){
		var radius = 150;

		var arc = d3.svg.arc()
					.outerRadius(radius-10)
					.innerRadius(0);

		var percent = d3.select(that).data()[0].value/book_count_total;

		var piegraph = d3.select("#catpie").append("svg")
						.attr("width", 500)
						.attr("height", height-100)
						.attr("class", "info")
					.append("g")
						.attr("transform", "translate(" + 250 + "," + height/2 + ")");

		var pie = d3.layout.pie()
					.value(function(d) { return d.value; });

		var g = piegraph.selectAll(".arc")
						.data(pie([{"name": d3.select(that).data()[0].name,"value": percent},{"name": "Books",  "value": 1-percent}]))
					.enter().append("g")
						.attr("class", "arc");

		g.append("path")
				.attr("d", arc)
				.style("fill", function(d){ if(d.data.name!="Books"){
												return that.style.fill;
											} else {
												var x = d.data.value
												while (color(x) == that.style.fill.toUpperCase()){//TODO: doesn't match for equivalent hex & rgb values causing same color
													x = d.data.value*Math.random();
												}
											console.log(color(x) + " " + that.style.fill.toUpperCase());
											return color(x);
											}
											});

		piegraph.append("text")
				.attr("y", -180)
				.attr("fill", "#8A8A8A")
				.style("font-size", "30px")
				.style("text-anchor", "middle")
				.text( Math.round(percent*10000)/100 + "%");
	}
	var descript = "book count: " + d3.select(this).data()[0].value;
	switch(name){
		case("Art"):
			var descript = "Art, Architecture, Photography <br> book count: " + d3.select(this).data()[0].value;
			break;
		case("Other"):
			var descript = "Miscellaneous books <br> book count: " + d3.select(this).data()[0].value;
			break;
		case("Unlisted"):
			var descript = "Uncategorized, no subjects listed in dataset <br> book count: " + d3.select(this).data()[0].value;
			break;
		case("Politics"):
			var descript = "Politics, Law & Government <br> book count: " + d3.select(this).data()[0].value;
			break;
		case("Social Science"):
			var descript = "Psychology, Sociology, etc <br> book count: " + d3.select(this).data()[0].value;
			break;
		case("Science"):
			var descript = "Physics, Chemistry, Biology & Medical Sciences <br> book count: " + d3.select(this).data()[0].value;
			break;
	}
	document.getElementById("pieinfo").innerHTML = "<h1>" + name + "</h1>" + "<br>" + descript;
	piechart();

}

function MouseOut(){
	var parent = this.parentNode;
	d3.select(this).transition().attr("stroke-width", "0em");
	var txt = parent.getElementsByTagName("text")[0]
	txt.style.fontWeight = "normal";
	txt.setAttribute("fill", "#8A8A8A")
	parent.getElementsByTagName("rect")[0].setAttribute("stroke-width", "0em");
	d3.select(".info").remove();
	document.getElementById("pieinfo").innerHTML = "";
}



function bar_graph(){
	var margin = {top:50, bottom:50, left:180, right:15};
	var width = 1100;
	var scaler = d3.scale.linear()
					.range([height-100,0]);

	var graph = d3.select("#bar")
					.attr("width", width+margin.left+margin.right)
					.attr("height", height+margin.top+margin.bottom)
				.append("g")
					.attr("transform", "translate("+ margin.left+"," + margin.top + ")");


	var avgpg = d3.json("category_pagecounts.json", function(root){
		var descendingdata = d3.entries(root).sort(function(a,b){return d3.descending(a.value.value,b.value.value);});
		var datalength = Object.keys(descendingdata).length-1;
		scaler.domain([descendingdata[datalength].value.value, descendingdata[0].value.value]);

		var yaxis = d3.svg.axis()
		    .scale(d3.scale.linear()
				.range([height,0])
				.domain([descendingdata[datalength].value.value, descendingdata[0].value.value]))
		    .orient("left");

		var xaxis = d3.svg.axis()
						.scale(d3.scale.linear()
							.range([0,width]))
					 	.tickFormat("")
						.orient("bottom");

		var color = d3.scale.linear()
	    .domain([descendingdata[datalength].value.value, descendingdata[datalength/2].value.value, descendingdata[0].value.value])
	    .range(["orange", "yellow", "white"]);

		var barwidth = width / d3.entries(root).length;

		var bar = graph.selectAll("g")
						.data(root)
					.enter().append("g")
						.attr("transform", function(d,i){ return "translate(" + (i+.3) * barwidth + ",0)"; })
					.append("rect")
						.attr("width", barwidth-2)
						.attr("fill", function(d){ return color(d.value);})
						.attr("height", function(d){return height-scaler(d.value); })
						.attr("y", function(d) {return scaler(d.value); })
					    .on("mouseover", function(d){
					    	d3.select(this).transition().attr("fill", "crimson");
					    })
					    .on("mouseout", function(d){
					    	d3.select(this).transition().attr("fill", function(d){ return color(d.value);});
					    });

		graph.selectAll("g")
					.append("text")
					.attr("dy", ".25em")
					.attr("dx", ".25em")
					.attr("transform", function(d){ return "translate(" + barwidth/2 + ","+ height +") rotate(-90)"; })
					.text(function(d) {return d.name})
				    .on("mouseover", function(d){
					    	d3.select(this.parentNode.getElementsByTagName("rect")[0]).transition().attr("fill", "crimson");
					    })
				    .on("mouseout", function(d){
					    	d3.select(this.parentNode.getElementsByTagName("rect")[0]).transition().attr("fill", function(d){ return color(d.value);});
					    });;

		graph.append("g")
		      .attr("class", "y axis")
  		      .style("fill", "#8A8A8A")
		      .call(yaxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
 		      .style("fill", "#8A8A8A")
		      .style("text-anchor", "end")
		      .text("Average Page count per book");

		graph.append("g")
			.attr("class", "x axis")
		    .style("fill", "#8A8A8A")
			.attr("transform", "translate(0," + (height) + ")")
			.call(xaxis);

		});

}
