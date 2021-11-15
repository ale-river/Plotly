// Module 12. Plotly

/*
 * Generate Dropdown Menu Items: ID numbers.
 */
function init() {
    var selector = d3.select('#selDataset');
  
    d3.json('samples.json').then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector.append('option').text(sample).property('value', sample);
      });
      
      // Use the first sample from the list to build the initial plots
      var initialSample = sampleNames[0];
      buildMetadata(initialSample);
      buildCharts(initialSample);
    });
  }
  
  init();
  /*
  ! NOTE: optionChanged is called when a change takes place in this tag in the HTML. 
  ! this.value = newSample = ID number
  */
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  /*
   * Print information to the "Demographic Info" once a user selects an ID number.
   */
  function buildMetadata(sample) {
    d3.json('samples.json').then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
      var pairs = Object.entries(resultArray[0]);
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select('#sample-metadata');
  
      // Use `.html("") to clear any existing metadata
      PANEL.html('');
      var results = pairs.forEach(function (pair) {
        PANEL.append('h6').text(pair[0] + ': ' + pair[1]);
      });
    });
  }

  // Challenge:

  /*
   * Build the charts once a user selects an ID number.
   */
  function buildCharts(sample) {
    d3.json('samples.json').then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var result = resultArray[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var  ids = result.otu_ids;
      var labels = result.otu_labels.slice(0, 10).reverse();
      var values = result.sample_values.slice(0,10).reverse();
  
      var bubbleLabels = result.otu_labels;
      var bubbleValues = result.sample_values;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
  
      console.log(yticks)
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: values,
        y: yticks,
        type: "bar",
        orientation: "h",
        text: labels 
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
       title: "Top 10 Bacteria Cultures Found"
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
  
  
  // DELIVERABLE 2 Requirements
  // Create a Bubble Chart
  
  
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: ids,
        y: bubbleValues,
        text: bubbleLabels,
        mode: "markers",
         marker: {
           size: bubbleValues,
           color: bubbleValues,
           colorscale: "Portland" 
         }
      }];
    
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          xaxis: {title: "OTU ID"},
          automargin: true,
          hovermode: "closest"
      };
    
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout)
  
  // DELIVERABLE 3 Requirements
  // Create a Gauge Chart
  
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata;
      var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);  
  
      // 2. Create a variable that holds the first sample in the metadata array.
          var gaugeResult = gaugeArray[0];
  
      // 3. Create a variable that holds the washing frequency.  
      var wfreqs = gaugeResult.wfreq;
      console.log(wfreqs)
  
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        value: wfreqs,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
        gauge: {
          axis: {range: [null,10], dtick: "2"},
  
          bar: {color: "black"},
          steps:[
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "green"}
          ],
          dtick: 2
        }
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
       automargin: true
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout)
    });
  }