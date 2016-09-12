(function() {
    var blessed = require('blessed');

    var namedColors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];

    // Create a screen object.
    var screen = blessed.screen({
        smartCSR: true,
        cursor: {
            artificial: false,
            shape: 'block',
            blink: false,
            color: null
        }
    });

    /*
    Fills a region of width (w) and height (h) starting at top-left corner (x, y)
    with the color bg, text color fg, and character c.

    Colors must be one of:
    [black, red, green, yellow, blue, magenta, cyan, white];
    */
    function fill(x, y, w, h, fg, bg, c) {
        var at = namedColors.indexOf(bg);
        at += (namedColors.indexOf(fg) << 9);
        screen.fillRegion(at, c, x, x + w, y, y + h);
    }

    /*
    Draws the string "message" at position (x, y).  The background (bg) and
    text (fg) colors will be used if provided.  If used without the colors, the
    text will be drawn using the colors already on the screen where it is drawn.

    Colors must be one of:
    [black, red, green, yellow, blue, magenta, cyan, white];
    */
    function text(x, y, message, fg, bg) {
        var i, l, at;
        if (fg === undefined) {
            for (i = 0, l = message.length; i < l; i++) {
                at = screen.lines[y][x + i][0];
                screen.fillRegion(at, message.charAt(i), x + i, x + i + 1, y, y + 1);
            }
        } else {
            at = namedColors.indexOf(bg);
            at += (namedColors.indexOf(fg) << 9);
            for (i = 0, l = message.length; i < l; i++) {
                screen.fillRegion(at, message.charAt(i), x + i, x + i + 1, y, y + 1);
            }
        }
    }

    /*
    Sets the cursor position to (x, y).
    */
    function setCursor(x, y) {
        screen.program.move(x, y);
    }

    /*
    Makes the cursor visible (if it was previously invisible).
    */
    function showCursor() {
        screen.program.showCursor();
    }

    /*
    Makes the cursor invisible (if it was previously visible).
    */
    function hideCursor() {
        screen.program.hideCursor();
    }

    /*
    Gets the height of the console window.
    */
    function getHeight() {
        return screen.height;
    }

    /*
    Gets the width of the console window.
    */
    function getWidth() {
        return screen.width;
    }

    /*
    Renders the screen.  Must be called after any changes for them to be visible.
    */
    function render() {
        screen.render();
    }

    /*
    Gets the Blessed screen object for advanced manipulation.
    */
    function getScreen() {
        return screen;
    }

    module.exports.fill = fill;
    module.exports.text = text;
    module.exports.getScreen = getScreen;
    module.exports.setCursor = setCursor;
    module.exports.showCursor = showCursor;
    module.exports.hideCursor = hideCursor;
    module.exports.render = render;
    module.exports.getHeight = getHeight;
    module.exports.getWidth = getWidth;

}());
