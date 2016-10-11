/*

Data is reported every 5 seconds.  View a plot of the data using
the JSFiddle at:

http://jsfiddle.net/pLa9ncwv/

Raw data at:

http://rose.engineer:8080/streams/28KO4mjOAGfMabmO0al2coLo4jm

*/

var i2c = require('i2c-bus');
var fs = require('fs');
var request = require('request');
var util = require('util');

// Phant setup
var inputUrl = "http://rose.engineer:8080/input/";
var keyPublic = "28KO4mjOAGfMabmO0al2coLo4jm";
var keyPrivate = "vg4n9vZn7WH3BzdX8BGZT4G4zvl";
var urlBase = inputUrl + keyPublic + "?private_key=" + keyPrivate + "&temp1=%s&temp2=%s";

// I2C setup
var bus = 2;
var tmp101 = [0x48, 0x4a];
var sensor = i2c.openSync(bus);

function doRead() {

    console.log("Reading.");

    // Read the temp sensors
    var temp = [];
    for (var i = 0; i < tmp101.length; i++) {
        temp[i] = sensor.readByteSync(tmp101[i], 0x0);
        console.log("temp: %dC, %dF (0x%s)", temp[i], temp[i] * 9 / 5 + 32, tmp101[i].toString(16));
    }

    console.log("Reporting.")

    // Report to Phant
    var url = util.format(urlBase, temp[0], temp[1]);
    request(url, function(error, response, body) {
        if (error || response.statusCode !== 200) {
            console.log("Error!");
            console.log(error + " response=" + JSON.stringify(response));
        } else {
            console.log("Success!");
        }
    });

}

console.log("Ready.");
setInterval(doRead, 5000);
