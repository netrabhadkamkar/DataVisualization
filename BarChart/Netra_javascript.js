
var newrefugees = refugees.filter(function(el)   //Filter Year from 1990-2017
{
    return el.Year > 1989

});

//console.log(newrefugees);

//Calculate Total Refugees
    var newrefu = newrefugees.map(function (getTotals)
    {
        return getTotals['Africa'] + getTotals['Asia'] + getTotals['Europe'] + getTotals['Former Soviet Union'] + getTotals['Kosovo'] + getTotals['Latin America/Caribbean'] + getTotals['Near East/South Asia'];
    });

    document.getElementById("sum").innerHTML= newrefu.toString();



//console.log(newrefu);


    function makeElt(name, attrs, appendTo)
    {
        var element = document.createElementNS("http://www.w3.org/2000/svg", name);
        if (attrs === undefined) attrs = {};
        for (var key in attrs)
        {
            element.setAttributeNS(null, key, attrs[key]);
        }
        if (appendTo)
        {
            appendTo.appendChild(element);
        }
        return element;
    }

    var chart= document.getElementById("barchart");
    var svg = makeElt("svg",{"width": 600, "height": 400}, chart);

    //Draw 'X' and 'Y' Axis
    var x_axis=makeElt("line",{"x1": 30, "y1":375, "x2": 480, "y2":375, "stroke": "black", "strokewidth":10 }, svg);
    var y_axis = makeElt("line", {"x1": 30, "y1":20, "x2": 30, "y2":375, "stroke": "black", "strokewidth":5 }, svg);
    var dy=300;
    var maximum=30000;
    var min =[];
    for(var i=0; i<6; i++)
        {
            var value = (maximum)* i;
            min.push(value);
            makeElt("line",{"x1":25, "y1":dy+75, "x2": 480, "y2":dy+75, "stroke":"black", "strokewidth":10}, svg);
            var label_value=makeElt("text",{"x":0,"y":dy+80,"font-size":10},svg);
            label_value.appendChild(document.createTextNode(min[i]));
            dy-=60;
        }

    var dx = 50;
    var year2 = 1990;
    for (var j=0; j<28; j++)
    {

        makeElt("line",{"x1":dx , "y1": 385, "x2": dx, "y2":380, "stroke":"black", "strokewidth":10}, svg);
        var label_year = makeElt("text",{"x":dx-3,"y":393,"transform":"rotate(-90,"+(dx+4)+" ,393)", "font-size":8, "strokewidth":15}, svg);
        label_year.appendChild(document.createTextNode(year2));
        year2 +=1;
        //console.log(year);
        dx +=15;
    }

    //Draw Bars in chart
    var year1 = 1990;
    newrefu.forEach(function (d,i)
    {

         makeElt("rect",{"width": 10, "height":d*0.002, "x":(i+3)*15, "y":375-d*0.002, "id": year1, "style":"fill:teal"},svg);
         year1 +=1;

    } );


    //Highlight Selected Year
    function highlightYear(hover)
    {

        newrefugees.forEach(function (value2) {
            //console.log(value2);
            var aa = document.getElementById(value2.Year);
            aa.style.fill = 'teal';
        });

        var x = document.getElementById(hover);
        console.log(x);
        x.style.fill = "red";


    }


