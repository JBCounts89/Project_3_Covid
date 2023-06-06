let button = d3.select("#button");

function addPlot() {

  document.getElementById("plot").innerHTML = ""; // Quick-and-dirty way to remove old plot before (re-)creating

  d3.json("http://localhost:5000/data").then(data => {

    let trace = {
      x: data.map(row => row.Date),
      y: data.map(row => row.Value)
    };

    let layout = {
      title: "A Sample Plot"
    };

    Plotly.newPlot("plot", [ trace ], layout);
  });
}

function handleClick() {
  addPlot();
}

button.on("click", handleClick);
