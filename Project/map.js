function createMap(errors, worldMap, worldFood) {

   // console.log(worldMap);


var height =900,
    width = 960;
  //  var district1 = worldMap.features;
    //console.log(district1);

    var linkeddata =linkCountries(worldMap);
  //  console.log(linkeddata);

    var linkeddata1 = linkdata(worldMap, worldFood);
  // console.log(linkeddata1);
    var svg=d3.select("#map")
        .append("svg")
        .attr("width",width)
        .attr("height",height);

 // var color = d3.scaleSequential(d3.interpolateOranges)
  var color = d3.scaleThreshold()
               // .domain(worldMap.properties.Countryyy)
      .range("#2ca25f");


    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});


    //var map = L.map('map').setView([37.8, -96.9],4).addLayer(osm);
    var map = L.map('map').setView([0, 0],2).addLayer(osm);


//console.log(map);

    var overlaySVG = d3.select(map.getPanes().overlayPane).append("svg"),
          g = overlaySVG.append("g").attr("class", "leaflet-zoom-hide");

    var transform = d3.geoTransform({point: projectPoint}),
        path1 = d3.geoPath().projection(transform);


    var mapping = g.selectAll("path")
        .data(linkeddata1)
        .enter()
        .append("path")
        .attr("d", path1)
        .style("stroke", "#000000")
        .style("stroke-width", "0.2")
       // .attr("fill","#ff4500")
        //.attr("fill","#3182bd")
        .attr("fill-opacity", 0.4)
        .style('fill', function(d){

           if(d.properties.Countryyy) {

               // return color(d.properties.Countryyy);}
               //  return color(d.properties.Countryyy);

               return ("red");
           }


        })
       // .on("mouseover", function(d){

         //   return d.properties.Countryyy;
        //});


map.on("viewreset", reset);
reset();

