#HW03: GPIO and I2C
![Demo Screenshot](https://dl.dropboxusercontent.com/u/8521871/hosted/beaglebone/hw03/demo.gif)

##Wiring
 - Four buttons should be connected to GPIO pins 11, 13, 15, and 17.
 - Four LEDs (with current limiting resistors) should be connected to GPIO pins 12, 14, 16, 18.
 - One TMP006 sensor connected to I2C (bus 2) on pins 19 for SCL and 20 for SDA.
 - One LED matrix connected to the same I2C bus as the TMP006.
 - Two TMP101 sensors connected to the same I2C bus as the TMP006 and the LED matrix.
  - On one TMP101, connect ADD0 to ground, and on the other, connect ADD0 to 3.3 volts.
  - On the TMP101 with ADD0 grounded, connect the ALERT pin to P9_21.

##Demo 1
 - Run `./temp.sh`, the temperature from each of the TMP101 sensors is displayed in the console.

##Demo 2
 - Run `node temp`, the temperature of the TMP101 with ADD0 grounded is displayed in both C and F.
 - An alert is set to trigger when the temperature of the sensor rises 2 degrees.  Touch the sensor to warm it.
 - The alert is triggered and the temperature is displayed again.  The program exits.

##Demo 3
 - Run `node tempfar`, the temperature of the TMP006 and of the object it is pointed at will be displayed.
 - The temperatures are displayed every second.  Press `CTRL + C` to stop.
 - If there is no object in front of the sensor, the object temperature will read extremely high.

##Demo 4
 - Run `cd etch` and `node main`.  The Etch-A-Sketch from the previous homework assignments will run.
 - The upper 8 x 8 pixels of the Etch-A-Sketch will be displayed on the LED matrix.
 - If the size is set larger than 8 x 8, extra pixels are ignored.  Set the size to 8 x 8 for best results.
 - Use the arrow keys to control the Etch-A-Sketch.  An **X** will be placed wherever you move!
 - Press `[TAB]` to switch to the controls along the bottom, and press `[TAB]` again to switch back.
 - Use `[LEFT]` and `[RIGHT]` to move between the options at the bottom.
 - Use `[UP]` and `[DOWN]` to increase and decrease the **width** and **height** when they are selected.
 - Use `[ENTER]` to **clear** or **exit** when those options are selected.
 - The buttons in the wiring section can be used instead of the `[UP]`, `[DOWN]`, `[RIGHT]`, and `[LEFT]` keys.

==========
Comments from Prof. Mark A. Yoder

I get a 404 error on the screenshot. (resolved)
Nice documentation and great work on all the parts.  So far you are the only one
to get the TMP006 working and demoed.

Thanks for figuring out the i2c package.

Grade:  11/10
