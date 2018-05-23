var left;
var right;
var slider;

function createMap(mapData, divId) {


    var w=800,h=600;
    var svg = d3.select(divId).append("svg").attr("id","distt")
        .attr("width", w)
        .attr("height", h);

    var proj = d3.geoConicConformal()
        .parallels([41 + 43/60, 42 + 41/60])
        .rotate([71 + 1/2, -41])
        .fitExtent([[10,10],[w-20,h-20]], mapData);

    var path = d3.geoPath().projection(proj);

    var features = mapData.features;

    //console.log(features);
    svg.selectAll(".district")
        .data(features)
        .enter().append("path")
        .attr("d", path)
        .attr("id", function(d) { return "A"+ d.properties.ORG_CODE; })
        .attr("class", "district")
        .style("fill", "red")
        .style("fill-opacity", 0.3)
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .append("title").text(function(d) { return d.properties.ORG_CODE.slice(1,4) + ': ' + d.properties.DISTRICT; });
    return svg;
}

function createDropdown(mapData, divId) {
    // populate the select dropdown
    // and specify the change callback
//console.log(mapData);
    var district = ["All","Regional Vocational Technical","County Agriculture","Independent Public","Independent Vocational","Local School","Charter - Commonwealth","Charter - Horace Mann"];

    var drop = d3.select('#district-type')
        .on('change', onchange);

    drop.selectAll("option")
        .data(district)
        .enter()
        .append("option")
        .text(function(d){
            return d;
        });

   function data(mapData, districts) {

       left = slider.noUiSlider.get()[0];
       right = slider.noUiSlider.get()[1];
      // console.log(left);

       var dist = mapData.features.filter(function (e) {



           if(e.properties.STARTGRADE == "PK"){

               e.properties.STARTGRADE = -1;
           }
           //console.log(left);

           if(e.properties.STARTGRADE == "K"){

               e.properties.STARTGRADE = 0;
           }

           if(e.properties.ENDGRADE == "PK"){
               e.properties.ENDGRADE = -1;
           }
           if(e.properties.ENDGRADE =="K"){
               e.properties.ENDGRADE = -1;
           }

          if (e.properties.MADISTTYPE == districts)
               return e;
       });

       //console.log(dist);
       return dist;

      //console.log(dist);
   }


    var slide = createSlider(divId);

  //Create Dropdown

   var all= mapData.features;
      //console.log(all);
   var rvt = data(mapData,'Regional Vocational Technical');
  // console.log(rvt);
   var countyAgri = data(mapData,'County Agricultural');
   var indpublic = data(mapData,'Independent Public');
   var indvocational = data(mapData,'Independent Vocational');
    var localschool =data(mapData, 'Local School');
   // console.log(localschool);
    var charcommon = data(mapData,'Charter - Commonwealth');
    var  chm = data(mapData,'Charter - Horace Mann');

    //Fill color
    function selectDist(selectDistrict){
        var svg = d3.select("#distt")
        svg.selectAll(".district")
            .style("fill", "none");

        for(var i=0; i< selectDistrict.length; i++){

            svg.selectAll("#A"+ selectDistrict[i].properties.ORG_CODE)
                .data(selectDistrict).style("fill","red");

        }


    }

    //On Change function for dropdown
    function onchange(){
        var dID = document.getElementById('district-type');

        switch (dID.value){
            case 'All': selectDist(all);
            break;
            case 'Regional Vocational Technical' : selectDist(rvt);
            break;
            case 'County Agriculture': selectDist(countyAgri);
            break;
            case 'Independent Public': selectDist(indpublic);
            break;
            case 'Independent Vocational': selectDist(indvocational);
            break;
            case 'Local School': selectDist(localschool);
            break;
            case 'Charter - Commonwealth': selectDist(charcommon);
            break;
            case 'Charter - Horace Mann': selectDist(chm);




        }
    }


}

function createSlider(divId) {
    slider = document.querySelector(divId);
    noUiSlider.create(slider, {
        start: [-1, 12],
        range: { 'min': [-1],
            'max': [12]},
        connect: true,
        step: 1,
        pips: {
            mode: 'steps',
            density: 2000,
            stepped: true,
            filter: d => 1,
        format: {
            to: d => d === -1 ? "PK" : (d === 0 ? "K" : d),
        from: d => d === -1 ? "PK" : (d === 0 ? "K" : d)
}
}
});
    // specify the change callback

    slider.noUiSlider.on('update',function(slidervalue, handle){
        left= slidervalue[0];
         right= slidervalue[1];

    })
}

