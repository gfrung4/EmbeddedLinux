console.log("Initializing...");
var etch = require('./etch');
var display = require('./display');
var b = require('bonescript');

// Initial size of the Etch-A-Sketch area
var padLeft, padTop;
var tabSelected = -1;

/* Initialize the Etch-A-Sketch. */
etch.init(20, 10, true);

/* Recalculates the (x,y) padding of the Etch-A-Sketch view. */
function calculate_padding() {
    padLeft = Math.floor((display.getWidth() - etch.getWidth()) / 2);
    padTop = Math.floor((display.getHeight() - etch.getHeight() - 5) / 2) + 1;
}

calculate_padding();

/*
Handle the up keypress.
*/
display.getScreen().key('up', function(ch, key) {
    pressUp();
});

function pressUp() {
    if (tabSelected === -1) {
        if (etch.move(0)) {
            display.fill(padLeft + etch.cursorX(), padTop + etch.cursorY(), 1, 1, 'black', 'green', 'X');
            display.setCursor(padLeft + etch.cursorX(), padTop + etch.cursorY());
        }
    } else {
        if (tabSelected === 0) {
            if (etch.getWidth() < display.getWidth()) {
                etch.resize(etch.getWidth() + 1, etch.getHeight());
                calculate_padding();
                draw_etch();
            }
            draw_tabs();
        } else if (tabSelected === 1) {
            if (etch.getHeight() < display.getHeight() - 5) {
                etch.resize(etch.getWidth(), etch.getHeight() + 1);
                calculate_padding();
                draw_etch();
            }
            draw_tabs();
        }
    }
    display.render();
}

/*
Handle the down keypress.
*/
display.getScreen().key('down', function(ch, key) {
    pressDown();
});

function pressDown() {
    if (tabSelected === -1) {
        if (etch.move(1)) {
            display.fill(padLeft + etch.cursorX(), padTop + etch.cursorY(), 1, 1, 'black', 'green', 'X');
            display.setCursor(padLeft + etch.cursorX(), padTop + etch.cursorY());
        }
    } else {
        if (tabSelected === 0) {
            if (etch.getWidth() > 1) {
                etch.resize(etch.getWidth() - 1, etch.getHeight());
                calculate_padding();
                draw_etch();
            }
            draw_tabs();
        } else if (tabSelected === 1) {
            if (etch.getHeight() > 1) {
                etch.resize(etch.getWidth(), etch.getHeight() - 1);
                calculate_padding();
                draw_etch();
            }
            draw_tabs();
        }
    }
    display.render();
}

/*
Handle the right keypress.
*/
display.getScreen().key('right', function(ch, key) {
    pressRight();
});

function pressRight() {
    if (tabSelected === -1) {
        if (etch.move(2)) {
            display.fill(padLeft + etch.cursorX(), padTop + etch.cursorY(), 1, 1, 'black', 'green', 'X');
            display.setCursor(padLeft + etch.cursorX(), padTop + etch.cursorY());
        }
    } else {
        if (tabSelected < 3) {
            tabSelected++;
            draw_tabs();
        }
    }
    display.render();
}

/*
Handle the left keypress.
*/
display.getScreen().key('left', function(ch, key) {
    pressLeft();
});

function pressLeft() {
    if (tabSelected === -1) {
        if (etch.move(3)) {
            display.fill(padLeft + etch.cursorX(), padTop + etch.cursorY(), 1, 1, 'black', 'green', 'X');
            display.setCursor(padLeft + etch.cursorX(), padTop + etch.cursorY());
        }
    } else {
        if (tabSelected > 0) {
            tabSelected--;
            draw_tabs();
        }
    }
    display.render();
}

/*
Handle the tab keypress.
*/
display.getScreen().key('tab', function(ch, key) {
    if (tabSelected === -1) {
        tabSelected = 0;
        display.hideCursor();
        draw_tabs();
        display.render();
    } else {
        tabSelected = -1;

        etch.mark();
        display.setCursor(padLeft + etch.cursorX(), padTop + etch.cursorY());
        display.fill(padLeft + etch.cursorX(), padTop + etch.cursorY(), 1, 1, 'black', 'green', 'X');

        display.showCursor();
        draw_tabs();
        display.render();
    }
});

