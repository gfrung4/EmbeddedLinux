// The pin that the ALERT interrupt from TMP101 is connected to
var interruptPin = "P9_21";

// Necessary requires
var i2c = require('i2c');
var b = require('bonescript');

// Attach the interrupt for detecting ALERT
b.pinMode(interruptPin, b.INPUT);
b.attachInterrupt(interruptPin, true, b.CHANGE, alertCallback);

// Begin I2C for reading temperature and setting limits
var wire = new i2c(0x48, {
    device: '/dev/i2c-2'
});

// Get the temperature
wire.readBytes(0x00, 1, function(err, res) {
    var tempC = res[0];
    var tempF = tempC * (9 / 5) + 32;
    console.log("The current temperature is: ");
    console.log(tempF + " °F");
    console.log(tempC + " °C");
    console.log("");

    // Set the limits to cause an alert when the temperature rises 2 degrees C
    wire.writeBytes(0x02, [tempC + 1], function(err) {
        wire.writeBytes(0x03, [tempC + 2], function(err) {
            console.log("Temperature limit set to +2°C of current temperature.");
            console.log("Waiting for alert...");
        });
    });
});

/*
Callback to run when an ALERT is detected from the TMP101.
*/
function alertCallback(x) {
    if (x.value === 0) {
        // Announce that an alert was received
        console.log("Alert received!  The temperature is now 2°C greater than before.");

        // Detach the interrupt, it is no longer necessary
        b.detachInterrupt(interruptPin);

        // Get and print the temperature again
        wire.readBytes(0x00, 1, function(err, res) {
            var tempC = res[0];
            var tempF = tempC * (9 / 5) + 32;
            console.log(tempF + " °F");
            console.log(tempC + " °C");
            console.log("");

            // End the program once the temperature is printed for the second time
            process.exit(0);
        });
    }
}
