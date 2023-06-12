// Fetch the data from the Flask API
function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error('Error:', error);
    });
}

// Extract a specific key from each row of data
function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

// Generate a line chart for total vaccinations over time
function generateLineChart(data) {
  // Prepare the data for the line chart
  let chartData = data.map(row => ({
    Date: new Date(row.Date),
    TotalVaccinations: row["Total Vaccinations"]
  }));

  // Sort the data by date in ascending order
  chartData.sort((a, b) => a.Date - b.Date);

  // Set up the line chart layout
  let layout = {
    title: "Total Vaccinations Over Time",
    xaxis: {
      title: "Date",
      type: "date"
    },
    yaxis: {
      title: "Total Vaccinations"
    }
  };

  // Create the line chart trace
  let trace = {
    x: chartData.map(row => row.Date),
    y: chartData.map(row => row.TotalVaccinations),
    type: "scatter",
    mode: "lines",
    name: "Total Vaccinations"
  };

  // Generate the line chart
  Plotly.newPlot("line-chart", [trace], layout);
}

// Generate a bar chart for daily vaccinations by state
function generateBarChart(data) {
  // Prepare the data for the bar chart
  let chartData = data.map(row => ({
    State: row.State,
    DailyVaccinations: row["Daily Vaccinations"]
  }));

  // Sort the data by daily vaccinations in descending order
  chartData.sort((a, b) => b.DailyVaccinations - a.DailyVaccinations);

  // Set up the bar chart layout
  let layout = {
    title: "Daily Vaccinations by State",
    xaxis: {
      title: "State"
    },
    yaxis: {
      title: "Daily Vaccinations"
    }
  };

  // Create the bar chart trace
  let trace = {
    x: chartData.map(row => row.State),
    y: chartData.map(row => row.DailyVaccinations),
    type: "bar",
    name: "Daily Vaccinations"
  };

  // Generate the bar chart
  Plotly.newPlot("bar-chart", [trace], layout);
}

// Generate a map visualization of vaccination rates
function generateMap(data) {
  // Prepare the data for the map visualization
  let mapData = data.map(row => ({
    State: stateCodes[row.State],
    VaccinationRate: row["Vaccination Rate"]
  }));

  // Calculate the average vaccination rate per state
  let state_count = {};
  let filtered_data = {};

  for (let i = 0; i < mapData.length; i++) {
    if (mapData[i].VaccinationRate) {
      if (filtered_data[mapData[i].State] == undefined) {
        filtered_data[mapData[i].State] = 0;
      }
      if (state_count[mapData[i].State] == undefined) {
        state_count[mapData[i].State] = 0;
      }
      state_count[mapData[i].State] += 1;
      filtered_data[mapData[i].State] += mapData[i].VaccinationRate;
    }
  }

  // Calculate the average vaccination rate per state
  let output_list = [];

  for (key in filtered_data) {
    filtered_data[key] = filtered_data[key] / state_count[key];
    output_list.push({
      State: key,
      VaccinationRate: filtered_data[key]
    });
  }

  // Set up the map layout
  let layout = {
    title: "Vaccination Rates by State",
    geo: {
      scope: "usa",
      projection: {
        type: "albers usa"
      },
      showlakes: true,
      lakecolor: 'rgb(255,255,255)'
    }
  };

  // Create the map trace
let output_data = [{
  type: "choropleth",
  locations: unpack(output_list, 'State'),
  z: unpack(output_list, 'VaccinationRate'),
  locationmode: "USA-states",
  colorscale: [
    [0, 'rgb(204, 229, 255)'],  // Lightest shade of blue
    [0.2, 'rgb(153, 204, 255)'],
    [0.4, 'rgb(102, 178, 255)'],
    [0.6, 'rgb(51, 153, 255)'],
    [0.8, 'rgb(0, 128, 255)'],
    [1, 'rgb(0, 102, 204)']      // Darkest shade of blue
  ],
  colorbar: {
    title: "Vaccination Rate"
  }
}];

  // Generate the map visualization
  Plotly.newPlot("choroplethMap", output_data, layout);
}

// Event listener for the button click
d3.select("#button").on("click", function() {
  // Fetch the data from the Flask API
  fetchData("http://127.0.0.1:5000/data")
    .then(data => {
      console.log(data)
      // Generate the selected visualization based on the fetched data
      let visualization = document.getElementById("visualization").value;
      switch (visualization) {
        case "line-chart":
          generateLineChart(data);
          break;
        case "bar-chart":
          generateBarChart(data);
          break;
        case "choroplethMap":
          console.log("here")
          generateMap(data);
          break;
        default:
          console.error("Invalid visualization selected");
      }
    });
});

// State codes mapping
const stateCodes = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  "American Samoa": "AS",
  "District of Columbia": "DC",
  Guam: "GU",
  "Northern Mariana Islands": "MP",
  "Puerto Rico": "PR",
  "U.S. Virgin Islands": "VI"
};
