function createDropdown(worldFood){


    //console.log(worldFood)

    var filterData = worldFood.filter(function(d) {

        if(d.adm0_name == "Cambodia")
            return d;
            });

    //console.log(filterData);

    var filter1 = filterData.filter(function(d){
        if(d.cm_name == "Oil (vegetable)" && d.mp_year <= 2015)
            return d;
    });
    console.log(filter1);

//var width = 960, height = 500;

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

  //  var color = d3.scaleCategory10();
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom");

    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("left");

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        x.domain(d3.extent(filter1, function(d) { return d.mp_year + "-" + d.mp_month; })).nice();
        y.domain(d3.extent(filter1, function(d) { return d.mp_price; })).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Sepal Width (cm)");

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Sepal Length (cm)")

        svg.selectAll(".dot")
            .data(filter1)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.mp_year + "-" +d.mp_month); })
            .attr("cy", function(d) { return y(d.mp_price); })
            .style("fill", function(d) { return color(d.cm_name); });




}

function createVis(errors,  worldFood) {
    // createMap(errors,worldMap,worldFood);
    createDropdown(worldFood);
    // createDropdown1(worldFood,"#item");
}

d3.queue()
    .defer(d3.csv,"wfp_market_food_prices.csv")
    .await(createVis);