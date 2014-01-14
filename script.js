//23786660 book count total
var book_count_total = 23786660;
var color = d3.scale.ordinal().range(["#19304D","#2E5D8A","#6285CB","#B6C9E7","#A0C0B6","#7EA993","#4D714B","#253729","#464931","#71684B","#958C50","#BFBD88","#B4632D","#8F3724","#85170F","#3D1431","#67225C","#76427B","#39846D","#48A883","#8DBF69","#DEE82C","#A2CB0B","#676E1C","#612C00","#452208","#45130C","#15281C","#19570A", "#D63600", "#A80000"]);
var width =1000,	
height = 700;


$(document).ready( function(){


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
												var x = d.value
												while (color(x) === that.style.fill){
													x = d.value*Math.random();
												}
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



});
