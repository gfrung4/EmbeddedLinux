(function() {
    var display, cx, cy, w, h;

    /*
    Marks the current cursor position.
    */
    function mark() {
        display[cx][cy] = 1;
    }

    /*
    Initializes an Etch-A-Sketch.  Cursor is whether or not to reset the cursor
    to the middle of the Etch-A-Sketch.
    */
    function init(width, height, resetCursor) {
        display = new Array(width);
        for (var i = 0; i < width; i++) {
            display[i] = Array.apply(null, Array(height)).map(Number.prototype.valueOf, 0);
        }
        w = width;
        h = height;

        if (resetCursor) {
            cx = Math.floor(width / 2);
            cy = Math.floor(height / 2);
        }
    }

    /*
    Clears the Etch-A-Sketch.
    */
    function clear() {
        init(w, h, false);
    }

    /*
    Resizes the Etch-A-Sketch.  If the Etch-A-Sketch decreases in size, potions
    outside the new size are lost.  If the Etch-A-Sketch increase in size, new
    areas created will start out NOT drawn on.
    */
    function resize(newWidth, newHeight) {
        // Adjust the width
        if (newWidth > w) {
            for (var i = 0; i < newWidth - w; i++) {
                display.push(Array.apply(null, Array(h)).map(Number.prototype.valueOf, 0));
            }
        } else if (newWidth < w) {
            display = display.slice(0, newWidth);
        }

        // Adjust the height
        if (newHeight > h) {
            for (var i = 0; i < newWidth; i++) {
                for (var j = 0; j < newHeight - h; j++) {
                    display[i].push(0);
                }
            }
        } else if (newHeight < h) {
            for (var i = 0; i < newWidth; i++) {
                display[i] = display[i].slice(0, newHeight);
            }
        }

        // Store new size
        w = newWidth;
        h = newHeight;

        // Move cursor if necessary
        if (cx >= w) {
            cx = w - 1;
        }
        if (cy >= h) {
            cy = h - 1;
        }
    }

    /*
    Moves the cursor.

    Directions:
    0 = Up
    1 = Down
    2 = Right
    3 = Left
    */
    function move(direction) {
        switch (direction) {
            case 0:
                if (cy > 0) {
                    cy--;
                    return true;
                }
                break;
            case 1:
                if (cy < h - 1) {
                    cy++;
                    return true;
                }
                break;
            case 2:
                if (cx < w - 1) {
                    cx++;
                    return true;
                }
                break;
            case 3:
                if (cx > 0) {
                    cx--;
                    return true;
                }
                break;
        }
        return false;
    }

    /*
    Gets the current cursor x position.
    */
    function cursorX() {
        return cx;
    }

    /*
    Gets the current cursor y position.
    */
    function cursorY() {
        return cy;
    }

    /*
    Gets the current width of the Etch-A-Sketch.
    */
    function getWidth() {
        return w;
    }

    /*
    Gets the current height of the Etch-A-Sketch.
    */
    function getHeight() {
        return h;
    }

    /*
    Returns 1 if the position (x, y) is marked and 0 if not.
    */
    function isMark(x, y) {
        return display[x][y];
    }

    module.exports.mark = mark;
    module.exports.init = init;
    module.exports.move = move;
    module.exports.resize = resize;
    module.exports.cursorX = cursorX;
    module.exports.cursorY = cursorY;
    module.exports.clear = clear;
    module.exports.isMark = isMark;
    module.exports.getWidth = getWidth;
    module.exports.getHeight = getHeight;
}());