function createHistogram(spendingData, divId, mapData) {
   // var width = 480,
    var width = 500,
       height = 320;
        //height = 1000;

 //   var data1 = spendingData.filter(function (e) {
   //     if (e.TTPP)
     //       return e.TTPP;
    //});



    var data1 = spendingData.map(function (e){
        if(e.TTPP)
            return parseInt(e.TTPP);
    });
  //  console.log(data1);

    var dataa = data1.filter(function(e){
        return e!=undefined;
    })


   // console.log(dataa);

    var svg = d3.select(divId).append("svg")
        .attr("width", width)
        .attr("height", height);

    var margin = {top: 10, right: 30, bottom: 30, left: 30};
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   var x = d3.scaleLinear()
   // .domain([0,20000]).nice(20)
     // .domain([11000,d3.max(data1)])
      .domain([11000,37000])
       //.domain([11000,d3.max(dataa)])
        .rangeRound([0, width]);

   var bins = d3.histogram()
       .domain(x.domain())
       .thresholds(x.ticks(20))
      (data1);
       //(dataa);

   //console.log(bins);

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d){
            return d.length;
        })])
        .range([height, 0]);

    // delete these lines and create a histogram from the spending data here!
   // var ticks = x.ticks();
    //var data = ticks.map(() => Math.floor(Math.random() * Math.floor(100)));

var bar = g.selectAll(".bar")
    .data(bins)
    .enter()
    .append("g")
    .attr("class","bar")
    .attr("transform",function(d){
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    });

bar.append("rect")
    //.attr("x", 1)
    .attr("x",function(d){
        return x(d.x);
    })
    .attr("y", function(d){
        return height - y(d.y);
    })
   .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
   // .attr("width", function(d){
   // return x(d.x1) - x(d.x0) - 1;
    //})
        .attr("height", function(d){
        return height - y(d.length);
    })
  //  .attr("id",function(d,i){
    //    return i;
    //})
   // .attr("id","")
    .on("mouseover",function(d,i){
        d3.select(this)
            .attr("fill","red")
        //console.log(d);

        var linkeddata =linkdata(spendingData,mapData);

        console.log(linkeddata);

          d.forEach(function (e, i) {

              var trry = spendingData.filter(function (a) {

                  if (d[i] == parseInt(a.TTPP)){
                      console.log(d[i]);
                      return true;
                     // return a.District;
                  }


              });
              console.log(trry);
                var allDistrict = trry.map(function (value) {
                    return value.District;
                    //return value.TTPP;
                });
            //console.log(allDistrict);
              var netra = updateMap(allDistrict);

          });
        //console.log(mapData);


     //Function to update Map color according to mouseover
          function updateMap(District){

              var svg = d3.selectAll("#linked-highlighting-map")
                            .selectAll(".district");

                    var linkeddata = svg.data();

                    console.log(linkeddata);

          // var mapData =  svg.data();

          // console.log(mapData);


        for(var i=0; i<District.length; i++)
        {
           //mapData = mapData.map(function(e,j){
            linkeddata = linkeddata.map(function(e){


              // console.log();

              if(e.properties.DISTRICT == District[i])
               // if(e.properties.TTPP == District[i])
                {
                    e.properties.Data = "mapp";

                }
                //console.log(e);
                return e;

            });
        }

              svg.selectAll(".district")
                  .style("fill", "none");


           svg.selectAll(".district")
                .data(linkeddata)
                 .attr('fill',function(d) {

                    if(d.properties.Data == "mapp") {

                        return "red";
                    }
                    else {
                        return "none";
                    }
                 });


                  // console.log( svg.data());
          }


    })

   .on("mouseout",function(d,i){
       d3.select(this).attr("fill",function(){
            return "black";
        });
    });

    g.append("g")
        .attr("class","axis")
        .attr("transform","translate(0," + height + ")")
        .call(d3.axisBottom(x));


}

function createLinked(mapData, spendingData, divId) {
    d3.select(divId).append('div')
        .attr("id", divId.substring(1) + '-map');
    d3.select(divId).append('div')
        .attr("id", divId.substring(1) + '-hist');

    createMap(mapData, divId + '-map');
    createHistogram(spendingData, divId + '-hist', mapData);

    // add event handlers to implement linked highlighting

   // console.log(mapData);
   // var linkeddata =linkdata(spendingData,mapData);
    //console.log(linkeddata);
}

function createVis(errors, mapData, spendingData)
{
    createSlider('#grade-level');
    createMap(mapData, "#district-map");
    createDropdown(mapData,'#district-type');
    //createSlider('#grade-level');
    createHistogram(spendingData, '#histogram', mapData)
    createLinked(mapData, spendingData, '#linked-highlighting')
  //var linkeddata =linkdata(spendingData,mapData);
    //console.log(linkeddata);
}

d3.queue().defer(d3.json, "https://cdn.rawgit.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-districts-100.geojson")
// use this version if the 100m version is too slow
//.defer(d3.json, "https://cdn.rawgit.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-districts-500.geojson")
    .defer(d3.csv, "https://gist.githubusercontent.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-funding.csv")
    .await(createVis);


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