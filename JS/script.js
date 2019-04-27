//Create margins for US map SVG and get dimensions
let svgMain = d3.select("#svgMain");
let svgMainWidth = svgMain.attr("width");
let svgMainHeight = svgMain.attr("height");
let svgMainMargin = {
    top: 30,
    right: 50,
    bottom: 50,
    left: 60
};
const plotWidth = svgMainWidth - svgMainMargin.left - svgMainMargin.right;
const plotHeight = svgMainHeight - svgMainMargin.top - svgMainMargin.bottom;




const technologyData = async () => {

    //Geo variables
    const techData = await d3.csv("Data/tech.csv", d3.autoType);

    const wealthData = await d3.csv("Data/income.csv", d3.autoType);


    console.log(techData);
    console.log(wealthData);

    //Scales

    const yearMin = d3.min(wealthData, d => d.TIME); //X Axis
    const yearMax = d3.max(wealthData, d => d.TIME);



    // const yearMin = 1950;
    // const yearMax = 2010;

    const yearScale = d3.scaleLinear() //X Axis
        .domain([yearMin, yearMax])
        .range([0, plotWidth]);



    const wealthMin = d3.min(wealthData, d => d.Value); //X Axis
    const wealthMinMax = d3.extent(wealthData, d => d.Value) //Y Axis
    const diffusionMinMax = d3.extent(techData, d => d.Diffusion);

    console.log(wealthMinMax);

    const wealthScale = d3.scaleLinear() //Y Axis
        .domain(wealthMinMax)
        .range([plotHeight, 0]);


    const diffusionScale = d3.scaleLinear() //Y Axis
        .domain(diffusionMinMax)
        .range([plotHeight, 0]);




    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


    //Axis
    let xAxis = d3.axisBottom(yearScale).tickFormat(d3.format("~g"));
    svgMain.append("g")
        .attr("class", "x axis") // X axis
        .attr("transform", "translate(" + svgMainMargin.left + "," + (svgMainMargin.top + plotHeight) + ")")
        .style("stroke-width", "2px")
        .call(xAxis);


    let yAxis = d3.axisLeft(wealthScale).tickFormat(d3.format("$,~g")); // Y axis
    svgMain.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (svgMainMargin.left) + "," + svgMainMargin.top + ")")
        .style("stroke-width", "2px")
        .call(yAxis);

    //right Y Axis
    let y2Axis = d3.axisLeft(diffusionScale).tickFormat(d3.format(".0%"));
    svgMain.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (svgMainMargin.left + plotWidth) + "," + svgMainMargin.top + ")")
        .style("stroke-width", "2px")
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
        .attr("x", -svgMainHeight / 2)
        .attr("y", 20)
        .attr("font-size", "18px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Median Income");


    //Gridlines 

    let xGridlines = d3.axisBottom(yearScale).tickSize(-plotHeight).tickFormat("");
    svgMain.append("g")
        .attr("class", "x gridlines") // X axis
        .attr("transform", "translate(" + svgMainMargin.left + "," + (svgMainMargin.top + plotHeight) + ")")
        .call(xGridlines);


    let yGridlines = d3.axisLeft(wealthScale).ticks(11).tickSize(-plotWidth).tickFormat("");
    svgMain.append("g")
        .attr("class", "y gridlines") // Y axis
        .attr("transform", "translate(" + (svgMainMargin.left) + "," + svgMainMargin.top + ")")
        .call(yGridlines);


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
            d3.select(".y")
                .transition() // second transition
            // .style("opacity", 0);
        });;


    // Add the scatterplot
    plot.selectAll("dot")
        .data(techData)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
            return yearScale(d.Year);
        })
        .attr("cy", function (d) {
            return diffusionScale(d.Diffusion);
        })
        .style("fill", d => colorScale(d.Category))
        .on("click", function (d) {
            console.log(d);
        });


}



//Call techData data promise
technologyData();