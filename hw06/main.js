var b = require('bonescript');

var motor = ["P9_11", "P9_13", "P9_15", "P9_16"];
var photo = {
    left: "P9_39",
    right: "P9_40"
};
var start = "P9_17";

var motorState = [b.LOW, b.HIGH, b.HIGH, b.LOW];
var trackInterval = null;

// Setup stepper motor pins as outputs and put in initial state
for (i = 0; i < motor.length; i++) {
    b.pinMode(motor[i], b.OUTPUT);
    b.digitalWrite(motor[i], motorState[i]);
}

// Setup start button as input
b.pinMode(start, b.INPUT, 7, 'pulldown');
b.attachInterrupt(start, true, b.CHANGE, pressStart);

// Read once, seems to fail the first time
readPhototransistor();

var mode = 0;

function pressStart(evt) {
    if (evt.attached === true) {
        return;
    }
    if (evt.value === 1 && mode !== 1) {
        // Pressed the button
        if (mode === 2) {
            clearInterval(trackInterval);
        }
        doScan();
    }
}

function step(cw) {
    if (cw) {
        motorState = [motorState[1], motorState[2], motorState[3], motorState[0]];
    } else {
        motorState = [motorState[3], motorState[0], motorState[1], motorState[2]];
    }

    for (i = 0; i < motor.length; i++) {
        b.digitalWrite(motor[i], motorState[i]);
    }
}

function readPhototransistor() {
    // This must be done in a try-catch because it seems to fail the very first
    // time, but succeed every time after.  This is likely a Bonescript bug.
    var left = 0;
    var right = 0;
    try {
        left = b.analogRead(photo.left);
        right = b.analogRead(photo.right);
    } catch (err) {

    }
    return {
        left: left,
        right: right
    };
}

function doScan() {
    console.log("Scanning");
    mode = 1;

    var vals = [];
    var steps = 0;
    var phase = 0;
    var backtrack = 0;
    var int = setInterval(function() {
        step(phase === 0);
        steps++;
        if (phase === 0 && steps === 20) {
            var loc = vals.indexOf(Math.min.apply(this, vals));
            backtrack = 20 - loc;
            steps = 0;
            phase = 1;
        }
        if (phase === 1 && steps === backtrack) {
            if (phase === 1) {
                clearInterval(int);
                doTrack();
            }
        }
        var result = readPhototransistor();
        vals.push(result.left + result.right);
    }, 50);
}

function doTrack() {
    console.log("Tracking");
    mode = 2;

    trackInterval = setInterval(function() {
        var read = readPhototransistor();
        var diff = read.right - read.left;

        if (diff > 0.1) {
            step(false);
        }
        if (diff < -0.1) {
            step(true);
        }

    }, 50);
}

console.log("Running");
