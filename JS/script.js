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


    let yAxis = d3.axisLeft(wealthScale); // Y axis
    svgMain.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (svgMainMargin.left) + "," + svgMainMargin.top + ")")
        .style("stroke-width", "2px")
        .call(yAxis);


    //Gridlines 

    let xGridlines = d3.axisBottom(yearScale).tickSize(-plotHeight - 10).tickFormat("");
    svgMain.append("g")
        .attr("class", "x gridlines") // X axis
        .attr("transform", "translate(" + svgMainMargin.left + "," + (svgMainMargin.top + plotHeight) + ")")
        .call(xGridlines);


    let yGridlines = d3.axisLeft(wealthScale).ticks(8).tickSize(-plotWidth - 10).tickFormat("");
    svgMain.append("g")
        .attr("class", "y gridlines") // Y axis
        .attr("transform", "translate(" + (svgMainMargin.left) + "," + svgMainMargin.top + ")")
        .call(yGridlines);


    const plot = svgMain.append("g")
        .attr("transform", "translate(" + svgMainMargin.left + "," + svgMainMargin.top + ")");

    wealthData.shift();

   // console.log(wealthArray);
    let len = wealthData.length;
    wealthData.push({TIME:  wealthData[len-1].TIME, Value: wealthMin  });
    wealthData.push({TIME:  yearMin, Value: wealthMin  });

    // console.log(wealthArray);


  // 3. Set up d3's line generator
  var line = d3.line()
        .x(d =>  yearScale(d.TIME))
        .y(d =>  wealthScale(d.Value))
        .curve(d3.curveMonotoneX);

  // d3.line() returns a *function* that accepts a datapoint and spits out the string that goes in the "d" attribute of a <path>

  // Try adding a smoothing function after .x and .y using .curve(func) : .curve(d3.curveMonotoneX), curveStep, curveBasis, curveCardinal


  plot.append("path").attr("class","line")
      .datum( wealthData ) // datum is the single form of .data -- it sends the whole list of data to one element instead of .data mapping each row to an element
        // We need to give d3.line() some .datum to start with, so we provide an empty array
        //  If you already know what your data look like, you can just give it the whole dataset at this point
      .attr("d", line)
      .style("opacity",.5)
      .style("fill", "limegreen");
      // equivalent to .attr("d", d => line(d)), recall that d3.line() returns a function that takes a datapoint parameter



//   // 5. Make a home for some circles too!
//   let circLayer = lineSVG.append("g").attr("transform","translate("+(lineMargin.left)+","+lineMargin.top+")")


//   function updateLineChart(mouseData) {
//     console.log(mouseData);

//     // Update our axes
//     xLineScale.domain([ 0,mouseData.length-1 ]);
//     xLineAxis.ticks(mouseData.length-1 );

//     // Use d3.extent to get min and max in one command
//     // let minMax = d3.extent(mouseData, d => d.mouseY);
//     // console.log(minMax);
//     // yLineScale.domain( minMax );

//     // For now, we are going to set the yLineScale domain based on the **whole window** of the browser
//     yLineScale.domain( [ 0, window.innerHeight ] );

//     // Select the axis <g> tag using a class, then call lineAxis again on them to update. Added a transition() to animate the change
//     lineSVG.select(".x").transition().duration(300).call(xLineAxis);
//     lineSVG.select(".y").transition().duration(300).call(yLineAxis);

//     // Make some circles
//     let circles = circLayer.selectAll("circle").data(mouseData);   // We want to use .data here because we want one circle per row

//     circles.enter().append("circle")
//       .attr("r",4)
//       .style("fill","darkblue")
//       .attr("cx", (d,i) => xLineScale( i ) )
//       .attr("cy", d => yLineScale( d.mouseY ))
//       // Chaining in .merge here adds any of the circles circLayer.selectAll found and let's us run functions on all of them together
//       //  this is good for things you want to UPDATE on existing points and SET for new points
//       .merge(circles)
//       .attr("cx", (d,i) => xLineScale( i ) )
//       .attr("cy", d => yLineScale( d.mouseY ));

//     circles.exit().remove();

//     // Like the axes, we need to get the path to call .line again
//     //  We want to use .datum here because we want one path for all of the rows
//     //  We can add .transition() to animate, but it looks odd
//     lineSVG.select(".line").datum(mouseData).attr("d", line);



//   }







//   // Bind an event listener to the entire page looking for mouse moves every second
//   //  Calls updateLineChart with new data if some new moves are detected
//   var mouseLocations = [];
//   let tickSize = 1000; //in milliseconds
//   let totalTimeWindow = 15; //in seconds
//   let totalTicks = (totalTimeWindow*1000) / tickSize;
//   document.body.addEventListener('mousemove',function(e)
//   {
//     if (mouseLocations.length < 1) {

//       mouseLocations.push( {
//         "mouseX": e.clientX,
//         "mouseY": e.clientY,
//         "time": Math.floor(Date.now() / tickSize)
//       } );
//       updateLineChart(mouseLocations);

//     }
//     else {
//       t = Math.floor(Date.now() / tickSize);

//       // Check if we've reached a new second
//       if (mouseLocations[mouseLocations.length-1].time < t) {
//         mouseLocations.push( {
//           "mouseX": e.clientX,
//           "mouseY": e.clientY,
//           "time": t
//         } );
//         if (mouseLocations.length > totalTicks) {
//           mouseLocations.shift(); // remove last element added
//         }
//         updateLineChart(mouseLocations);
//       }

//     }

//   });




















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