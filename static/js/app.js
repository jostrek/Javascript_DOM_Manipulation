// from data.js
var tableData = data;

var submit = d3.select("#filter-btn");
var tbody = d3.select("tbody");
var countrySelect = d3.select("#country");
var stateSelect = d3.select("#state");

function populateSelect(name, data) {
    /*
    // Populate selects 
    */
    data.unshift("N/A");
    var options = d3.select(`${name}`)
        .selectAll("option")
        .data(data)
        .enter()
        .append("option");

    options.text(function (d) {
        return d.toUpperCase();
    })
        .attr("value", function (d) {
            return d.toUpperCase();
        });
}

function populateData(filteredData) {
    /*
    // Adds new rows of data for each UFO sighting.
    */
    d3.select("#alertError").attr("class", "alert alert-danger alert-dismissable hide");
    d3.select("#alertSuccess").attr("class", "alert alert-success alert-dismissable hide");
    tbody.html('');

    if (filteredData.length == 0) {
        d3.select("#alertError").attr("class", "alert alert-danger alert-dismissable in fade");
        d3.select("#alertErrorText").text("No data found.")
        return;
    }

    d3.select("#alertSuccess").attr("class", "alert alert-success alert-dismissable in fade");
    d3.select("#alertSuccessText").text(`${filteredData.length} record(s) found.`);

    filteredData.forEach((ufo) => {
        var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(ufo.datetime);
        var cell = row.append("td");
        cell.text(ufo.city);
        var cell = row.append("td");
        cell.text(ufo.state.toUpperCase());
        var cell = row.append("td");
        cell.text(ufo.country.toUpperCase());
        var cell = row.append("td");
        cell.text(ufo.shape);
        var cell = row.append("td");
        cell.text(ufo.durationMinutes);
        var cell = row.append("td");
        cell.text(ufo.comments);
    });
}

function onCountryChange() {
    /*
    // Populate all the regions based on selected country.
    */
    stateSelect.selectAll("*").remove();
    selectedCountry = d3.select('select').property('value')
    var uniqueRegions = data
        .filter(p => p.country.toLowerCase() === selectedCountry.toLowerCase())
        .map(p => p.state)
        .filter((state, index, data) => data.indexOf(state) == index)
        .sort();

    populateSelect("#state", uniqueRegions);
};

// Select unique shapes from dataset
var uniqueShapes = data
    .map(p => p.shape)
    .filter((shape, index, data) => data.indexOf(shape) == index)
    .sort();

populateSelect("#shape", uniqueShapes);

// Select unique countries from dataset
var uniqueCountry = data
    .map(p => p.country)
    .filter((country, index, data) => data.indexOf(country) == index)
    .sort();

populateSelect("#country", uniqueCountry);
populateSelect("#state", []);
countrySelect.on('change', onCountryChange)
populateData(tableData);

// Complete the click handler for the form
submit.on("click", function () {
    // Prevent the page from refreshing
    d3.event.preventDefault();
    var filteredData = tableData;

    // Datetime
    var datetime = d3.select("#datetime");
    var datetimeValue = datetime.property("value");

    // City
    var city = d3.select("#city");
    var cityValue = city.property("value");

    //State
    var state = d3.select("#state");
    var stateValue = state.property("value");

    //Country
    var country = d3.select("#country");
    var countryValue = country.property("value");

    //Shape
    var shape = d3.select("#shape");
    var shapeValue = shape.property("value");

    // If input value is blank returen all the data
    if (datetimeValue.length == 0 && cityValue.length == 0 && stateValue === 'N/A' && countryValue === 'N/A' && shapeValue === 'N/A') {
        // Display all data
        populateData(filteredData);
        return;
    }

    if (datetimeValue.length > 0)
        filteredData = tableData.filter(element => element.datetime === datetimeValue);
    if (cityValue.length > 0)
        filteredData = filteredData.filter(element => element.city.toLowerCase() === cityValue.toLowerCase());
    if (countryValue != 'N/A')
        filteredData = filteredData.filter(element => element.country.toLowerCase() === countryValue.toLowerCase());
    if (stateValue!= 'N/A' )
        filteredData = filteredData.filter(element => element.state.toLowerCase() === stateValue.toLowerCase());
        console.log(filteredData);
    if (shapeValue != 'N/A')
        filteredData = filteredData.filter(element => element.shape.toLowerCase() === shapeValue.toLowerCase());

    populateData(filteredData);
});