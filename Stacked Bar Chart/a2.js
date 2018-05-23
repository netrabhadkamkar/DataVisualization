//Name:Netra Bhadkamkar Student ID: 01669577

function createVis(errors, data)
{
    // --- DO NOT CHANGE THIS CODE ---
    data = d3.nest()
        .key(x => x.day)
        .rollup(function(v) { return d3.nest().key(x => x.decade).rollup(vv => parseInt(vv[0].count)).object(v); })
        .entries(data)
        .map(function(d) { let dd = d.value; dd["day"] = d.key; return dd; });
    // --- END ---

    // // print all data
    console.log(data);





    // // print one day's data
   //day = 12;
    //console.log(data.filter(x => x.day == day)[0]);

    // call your own functions from here, or embed code here

    //Calculate count of bike trips.
    data.map(function(d){
        var count =0;
        return Object.keys(d).map(function(v){
            if(v !=="day"){
                // var count =0;
                count+= d[v];
                d.total = count;
            }
        });
    });

    console.log(data);

    var margin ={top:20, right:20,bottom:100, left:250},
        width = 1000- margin.left - margin.right,
        height = 1000-margin.top-margin.bottom;
       // distance=20;

    var keyss = ["-1","10","20","30","40","50","60","70","80","130"];

 //Define X and Y Axis
  var x = d3.scaleBand()
      .domain(data.map(function(d){
          return d.day;
      }))
          .range([0,width])
          .padding(0.2),

         y = d3.scaleLinear()
             //.range([height,0]);
            // .domain([0,d3.max(function (d){
              //   return d.total;
             //})])
             .domain([0,800])
             .range([height - margin.top - margin.bottom,0]);

  //Define color for Decade
        var z = d3.scaleOrdinal(d3.schemeBlues[9]);


        var xAxis = d3.axisBottom(x),

            yAxis = d3.axisLeft(y);
               // .ticks(10);

        //Define SVG
        var svg=d3.select("body")
            .append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom);

          //Append y Axis
            svg.append("g")
               .attr("transform","translate(50,5)")

                .call(yAxis);

            //Append text to y Axis
            svg.append("text")
                .attr("transform","rotate(-90)")
                .attr("y",0)
               .attr("x", 0-(height/2))
                .attr("dy","1em")
                .text("Number of Bike Trips");

           //Append x Axis
            svg.append("g")
                .attr("transform","translate(50,"+ (height - margin.top - margin.bottom)+")")
                .call(xAxis);

            //Append text to x Axis
            svg.append("text")
                .attr("transform","translate(360,800)")
                .text("Day");

        //Create a rectGroup for bars
            var rectGroup = svg.append("g")
                .attr("transform","translate(50,0)");


            rectGroup.append("g")
                .selectAll("g")
                .data(d3.stack().keys(keyss)(data))
                .enter()
                .append("g")
                .attr("fill",function(d){

                    if(d.key == -1)
                        return (d3.rgb("#fdfdfd"));
                       // return(d3.rgb("#f9fcff"));
                       // return (d3.rgb("#ffffff"));
                    else
                        return z(d.key);
                })

                .selectAll("rect")
                .data(function(d){
                        return d;

                    })
                .enter()
                .append("rect")
                .attr("x",function(d){
                    //if(isNaN(d))
                      //  return 0;
                    //else
                        return x(d.data.day);
                })
                .attr("y",function(d){
                    return y(d[1]);
                })
                .attr("height",function(d){
                    return y(d[0]) - y(d[1]);
                })
                .attr("width",20);

          //Define legend
            var legend = svg.append("g")
                .selectAll("g")
                //.data(z)
                .data(d3.stack().keys(keyss)(data))
                //.data(keyss.slice())
                .enter()
                .append("g")
                .attr("transform",function(d,i){
                    return "translate(110,"+ i*20+ ")";
                });

                legend.append("rect")
                    .attr("x", width -19)
                    .attr("width",19)
                    .attr("height",19)
                    .attr("fill",function(d) {

                        if (d.key == -1)
                           return (d3.rgb("#fdfdfd"));
                           // return(d3.rgb("#f9fcff"));
                            //return (d3.rgb("#ffffff"));
                        else
                            //return z(d.key);
                            return z(d.key);
                    });
                legend.append("text")
                    .data(keyss.slice())
                    .attr("x", width - 50)
                    .attr("y",8)
                    .attr("dy","0.5em")
                    .text(function (d){
                        return d;
                    });

}

// --- DO NOT CHANGE THIS CODE ---
d3.csv("https://cdn.rawgit.com/dakoop/3342a08ffaa77fef31c4cca759e6846d/raw/77f18f410caa1be8cf76831fe2b34b0ef88ca683/citibike-jan2018.csv", createVis);
// --- END ---
