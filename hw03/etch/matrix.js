(function() {
    //var b = require('bonescript');
    var port = '/dev/i2c-2';
    var matrix = 0x70;
    var i2c = require('i2c');

    var ledRed, ledGreen;

    function clear() {
        ledRed = new Array(8);
        for (var i = 0; i < 8; i++) {
            ledRed[i] = Array.apply(null, Array(8)).map(Number.prototype.valueOf, 0);
        }
        ledGreen = new Array(8);
        for (var i = 0; i < 8; i++) {
            ledGreen[i] = Array.apply(null, Array(8)).map(Number.prototype.valueOf, 0);
        }
    }

    function update() {
        var result = [];
        for (var i = 7; i >= 0; i--) {
            var red = 0;
            var green = 0;
            for (var j = 0; j < 8; j++) {
                red += ledRed[i][j] * Math.pow(2, j);
                green += ledGreen[i][j] * Math.pow(2, j);
            }
            result.push(green);
            result.push(red);
        }
        wire.writeBytes(0x00, result, function(err) {

        });
    }

    function set(x, y, color) {
        switch (color) {
            case 'red':
                ledRed[x][y] = 1;
                ledGreen[x][y] = 0;
                break;
            case 'green':
                ledRed[x][y] = 0;
                ledGreen[x][y] = 1;
                break;
            case 'yellow':
                ledRed[x][y] = 1;
                ledGreen[x][y] = 1;
                break;
            default:
                ledRed[x][y] = 0;
                ledGreen[x][y] = 0;
                break;
        }
    }

    var wire = new i2c(0x70, {
        device: '/dev/i2c-2'
    });

    clear();
    wire.writeByte(0x21, function(err) {
        wire.writeByte(0x81, function(err) {
            wire.writeByte(0xe7, function(err) {
                update();
            });
        });
    });

    module.exports.clear = clear;
    module.exports.update = update;
    module.exports.set = set;
}());
