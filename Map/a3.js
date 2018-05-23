function createVis(errors, mapData, spendingData)
{
    // call your own functions from here, or embed code here
    var width = 800,
        height = 500;

//Create Map for Part one
    var projection = d3.geoConicConformal()
        .rotate([70,0])
       // .center([-1,41])
        .center([-2,42])
        .scale(10000)
        .translate([width/2,height/2])
        .precision(0.1);

    var path = d3.geoPath()
        .projection(projection);

    var svg=d3.select("#map")
        .append("svg")
        .attr("width",width)
        .attr("height",height);

        svg.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("d",path)
            .style("stroke","#000000")
            .style("stroke-width","0.2")
            .attr("fill","#ff4500")
            .attr("fill-opacity", 0.4);

   var linkeddata =linkdata(spendingData,mapData);
   console.log(linkeddata);

    var localPublic = linkeddata.filter(function (d){

   if(d.properties.MADISTTYPE == "Local School"){
    return d;
    }

});

    var max = d3.max(localPublic, function (d) {
        return d.properties.TTPP;
    }); //returns maximum TTPP value

  /* var filterLocal = localPublic.filter(function(d){

        return  d.properties.TTPP !="";
    }); *///filters null TTPP value

    var min = d3.min(localPublic, function (d) {
        return d.properties.TTPP;

    });//returns minimum TTPP value

   //console.log(min, max);

var regionalAcademic =  linkeddata.filter(function (e){

    if(e.properties.MADISTTYPE == "Regional Academic"){
        return e;
    }

});
//console.log(regionalAcademic);

    var color = d3.scaleSequential(d3.interpolateOranges)
                  .domain([min,max]);


    createMap(localPublic,"#map-local");
   createMap(regionalAcademic,"#map-regional");

   //Function to create Map Part two
    function createMap(map1, div) {

        var svg1 = d3.select(div)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg1.selectAll("path")
            .data(map1)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#000000")
            .style("stroke-width", "0.2")
           // .attr("fill-opacity", 0.4)
            .style('fill', function(d){

               if(d.properties.TTPP){

                   return color(parseInt(d.properties.TTPP));}
                else {
                return color(9000);
               }

            });

  var legendData = [min, "", "", "", "", max];

   // console.log(legendData);

       var legend = svg1.append("g")
              .selectAll("g")
           .data(color.ticks(6).slice(1))
           .enter()
           .append("g")
           .attr("class","legend")
              .attr("transform",function(d,i){
                  return "translate(110,"+ i*20+ ")";
              });

       var w = 20, h = 20;

       legend.append("rect")
          // .append("svg:linearGradient")
           .attr("x",20)
           .attr("y",20)
           .attr("width",w)
           .attr("height",h)
           .style("fill",function(d){
              return color(d);

        });

        legend.append("text")
           // .data(legendData.slice())
            .data(legendData)
            .attr("x", w -60)
            .attr("y",30)
            .attr("dy","0.5em")
            .text(function (d){
                return d;
            });
    }

    //Part Three MA Overlay
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

        // var map = L.map('map').setView([37.8, -96.9],4).addLayer(osm);
        var map = L.map('map-overlay').setView([42.6833, -71.5], 8).addLayer(osm);

    var overlaySVG = d3.select(map.getPanes().overlayPane).append("svg")
            g = overlaySVG.append("g").attr("class", "leaflet-zoom-hide");

        var transform = d3.geoTransform({point: projectPoint}),
            path1 = d3.geoPath().projection(transform);

        // d3.json("https://cdn.rawgit.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-districts-100.geojson", function (error,mapData1){
     var mapping = g.selectAll("path")
            .data(regionalAcademic)
            .enter()
            .append("path")
            .attr("d", path1)
            .style("stroke", "#000000")
            .style("stroke-width", "0.2")
            // .attr("fill-opacity", 0.4)
            .style('fill', function (d) {

                if (d.properties.TTPP) {

                    return color(parseInt(d.properties.TTPP));
                }
                else {
                    return color(9000);
                }
            });

        map.on("viewreset", reset);
        reset();

        function reset() {
            var bounds = path1.bounds(mapData),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            overlaySVG.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
            mapping.attr("d", path1);
        }

        function projectPoint(lng, lat) {
            var point = map.latLngToLayerPoint(new L.LatLng(lat, lng));
            this.stream.point(point.x, point.y);
        }


}


// uncomment the cdn.rawgit.com versions and comment the cis.umassd.edu versions if you require all https data
d3.queue()
   .defer(d3.json, "https://cdn.rawgit.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-districts-100.geojson")
    // use this version if the 100m version is too slow
   // .defer(d3.json, "https://cdn.rawgit.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-districts-500.geojson")
    .defer(d3.csv, "https://gist.githubusercontent.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-funding.csv")
 .await(createVis)


//Merge TTPP from spendingData to mapData
function linkdata(spendingData, mapData) {

    for (var i = 0; i < spendingData.length; i++) {

        var district = spendingData[i].District;

        var TTPP = spendingData[i].TTPP;

        for (var j = 0; j < mapData.features.length; j++) {

            var district1 = mapData.features[j].properties.DISTRICT;

            if(district == district1){
                mapData.features[j].properties.TTPP = TTPP;
                break;
            }
        }

    }
    return mapData.features;

}