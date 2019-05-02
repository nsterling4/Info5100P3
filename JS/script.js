//Create margins for US map SVG and get dimensions
let svgMain = d3.select("#svgMain");
let svgMainWidth = svgMain.attr("width");
let svgMainHeight = svgMain.attr("height");
var svgMainMargin = {
    top: 70,
    right: 80,
    bottom: 50,
    left: 80
};
var plotWidth = svgMainWidth - svgMainMargin.left - svgMainMargin.right;
var plotHeight = svgMainHeight - svgMainMargin.top - svgMainMargin.bottom;


    //Title
    svgMain.append("text")
        .attr("x", svgMainWidth / 2)
        .attr("y", 30)
        .attr("font-size", "28px")
        .attr("text-anchor", "middle")
        .text("TITLE");


const technologyData = async () => {

    //Geo variables
    const techData = await d3.csv("Data/tech_initialValues.csv", d3.autoType);

    const wealthData = await d3.csv("Data/income.csv", d3.autoType);


    console.log(techData);
    console.log(wealthData);

    //Scales

    const yearMin = d3.min(wealthData, d => d.TIME); //X Axis
    const yearMax = d3.max(wealthData, d => d.TIME);



    // const yearMin = 1950;
    // const yearMax = 2010;

    const yearScale = d3.scaleLinear() //X Axis
        .domain([yearMin, yearMax-1])
        .range([0, plotWidth]);



    const wealthMin = d3.min(wealthData, d => d.Value); //X Axis
    const wealthMinMax = d3.extent(wealthData, d => d.Value) //Y Axis
    const diffusionMinMax = d3.extent(techData, d => d.Diffusion);

    console.log(wealthMinMax);

    var wealthScale = d3.scaleLinear() //Y Axis
        .domain(wealthMinMax)
        .range([plotHeight, 0]);


    const diffusionScale = d3.scaleLinear() //Y Axis
        .domain(diffusionMinMax)
        .range([plotHeight, 0]);




    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


    //Gridlines 

    let xGridlines = d3.axisBottom(yearScale).tickSize(-plotHeight).tickFormat("");
    svgMain.append("g")
        .attr("class", "x gridlines") // X axis
        .attr("transform", "translate(" + svgMainMargin.left + "," + (svgMainMargin.top + plotHeight) + ")")
        .call(xGridlines);


    let yGridlines = d3.axisLeft(wealthScale).ticks(11).tickSize(-plotWidth).tickFormat("");
    svgMain.append("g")
        .attr("class", "y gridlines") // Y axis
        .attr("id", "y1") // Y axis
        .attr("transform", "translate(" + (svgMainMargin.left) + "," + svgMainMargin.top + ")")
        .call(yGridlines);


    let y2Gridlines = d3.axisLeft(diffusionScale).ticks(11).tickSize(-plotWidth).tickFormat("");
    svgMain.append("g")
        .attr("class", "y gridlines") // Y axis
        .attr("id", "y2") // Y axis
        .attr("transform", "translate(" + (svgMainMargin.left) + "," + svgMainMargin.top + ")")
        .style("opacity", 0)
        .call(y2Gridlines);


    //Axis
    let xAxis = d3.axisBottom(yearScale).tickFormat(d3.format("~g"));
    svgMain.append("g")
        .attr("class", "x axis") // X axis
        .attr("transform", "translate(" + svgMainMargin.left + "," + (svgMainMargin.top + plotHeight) + ")")
        .style("stroke-width", "2px")
        .style("font-size", "18px")
        .call(xAxis);


    let yAxis = d3.axisLeft(wealthScale).tickFormat(d3.format("$,~g")); // Y axis
    svgMain.append("g")
        .attr("class", "y axis")
        .attr("id", "y1")
        .attr("transform", "translate(" + (svgMainMargin.left) + "," + svgMainMargin.top + ")")
        .style("stroke-width", "2px")
        .call(yAxis);


    //right Y Axis
    let y2Axis = d3.axisLeft(diffusionScale).tickFormat(d3.format(".0%"));
    svgMain.append("g")
        .attr("class", "y axis")
        .attr("id", "y2")
        .attr("transform", "translate(" + (svgMainMargin.left) + "," + svgMainMargin.top + ")")
        .style("stroke-width", "2px")
        .style("opacity", 0)
        .style("font-size", "18px")
        .call(y2Axis);



    // x label
    svgMain.append("text")
        .attr("class", "x axis label")
        .attr("x", svgMainWidth / 2)
        .attr("y", svgMainHeight - 8)
        .attr("font-size", "18px")
        .attr("text-anchor", "middle")
        .text("Year");

    // y label
    svgMain.append("text")
        .attr("class", "y axis label")
        .attr("id", "y1")
        .attr("x", -svgMainHeight / 2)
        .attr("y", 20)
        .attr("font-size", "18px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Median Income");

    // y2 label
    svgMain.append("text")
        .attr("class", "y axis label")
        .attr("id", "y2")
        .attr("x", -svgMainHeight / 2)
        .attr("y", 20)
        .attr("font-size", "18px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("opacity", 0)
        .text("Diffusion");





    const plot = svgMain.append("g")
        .attr("transform", "translate(" + svgMainMargin.left + "," + svgMainMargin.top + ")");

    wealthData.shift();
    wealthData.pop();

    let zeroArray = [];
    for (let i = 0; i < wealthData.length; i++) {
        zeroArray.push([yearScale(wealthData[i].TIME), wealthScale(wealthMin)])
    }

    let wealthArray = [];
    for (let i = 0; i < wealthData.length; i++) {
        wealthArray.push([yearScale(wealthData[i].TIME), wealthScale(wealthData[i].Value)])
    }

    let len = wealthData.length;

    wealthArray.push([yearScale(wealthData[len - 1].TIME), wealthScale(wealthMin)]);
    wealthArray.push([yearScale(yearMin), wealthScale(wealthMin)]);



    //3. Set up d3's line generator

    var line = d3.line().curve(d3.curveMonotoneX);

    var line2 = d3.line()
        .x(d => yearScale(d.TIME))
        .y(d => wealthScale(d.Value))
        .curve(d3.curveMonotoneX);

    // d3.line() returns a *function* that accepts a datapoint and spits out the string that goes in the "d" attribute of a <path>

    // Try adding a smoothing function after .x and .y using .curve(func) : .curve(d3.curveMonotoneX), curveStep, curveBasis, curveCardinal



    plot.append("path").attr("class", "line")
        .attr('d', line(zeroArray))
        .style("opacity", .5)
        .style("fill", "limegreen")
        .transition()
        .attr('d', line(wealthArray))
        .delay(500).duration(2000).ease(d3.easeBackOut)

        .on("end", function () { // on end of transition...


            // svgMainMargin = {
            //     top: 30,
            //     right: 100,
            //     bottom: 50,
            //     left: 80
            // };

            // plotWidth = svgMainWidth - svgMainMargin.left - svgMainMargin.right;

            // wealthScale = d3.scaleLinear() //Y Axis
            // .domain(wealthMinMax)
            // .range([plotHeight, 0]);

            svgMain.select("#y1.y.axis").transition().duration(2000).delay(1000)
                .attr("transform", "translate(" + (svgMainMargin.left + plotWidth) + "," + svgMainMargin.top + ")")
                .style("font-size", "10px");

            svgMain.selectAll("#y1.y.axis text").transition().delay(2000).duration(500)
                .attr("transform", "translate(" + 50 + "," + 0 + ")");

            svgMain.selectAll("#y1.y.axis line").transition().delay(2000).duration(500)
                .style("opacity", 0);

            svgMain.select("#y1.y.axis.label").transition().delay(700).duration(1000)
                .style("opacity", 0)
                .transition().duration(500)
                .attr("transform", "rotate(90)")
                .attr("x", svgMainHeight / 2)
                .attr("y", -svgMainWidth + 20)
                .style("font-size", "12px")
                .transition().delay(200).style("opacity", 1).duration(1000);


            d3.select("#y1.y.gridlines").transition().delay(50).duration(2000)
                .style("opacity", 0);

            svgMain.select("#y2.y.axis").transition().delay(3000).duration(1000)
                .style("opacity", 1);


            svgMain.select("#y2.y.gridlines").transition().delay(3000).duration(1000)
                .style("opacity", 1);

            svgMain.select("#y2.y.axis.label").transition().delay(4000).duration(1000)
                .style("opacity", 1);



            // Add the scatterplot
            plot.selectAll("circle")
                .data(techData)
                .enter().append("circle")
                .attr("Category",d => d.Category)
                .attr("r", 5)
                .attr("cx", function (d) {
                    return yearScale(d.Year);
                })
                .attr("cy", function (d) {
                    return diffusionScale(d.Diffusion);
                })
                .style("fill", d => colorScale(d.Category))
                .style("opacity", 0)
                .on("click", function (d) {
                    console.log(d);
                })
                .transition().duration(5000).style("opacity", 1).delay(5000)

            var legend1 = {
                value: "communication",
                color: "red",
                sub: ["a", "b", "c", "d"]
            }

            var uniqueLegend = [];
            let categoryMap = {};
            for (let i = 0; i < techData.length; i++) {
                if (!categoryMap[techData[i].Category]) {
                    categoryMap[techData[i].Category] = 1;
                    uniqueLegend.push(techData[i]);
                }
            }

            var legendData = d3.values(uniqueLegend.map(function (d) {
                return d.Category;
            }))
            plot.selectAll("myLegend")
                .data(techData)
                .enter()
                .append('g')
                .append("text")
                .attr('x', function (d, i) {
                    return 30 + i * 300
                })
                .attr('y', 10)
                .text(function (d) {
                    var index = legendData.indexOf(d.Category);
                    if (index > -1) {
                        legendData.splice(index, 1);
                        return d.Category;
                    }
                })
                .style("fill", d => colorScale(d.Category))
                .style("font-size", 15)
                .on("click", function() {
                    let category = d3.select(this);
                   // console.log("category");
                   // console.log(category.text());
                    plot.selectAll("circle").each(function() {
                      let circle = d3.select(this);
                     //console.log("circle");
                      //console.log(circle);
                      console.log(circle.attr("Category"));
                      if (circle.attr("Category") === category.text()) {
                       d3.select(this).transition().duration(1000).style("opacity", 1);
                       // console.log("if");
                      }
                      else {
                       // console.log("else");
                       d3.select(this).transition().duration(1000).style("opacity", 0);
                      }
                    })
                  })
                // .on("click", function (d) {
                //     console.log(this);
                //     // is the element currently visible ?
                //     currentOpacity = d3.selectAll("." + d.Category).style("opacity", 1);
                //     // Change the opacity: from 0 to 1 or from 1 to 0
                //     d3.selectAll("." + d.Category).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

                // })

        });;





}



//Call techData data promise
technologyData();