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
var tooltip = { width: 100, height: 100, x: 10, y: -30 };
var plotWidth = svgMainWidth - svgMainMargin.left - svgMainMargin.right;
var plotHeight = svgMainHeight - svgMainMargin.top - svgMainMargin.bottom;


//Title
svgMain.append("text")
    .attr("x", svgMainWidth / 2)
    .attr("y", 30)
    .attr("font-size", "28px")
    .attr("text-anchor", "middle")
    .text("Diffusion of Technologies in US Households");


const technologyData = async () => {

    //Geo variables
    const techData = await d3.csv("Data/tech.csv", d3.autoType);
    const techDataInitial = await d3.csv("Data/tech_initialValues.csv", d3.autoType);

    const wealthData = await d3.csv("Data/income.csv", d3.autoType);


    console.log(techData);
    console.log(wealthData);

    //Scales

    const yearMin = d3.min(wealthData, d => d.TIME); //X Axis
    const yearMax = d3.max(wealthData, d => d.TIME);



    // const yearMin = 1950;
    // const yearMax = 2010;

    const yearScale = d3.scaleLinear() //X Axis
        .domain([yearMin, yearMax - 1])
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

            svgMain.select("#y2.y.axis").transition().delay(4000).duration(2000)
                .style("opacity", 1);


            svgMain.select("#y2.y.gridlines").transition().delay(3000).duration(1000)
                .style("opacity", 1);

            svgMain.select("#y2.y.axis.label").transition().delay(5000).duration(2000)
                .style("opacity", 1);



            // Add the scatterplot
            plot.selectAll("circle")
                .data(techDataInitial)
                .enter().append("circle")
                .attr("Category", d => d.Category)
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
                .transition().duration(3000).style("opacity", 1).delay(7000)


            // var uniqueLegend = [];


            legendVals = d3.set(techDataInitial.map(function (d) {
                return d.Category
            })).values()
            console.log(legendVals)

            // let categoryMap = {};
            // for (let i = 0; i < techDataInitial.length; i++) {
            //     if (!categoryMap[techDataInitial[i].Category]) {
            //         categoryMap[techDataInitial[i].Category] = 1;
            //         uniqueLegend.push(techDataInitial[i]);
            //     }
            // }

            // var legendData = d3.values(uniqueLegend.map(function (d) {
            //     return d.Category;
            // }))

            svgMain.selectAll("myLegend")
                .data(legendVals)
                .enter()
                .append('g')
                .append("text")
                .attr('x', function (d, i) {
                    return 80 + i * 200
                })
                .attr('y', 60)
                .style("opacity", 0)
                .text(function (d) {
                    return d;
                    // var index = legendData.indexOf(d.Category);
                    // if (index > -1) {
                    //     legendData.splice(index, 1);
                    //     return d.Category;
                    // }
                })

                .style("fill", d => colorScale(d))
                .style("font-size", 15)
                .style("cursor", "hand")
                .on("click", function () {
                    let category = d3.select(this);
                    drawLines(category.text(), category.style("fill"));
                    plot.selectAll("circle").each(function () {
                        let circle = d3.select(this);
                        if (circle.attr("Category") === category.text()) {
                            d3.select(this).transition().duration(1000).style("opacity", 1);
                        } else {
                            d3.select(this).transition().duration(1000).style("opacity", 0);
                        }
                    })
                })
                .transition().duration(3000).delay(6000).style("opacity", 1)



        });;


    function drawLines(currentCategory, color) {
        // console.log("HEEELEELLPPPPP");
        // console.log(currentCategory);
        var categoryData = techData.filter(d => d['Category'] === currentCategory);
        // console.log(categoryData);


        plot.selectAll(".diffusionLine").transition().duration(1000).style("opacity", 0);
        plot.selectAll(".diffusionLine").transition().delay(1000).remove();

        var boxes = new Map();
        //  console.log(boxes);
        categoryData.forEach(d => {
            let key = d.Entity;
            // console.log(key);
            if (boxes.has(key)) {
                let value = boxes.get(key);
                value.push([d.Year, d.Diffusion]);
            } else {
                boxes.set(key, [
                    [d.Year, d.Diffusion]
                ])
            }
            //console.log(d);
        });
        console.log(boxes);



        var diffusionLine = d3.line()
            .x((d, i) => yearScale(d[0]))
            .y((d, i) => diffusionScale(d[1]))


        let keys = boxes.keys();
        let values = boxes.values();


        for (var val of values) {

            var path = plot.append("path");
            path.datum(val)
                .style("opacity", 1)
                .style("stroke", color)
                .style("stroke-width", "2px")
                .style("fill", "none")
                .attr("class", "diffusionLine")
                .attr("d", diffusionLine)
                //.style("opacity", 0)
               // .transition().duration(1000).style("opacity", 1).delay(1000);

            // Variable to Hold Total Length
            var totalLength = path.node().getTotalLength();

            // Set Properties of Dash Array and Dash Offset and initiate Transition
            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition() // Call Transition Method
                .delay(1000)
                .duration(4000) // Set Duration timing (ms)
                .ease(d3.easeLinear) // Set Easing option
                .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

        }

    }

//add tooltips
var focus = plot.append("g")
    .attr("class", "focus")
    .style("display", "none");

focus.append("circle")
    .attr("r", 5);

focus.append("rect")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 50)
    .attr("x", 10)
    .attr("y", -22)
    .attr("rx", 4)
    .attr("ry", 4);

focus.append("text")
    .attr("class", "tooltip-entity")
    .attr("x", 18)
    .attr("y", -2);

focus.append("text")
    .attr("x", 18)
    .attr("y", 18)
    .text("Diffusion:");

focus.append("text")
    .attr("class", "tooltip-diffusion")
    .attr("x", 60)
    .attr("y", 18);

plot.append("rect")
    .attr("class", "overlay")
    .attr("width", 100)
    .attr("height", 100)
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

    function mousemove() {
        focus.attr("transform", "translate(" + yearScale(techData.Year) + "," + diffusionScale(techData.Diffusion) + ")");
        focus.select(".tooltip-entity").text(techData.Entity);
        focus.select(".tooltip-diffusion").text(techData.Diffusion);
    }
}



//Call techData data promise
technologyData();
