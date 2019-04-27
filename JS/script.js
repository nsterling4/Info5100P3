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

    const wealthData = await d3.csv("Data/wealth.csv", d3.autoType);


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
        .attr("transform", "translate(" + svgMainMargin.left + "," + (svgMainMargin.top + plotHeight + 10) + ")")
        .style("stroke-width", "2px")
        .call(xAxis);


    let yAxis = d3.axisLeft(wealthScale); // Y axis
    svgMain.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (svgMainMargin.left - 10) + "," + svgMainMargin.top + ")")
        .style("stroke-width", "2px")
        .call(yAxis);


    //Gridlines 

    let xGridlines = d3.axisBottom(yearScale).tickSize(-plotHeight - 10).tickFormat("");
    svgMain.append("g")
        .attr("class", "x gridlines") // X axis
        .attr("transform", "translate(" + svgMainMargin.left + "," + (svgMainMargin.top + plotHeight + 10) + ")")
        .call(xGridlines);


    let yGridlines = d3.axisLeft(wealthScale).ticks(8).tickSize(-plotWidth - 10).tickFormat("");
    svgMain.append("g")
        .attr("class", "y gridlines") // Y axis
        .attr("transform", "translate(" + (svgMainMargin.left - 10) + "," + svgMainMargin.top + ")")
        .call(yGridlines);


    const plot = svgMain.append("g")
        .attr("transform", "translate(" + svgMainMargin.left + "," + svgMainMargin.top + ")");





    //     //  Credit Prof. Rz. Adapted as needed
    //     const legendBox = d3.select("#usaMapLegend");
    //     const legendBoxWidth = legendBox.attr("width");
    //     const legendBoxHeight = legendBox.attr("height");
    //     const barHeight = 25;
    //     const stepSize = 5;


    //     let legendMargin = {
    //         top: 40,
    //         right: 10,
    //         bottom: 20,
    //         left: 10
    //     };
    //     const legendWidth = legendBoxWidth - legendMargin.left - legendMargin.right;
    //     const legendHeight = legendBoxHeight - legendMargin.top - legendMargin.bottom;


    //     const pixelScale = d3.scaleLinear()
    //         .domain([0, legendWidth])
    //         .range([minMax[0], minMax[1]]); // In this case the "data" are pixels, and we get numbers to use in colorScale
    //     const barScale = d3.scaleLinear()
    //         .domain([minMax[0], minMax[1]])
    //         .range([0, legendWidth]);
    //     const barAxis = d3.axisBottom(barScale);


    //     legendBox.html("");


    //     legendBox.append("g")
    //         .attr("class", "legendAxis")
    //         .style("stroke", "white")
    //         .style("stroke-width", ".5px")
    //         .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")")
    //         .call(barAxis);

    //     // Draw rects of color down the bar
    //     let bar = legendBox.append("g").attr("transform", "translate(" + (10) + "," + (10) + ")")
    //     for (let i = 0; i < legendWidth; i = i + stepSize) {
    //         bar.append("rect")
    //             .attr("x", i)
    //             .attr("y", 0)
    //             .attr("width", stepSize)
    //             .attr("height", barHeight)
    //             .style("fill", colorScale(pixelScale(i))); // pixels => countData => color
    //     }

    // }








}



//Call techData data promise
technologyData();