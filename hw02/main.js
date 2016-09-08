// Define the width and height of the Etch-A-Sketch
var width = 20;
var height = 20;

// Prepare to receive input from keyboard
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', function(key) {
    if (key === '\u0003') {
        process.exit();
    }
    if (key.length === 3) {
        etch.move(key.charCodeAt(2) - 65);
        etch.mark();
        etch.show();
    }
});

// Prepare to receive input from buttons
var b = require('bonescript');

// Turn off all lights
for (var i = 0; i < 4; i++) {
    b.pinMode('P9_' + (12 + 2 * i), b.OUTPUT);
    b.digitalWrite('P9_' + (12 + 2 * i), b.LOW);
}

// Prepare button inputs
for (var i = 0; i < 4; i++) {
    b.pinMode("P9_" + (2 * i + 11), b.INPUT, 7, 'pulldown');
    b.attachInterrupt("P9_" + (2 * i + 11), true, b.CHANGE, press);
}

// To run when button is pressed
function press(x) {
    var pinNumber = parseInt(x.pin.key.substring(x.pin.key.indexOf("_") + 1));
    var ledNumber = (pinNumber - 11) / 2;

    if (x.value === 1) {
        b.digitalWrite('P9_' + (12 + 2 * ledNumber), b.HIGH);
        etch.move(ledNumber);
        etch.mark();
        etch.show();
    }
    if (x.value === 0) {
        b.digitalWrite('P9_' + (12 + 2 * ledNumber), b.LOW);
    }
}

// Ready the Etch-A-Sketch
var etch = require("./etch");
etch.init(width, height);
etch.mark();

// Done
console.log("Ready.");
etch.show();
