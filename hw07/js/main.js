var b = require('bonescript');

// Prepare input
b.pinMode("P9_28", b.INPUT, 7, 'pulldown');
b.attachInterrupt("P9_28", true, b.CHANGE, change);

// Prepare output
b.pinMode("P9_27", b.OUTPUT);
b.digitalWrite("P9_27", b.LOW);

// Detect changes
function change(x) {
    if (!x.attached) {
        b.digitalWrite("P9_27", x.value);
    }
}

console.log("Done.");
