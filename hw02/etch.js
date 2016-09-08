(function() {
    var display, cx, cy, w, h;

    function mark() {
        display[cx][cy] = 1;
    }

    function show() {
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                if (display[j][i] === 1) {
                    process.stdout.write("X");
                } else {
                    process.stdout.write(" ");
                }
            }
            process.stdout.write("\n");
        }
    }

    function init(width, height) {
        display = new Array(width);
        for (var i = 0; i < width; i++) {
            display[i] = Array.apply(null, Array(height)).map(Number.prototype.valueOf, 0);
        }
        cx = Math.floor(width / 2);
        cy = Math.floor(height / 2);
        w = width;
        h = height;
    }

    function move(direction) {
        switch (direction) {
            case 0:
                if (cy > 0) {
                    cy--;
                }
                break;
            case 1:
                if (cy < h - 1) {
                    cy++;
                }
                break;
            case 2:
                if (cx < w - 1) {
                    cx++;
                }
                break;
            case 3:
                if (cx > 0) {
                    cx--;
                }
                break;
        }
    }

    module.exports.mark = mark;
    module.exports.init = init;
    module.exports.move = move;
    module.exports.show = show;
}());