/*
Handle the enter keypress.
*/
display.getScreen().key('enter', function(ch, key) {
    if (tabSelected === 2) {
        etch.clear();
        draw_etch();
        display.render();
    } else if (tabSelected === 3) {
        process.exit(0);
    }
});

/*
Draws the Etch-A-Sketch area.
*/
function draw_etch() {
    display.fill(0, 1, display.getWidth(), display.getHeight() - 5, "white", "white", ' ');
    for (var i = 0; i < etch.getWidth(); i++) {
        for (var j = 0; j < etch.getHeight(); j++) {
            if (etch.isMark(i, j) === 1) {
                display.fill(padLeft + i, padTop + j, 1, 1, "black", "green", 'X');
            } else {
                display.fill(padLeft + i, padTop + j, 1, 1, "black", "green", ' ');
            }
        }
    }
}

/*
Draws the title area at the top of the screen.
*/
function draw_title() {
    // Draw the red area
    display.fill(0, 0, display.getWidth(), 1, "white", "red", ' ');

    // Draw the title and author
    display.text(1, 0, "Etch A Sketch");
    display.text(display.getWidth() - 14, 0, "by Ricky Rung");
}

/*
Draws the tab area at the bottom of the screen.
*/
function draw_tabs() {
    // Get tab area
    var tabX = 0;
    var tabY = display.getHeight() - 4;
    var tabW = display.getWidth();
    var tabH = 4;

    // Draw the red area
    display.fill(tabX, tabY, tabW, tabH, "white", "red", ' ');

    // Draw instruction text
    display.text(tabX + Math.floor(tabW / 2) - 7, tabY + 1, "Press <TAB> to");
    display.text(tabX + Math.floor(tabW / 2) - 10, tabY + 2, "switch between panes.");

    // Width tab
    display.text(tabX + 2, tabY + 1, "   WIDTH   ", 'red', 'white');
    if (tabSelected === 0) {
        display.fill(tabX + 2, tabY + 2, 11, 1, 'red', 'white', ' ');
    }
    display.text(tabX + 6, tabY + 2, etch.getWidth().toString());
    // Height tab
    display.text(tabX + 15, tabY + 1, "  HEIGHT   ", 'red', 'white');
    if (tabSelected === 1) {
        display.fill(tabX + 15, tabY + 2, 11, 1, 'red', 'white', ' ');
    }
    display.text(tabX + 19, tabY + 2, etch.getHeight().toString());
    // Clear tab
    display.text(tabX + tabW - 26, tabY + 1, "   CLEAR   ", 'red', 'white');
    if (tabSelected === 2) {
        display.text(tabX + tabW - 26, tabY + 2, "  [ENTER]  ", 'red', 'white');
    }
    // Exit tab
    display.text(tabX + tabW - 13, tabY + 1, "   EXIT    ", 'red', 'white');
    if (tabSelected === 3) {
        display.text(tabX + tabW - 13, tabY + 2, "  [ENTER]  ", 'red', 'white');
    }
}



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
        switch (ledNumber) {
            case 0:
                pressUp();
                break;
            case 1:
                pressDown();
                break;
            case 2:
                pressRight();
                break;
            case 3:
                pressLeft();
                break;
        }
    }
    if (x.value === 0) {
        b.digitalWrite('P9_' + (12 + 2 * ledNumber), b.LOW);
    }
}


// Render the screen.
draw_etch();
draw_title();
draw_tabs();

// Setup the cursor initially
display.setCursor(padLeft + etch.cursorX(), padTop + etch.cursorY());
display.showCursor();

// Mark this point
etch.mark();
display.fill(padLeft + etch.cursorX(), padTop + etch.cursorY(), 1, 1, 'black', 'green', 'X');

// Initial render
display.render();
