/*

The constants and math formulas below are adapted from SparkFun's library for
the TMP006.  The original code can be found here:

https://github.com/sparkfun/TMP006-Temp_Sensor_Breakout/tree/master/Firmware/TMP006

*/

var TMP006_B0 = -0.0000294;
var TMP006_B1 = -0.00000057;
var TMP006_B2 = 0.00000000463;
var TMP006_C2 = 13.4;
var TMP006_TREF = 298.15;
var TMP006_A2 = -0.00001678;
var TMP006_A1 = 0.00175;
var TMP006_S0 = 6.4;

var TMP006_CFG_RESET = 0x8000;
var TMP006_CFG_MODEON = 0x7000;
var TMP006_CFG_1SAMPLE = 0x0000;
var TMP006_CFG_2SAMPLE = 0x0200;
var TMP006_CFG_4SAMPLE = 0x0400;
var TMP006_CFG_8SAMPLE = 0x0600;
var TMP006_CFG_16SAMPLE = 0x0800;
var TMP006_CFG_DRDYEN = 0x0100;
var TMP006_CFG_DRDY = 0x0080;

var TMP006_VOBJ = 0x00;
var TMP006_TAMB = 0x01;
var TMP006_CONFIG = 0x02;

var i2c = require('i2c');

var wire = new i2c(0x40, {
    device: '/dev/i2c-2'
});

config_TMP006(TMP006_CFG_4SAMPLE, function(err) {
    console.log("Device configured.");
    console.log(" ");
    console.log("The temperature of the device and the object will be read every second.");
    console.log("The object temperature will be very high if no object is detected!");
    console.log("Make sure there's something in front of the sensor.");
    setInterval(function() {
        readObjTempC(function(gotTemp) {
            console.log(" ");
            console.log("Device Temp: " + (Math.round(gotTemp[0] * 10) / 10));
            console.log("Object Temp: " + (Math.round(gotTemp[1] * 10) / 10));
        });
    }, 1000);
});




/*
The functions below are adapted from SparkFun's library linked at the top of
this file.
*/

function config_TMP006(samples, callback) {
    write16(TMP006_CONFIG, samples | TMP006_CFG_MODEON | TMP006_CFG_DRDYEN, function(err) {
        callback(err);
    });
}

function write16(command, data, callback) {
    var byte2 = data % 256;
    var byte1 = Math.floor(data / 256);
    wire.writeBytes(TMP006_CONFIG, [byte1, byte2], function(err) {
        callback(err);
    });
}

function read16(command, callback) {
    wire.readBytes(command, 2, function(err, res) {
        callback(err, res[0] * 256 + res[1]);
    });
}

// Read raw sensor temperature
function readRawDieTemperature(callback) {
    read16(TMP006_TAMB, function(err, res) {
        callback(err, res >> 2);
    });
}

// Read raw thermopile voltage
function readRawVoltage(callback) {
    read16(TMP006_VOBJ, function(err, res) {
        callback(err, res);
    });
}

function readObjTempC(callback) {
    var Tdie, Vobj;
    readRawDieTemperature(function(err, res) {
        Tdie = res;
        readRawVoltage(function(err, res) {
            Vobj = res;
            var returnedDieTemp = Tdie * 0.03125;

            Vobj *= 156.25; // 156.25 nV per LSB
            Vobj /= 1000000000; // nV -> V
            Tdie *= 0.03125; // convert to celsius
            Tdie += 273.15; // convert to kelvin

            // Equations for calculating temperature found in section 5.1 in the user guide
            var tdie_tref = Tdie - TMP006_TREF;
            var S = (1 + TMP006_A1 * tdie_tref + TMP006_A2 * tdie_tref * tdie_tref);
            S *= TMP006_S0;
            S /= 10000000;
            S /= 10000000;

            var Vos = TMP006_B0 + TMP006_B1 * tdie_tref + TMP006_B2 * tdie_tref * tdie_tref;
            var fVobj = (Vobj - Vos) + TMP006_C2 * (Vobj - Vos) * (Vobj - Vos);
            var Tobj = Math.sqrt(Math.sqrt(Tdie * Tdie * Tdie * Tdie + fVobj / S));

            Tobj -= 273.15; // Kelvin -> *C

            callback([returnedDieTemp, Tobj]);
        });
    });
}