function reset() {
    var bounds = path1.bounds(worldMap),
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

var selectCountry;

var items;

var selectYear;

var dataIndex = 1;



var dataIndex1 = 1;

var dataIndex2 = 1;

//var svg = d3.select("svg").remove();

function createDropdown(worldFood,divId){
    //console.log(worldFood);

    var country = d3.map(worldFood, function(d){ return d.adm0_name;}).keys();
  //  console.log(country);
    var drop = d3.select(divId)
        .on('change',onchange);

    drop.selectAll("option")
        .data(country)
        .enter()
        .append("option")
        .text(function(d){
            return d;
        });

    /*var drop2= d3.select("#item")
    .on('change',onchange);*/




      //  console.log(item);
 /*   var drop1 = d3.select(divId)
        .on('change',onchange);
    drop1.selectAll("option")
        .data(item)
        .enter()
        .append("option")
        .text(function(d){
            return d;
        });*/

        function onchange(){
          //  var dID = document.getElementById('country');


            document.getElementById("graph").innerHTML = "";
            document.getElementById("graph1").innerHTML = "";
            var selectedValue = d3.event.target.value;
            var obj2=[];
             selectCountry = worldFood.filter(function(d,i){

                if(selectedValue == d.adm0_name){
                    obj2.push({
                        name: d.cm_name,
                        price: d.mp_price,
                        month: d.mp_month,
                        year : d.mp_year
                    });
                    return d.cm_name;
               };

           });

      //console.log(obj2);

             items = d3.map(obj2, function(d){

                return d.name;

            }).keys();

         //   console.log(items);

           var filterItems = items.filter((e,i) => (i <3)



            );

          //  console.log(filterItems);

            var filterData = countrywiseItem(obj2,filterItems[0]);
       // console.log(filterData);
            var filterData1 = countrywiseItem(obj2,filterItems[1]);
          //console.log(filterData1);
            var filterData2 = countrywiseItem(obj2,filterItems[2]);


           // console.log(filterMonth);


           var option;
            $.each(filterItems, function (a, b) {
               // console.log(b);
                $('#item').html("");
                option += '<option Value="' + b + '">' + b + '</option>'
            });

            $('#item').html(option);




     var see = d3.select("#item");
///////////////////////////////////////////////////////////////////////////////////////////////////
  var margin = {top:30, right:20, bottom:30, left:50},
         width = 400-margin.left-margin.right,
         height = 220 - margin.top-margin.bottom;


     var parseTime = d3.timeParse("%Y-%M");

     var x = d3.scaleTime()
         .range([0,width]);

     var y = d3.scaleLinear()
         .range([height,0]);
         //.range([0,height]);



            var line = d3.line()
                .x(function(d){
                   // console.log(d.year);
                    return x(parseTime(d.year + "-" + d.month));
                })
                .y(function(d){
                    //console.log(d.price);
                    return y(d.price);
                })

         //   d3.select("svg").remove();

            var chart1 = d3.select("#graph")
                .append("svg")
                .attr("width",width + margin.left +margin.right)
                .attr("height",height + margin.top +margin.bottom)
                .attr("id","chart1")
                .append("g")
                .attr("transform","translate(" + margin.left + "," +margin.top +")")
                .on("click",function(){

                    document.getElementById("year").innerHTML = "";

                    var country1 = d3.map(obj2, function(d){ return d.year;}).keys();
                   // console.log(country1);
                    var drop1 = d3.select("#year")
                        .on('change',onchange1);

                    drop1.selectAll("option")
                        .data(country1)
                        .enter()
                        .append("option")
                        .text(function(d){
                            return d;
                        });
                    document.getElementById("graph1").innerHTML = "";
                    function onchange1(){

                       // document.getElementById("graph1").innerHTML = "";
                        var selectedValue1 = d3.event.target.value;
                        var obj3=[];
                        selectYear = obj2.filter(function(d,i){

                            if(selectedValue1 == d.year){
                                obj3.push({
                                    name1: d.name,
                                    price1: d.price,
                                    month1: d.month,
                                    year1 : d.year
                                });


                                return d.name;
                            };

                        });
                        //console.log(obj3);
                        //console.log(filterItems[0]);
                         var filterMonth = monthwiseItem(obj3,filterItems[0]);
                         console.log(filterMonth);

                        if(dataIndex ==1){
                            dataIndex = 2;
                        }
                        else{
                            dataIndex = 1;
                        }

                        var x1 = d3.scaleTime()
                            .range([0,width]);

                        var y1 = d3.scaleLinear()
                            .range([height,0]);

                        var parseTime = d3.timeParse("%M");

                        var valueline1 = d3.line()
                            .x(function(d){
                                return x1(parseTime(d.month1));
                            })
                            .y(function(d){
                                return y1(d.price1);
                            })


                        var innerchart1 = d3.select("#graph1")
                            .append("svg")
                            .attr("width",width + margin.left +margin.right)
                            .attr("height",height + margin.top +margin.bottom)
                            .append("g")
                            .attr("transform","translate(" + margin.left + "," +margin.top +")");

                        x1.domain(d3.extent(filterMonth, function(d){
                            // d.year = parseDate(d.year);
                            return parseTime(d.month1);
                        }));
                        // y1.domain([0,d3.max(filterMonth,function(d){
                          //  return d.price1;
                         //})]);
                        y1.domain(d3.extent(filterMonth,function(d){
                            return d.price1;
                        }));



                        innerchart1.append("g")
                            .attr("transform","translate(0," + height + ")")
                            .call(d3.axisBottom(x1));

                        innerchart1.append("g")
                            .call(d3.axisLeft(y1));

                        innerchart1.append("path")
                            .datum(filterMonth)
                            .attr("fill", "none")
                            .attr("stroke", "steelblue")
                            .attr("stroke-linejoin", "round")
                            .attr("stroke-linecap", "round")
                            .attr("stroke-width", 1.5)
                            .attr("d", valueline1);

                       // alert("hi");
                    }

                });



            x.domain(d3.extent(filterData, function(d){
               // d.year = parseDate(d.year);
                return parseTime(d.year + "-" + d.month);
            }));

           // y.domain([0,d3.max(filterData,function(d){
             //  return d.price;
            //})]);

            y.domain(d3.extent(filterData,function(d){
               return d.price;
            }));


            chart1.append("g")
                .attr("transform","translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .select(".domain");

            chart1.append("g")
                .call(d3.axisLeft(y));

            chart1.append("path")
                .datum(filterData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            var chart2 = d3.select("#graph")
                .append("svg")
                .attr("width",width + margin.left +margin.right)
                .attr("height",height + margin.top +margin.bottom)
                .append("g")
                .attr("transform","translate(" + margin.left + "," +margin.top +")")
                .on("click",function(){

                    document.getElementById("year1").innerHTML = "";

                    var country1 = d3.map(obj2, function(d){ return d.year;}).keys();
                    // console.log(country1);
                    var drop2 = d3.select("#year1")
                        .on('change',onchange2);

                    drop2.selectAll("option")
                        .data(country1)
                        .enter()
                        .append("option")
                        .text(function(d){
                            return d;
                        });

                    function onchange2(){

                        //document.getElementById("graph1").innerHTML = "";
                        var selectedValue1 = d3.event.target.value;

                        var obj4=[];
                        selectYear = obj2.filter(function(d,i){

                            if(selectedValue1 == d.year){
                                obj4.push({
                                    name1: d.name,
                                    price1: d.price,
                                    month1: d.month,
                                    year1 : d.year
                                });


                                return d.name;
                            };

                        });
                        //console.log(obj3);
                        //console.log(filterItems[0]);
                       // var filterMonth = monthwiseItem(obj3,filterItems[0]);
                       // console.log(filterMonth);
                        var filterMonth1 = monthwiseItem1(obj4,filterItems[1]);
                        //console.log(filterMonth1);
                        //var filterMonth2 = monthwiseItem(obj2,filterItems[2]);
                        //console.log(filterMonth2);
                       // document.getElementById("graph1").innerHTML = "";

                        if(dataIndex1 ==1){
                            dataIndex1 = 2;
                        }
                        else{
                            dataIndex1 = 1;
                        }


                       var x2 = d3.scaleTime()
                            .range([0,width]);

                        var y2 = d3.scaleLinear()
                            .range([height,0]);

                        var parseTime = d3.timeParse("%M");

                        var valueline2 = d3.line()
                            .x(function(d){
                                return x2(parseTime(d.month1));
                            })
                            .y(function(d){
                                return y2(d.price1);
                            })

                        var innerchart2 = d3.select("#graph1")
                            .append("svg")
                            .attr("width",width + margin.left +margin.right)
                            .attr("height",height + margin.top +margin.bottom)
                            .append("g")
                            .attr("transform","translate(" + margin.left + "," +margin.top +")");

                        x2.domain(d3.extent(filterMonth1, function(d){
                            // d.year = parseDate(d.year);
                            return parseTime(d.month1);
                        }));
                        //y2.domain([0,d3.max(filterMonth1,function(d){
                          //  return d.price1;
                        //})]);
                        // y.domain(d3.extent(filterMonth,function(d){
                        //   return d.price1;
                        //}));
                        y2.domain(d3.extent(filterMonth1,function(d){
                            return d.price1;
                        }));


                        innerchart2.append("g")
                            .attr("transform","translate(0," + height + ")")
                            .call(d3.axisBottom(x2));

                        innerchart2.append("g")
                            .call(d3.axisLeft(y2));

                        innerchart2.append("path")
                            .datum(filterMonth1)
                            .attr("fill", "none")
                            .attr("stroke", "steelblue")
                            .attr("stroke-linejoin", "round")
                            .attr("stroke-linecap", "round")
                            .attr("stroke-width", 1.5)
                            .attr("d", valueline2);

                        // alert("hi");
                    }

                });


            x.domain(d3.extent(filterData1, function(d){
                // d.year = parseDate(d.year);
               // return d.year;
                return parseTime(d.year + "-" + d.month);
            }));

           // y.domain([0,d3.max(filterData1,function(d){
             //   return d.price;
            //})]);
            y.domain(d3.extent(filterData1,function(d){
                return d.price;
            }));



            chart2.append("g")
                .attr("transform","translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .select(".domain");

            chart2.append("g")
                .call(d3.axisLeft(y));

            chart2.append("path")
                .datum(filterData1)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);


            var chart3 = d3.select("#graph")
                .append("svg")
                .attr("width",width + margin.left +margin.right)
                .attr("height",height + margin.top +margin.bottom)
                .append("g")
                .attr("transform","translate(" + margin.left + "," +margin.top +")")
                .on("click",function(){

                    document.getElementById("year2").innerHTML = "";

                    var country1 = d3.map(obj2, function(d){ return d.year;}).keys();
                    // console.log(country1);
                    var drop3 = d3.select("#year2")
                        .on('change',onchange3);

                    drop3.selectAll("option")
                        .data(country1)
                        .enter()
                        .append("option")
                        .text(function(d){
                            return d;
                        });

                    function onchange3(){

                        //document.getElementById("graph1").innerHTML = "";
                        var selectedValue1 = d3.event.target.value;
                        var obj5=[];
                        selectYear = obj2.filter(function(d,i){

                            if(selectedValue1 == d.year){
                                obj5.push({
                                    name1: d.name,
                                    price1: d.price,
                                    month1: d.month,
                                    year1 : d.year
                                });


                                return d.name;
                            };

                        });
                        //console.log(obj3);
                        //console.log(filterItems[0]);
                        // var filterMonth = monthwiseItem(obj3,filterItems[0]);
                        // console.log(filterMonth);
                       // var filterMonth1 = monthwiseItem(obj3,filterItems[1]);
                        //console.log(filterMonth1);
                        var filterMonth2 = monthwiseItem2(obj5,filterItems[2]);
                        console.log(filterMonth2);

                       // document.getElementById("graph1").innerHTML = "";

                        if(dataIndex2 ==1){
                            dataIndex2 = 2;
                        }
                        else{
                            dataIndex2 = 1;
                        }


                        var x3 = d3.scaleTime()
                            .range([0,width]);

                        var y3 = d3.scaleLinear()
                            .range([height,0]);

                        var parseTime = d3.timeParse("%M");

                        var valueline3 = d3.line()
                            .x(function(d){
                                return x3(parseTime(d.month1));
                            })
                            .y(function(d){
                                return y3(d.price1);
                            })

                        var innerchart3 = d3.select("#graph1")
                            .append("svg")
                            .attr("width",width + margin.left +margin.right)
                            .attr("height",height + margin.top +margin.bottom)
                            .append("g")
                            .attr("transform","translate(" + margin.left + "," +margin.top +")");

                        x3.domain(d3.extent(filterMonth2, function(d){
                            // d.year = parseDate(d.year);
                            return parseTime(d.month1);
                        }));
                       // y3.domain([0,d3.max(filterMonth2,function(d){
                         //   return d.price1;
                        //})]);
                        // y.domain(d3.extent(filterMonth,function(d){
                        //   return d.price1;
                        //}));
                        y3.domain(d3.extent(filterMonth2,function(d){
                            return d.price1;
                        }));


                        innerchart3.append("g")
                            .attr("transform","translate(0," + height + ")")
                            .call(d3.axisBottom(x3));

                        innerchart3.append("g")
                            .call(d3.axisLeft(y3));

                        innerchart3.append("path")
                            .datum(filterMonth2)
                            .attr("fill", "none")
                            .attr("stroke", "steelblue")
                            .attr("stroke-linejoin", "round")
                            .attr("stroke-linecap", "round")
                            .attr("stroke-width", 1.5)
                            .attr("d", valueline3);

                        // alert("hi");
                    }

                });

            x.domain(d3.extent(filterData2, function(d){
                // d.year = parseDate(d.year);
                //return d.year;
                return parseTime(d.year + "-" + d.month);
            }));

            y.domain(d3.extent(filterData2,function(d){
                return d.price;
            }));
          //  y.domain([0,d3.max(filterData2,function(d){
            //    return d.price;
            //})]);


            chart3.append("g")
                .attr("transform","translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .select(".domain");

            chart3.append("g")
                .call(d3.axisLeft(y));

            chart3.append("path")
                .datum(filterData2)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

       //console.log(see.data);

           /* function onchange1() {


                var s = worldFood.filter(function (value) {
                    value.adm0_name === selectCountry && value.cm_name === ----
                    return true
                })

            }*/

        }

  //  var drop = $('#item :selected').text();
 //   console.log(drop);




}


function countrywiseItem(obj2,filterItems){

    var selectItem = obj2.filter(function (e){
        if(e.name == filterItems)
            //console.log(e);
            return e;


    });

    return selectItem;


}

function monthwiseItem(obj3,filterItems){

    var selectMonth = obj3.filter(function (d){

        if(d.name1 == filterItems)
            //console.log(d);
            return d;
    });
    
    return selectMonth;
}

function monthwiseItem1(obj4,filterItems){

    var selectMonth = obj4.filter(function (d){

        if(d.name1 == filterItems)
        //console.log(d);
            return d;
    });

    return selectMonth;
}

function monthwiseItem2(obj5,filterItems){

    var selectMonth = obj5.filter(function (d){

        if(d.name1 == filterItems)
        //console.log(d);
            return d;
    });

    return selectMonth;
}




function createVis(errors, worldMap, worldFood)
{
   createMap(errors,worldMap,worldFood);
    createDropdown(worldFood, "#country");
   // createDropdown1(worldFood,"#item");
}

d3.queue()
  // .defer(d3.json,"https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson")
   .defer(d3.json,"https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
   //.defer(d3.json,"map.geojson")
    .defer(d3.csv,"wfp_market_food_prices.csv")
    .await(createVis);


function linkCountries(worldMap){

    for (var j = 0; j < worldMap.features.length; j++) {

        var district1 = worldMap.features[j].properties.name;

      //  console.log(district1);


    }
    return worldMap.features;
}

function linkdata(worldMap, worldFood) {

    for (var i = 0; i < worldFood.length; i++) {

        var countryData = worldFood[i].adm0_name;

        //console.log(countryData);

        for (var j = 0; j < worldMap.features.length; j++) {

            var countries = worldMap.features[j].properties.name;
          //  console.log(countries);

            if(countryData == countries){
                worldMap.features[j].properties.Countryyy = countryData;
                break;
            }
        }



    }
    return worldMap.features;

}