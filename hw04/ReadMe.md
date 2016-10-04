#HW04: MMAP GPIO and Web-Controlled LED Matrix
![Demo Screenshot](https://dl.dropboxusercontent.com/u/8521871/hosted/beaglebone/hw04/demo.gif)

##Wiring
 - Two buttons should be connected to P9_11 and P9_13.  These should be wired with pulldown resistors.  The other side of each button must be connected to 3.3 volts.
 - An LED matrix is connected to I2C bus 2.

##Demo 1
 - Ensure all of the USR LEDs are not set to any functionality.  Running `./usrstop` will do this for you.
 - Compile `multiThru.c` using `gcc -o program multiThru.c`.
 - Run the program with `./program`.
 - Pressing the buttons turns on the USR1 and USR2 LEDs.

##Demo 2
 - Run `cd draw`.
 - Run `node main`.  This requires that the modules `express`, `socket.io`, and `i2c@0.2.1` are installed.
 - Change the port in the code from `80` to another port if port `80` is being used by another program.
 - Browse to `192.168.7.2` in your browser.  Append the port if you changed it from `80`.
 - Choose a color from the four options on the right.
 - Draw by clicking on the pixels!  The changes are shown on the LED matrix in real time.
 - Drag the white square up and down to change the brightness of the whole display.
 - Click the refresh button to update the on-screen display from the LED matrix.

##Question Responses
1. The browser uses two Socket.IO message types to communicate with boneServer.js.
   * `matrix` Get's the current state of the LED matrix.
   * `i2cset` Runs the `i2cset` command on the Beaglebone.  Used to set pixels and brightness.
2. Clicking a pixel calls the LEDclick function with the x and y coordinates of the pixel clicked.  In this function, three things happen.
   * The bit representing the pixel is toggeled in the `disp` array in the browser.
   * An `i2cset` message is emmitted to the server, to be handled by `boneServer.js`.  The parameters are set to only send the changed column of the display.
   * The `on` class is either added to, or removed from, the table cell representing the pixel to change its color.
3. The `on` class in matrixLED.css is used to color the LED green when it is lit.
4. I wrote my code before `boneServer.js` was working.  It uses entirely my own setup, and does not rely on `boneServer.js`.  My code uses `wi2c.js` to manipulate I2C on the Beaglebone, which has Socket.IO events for each of the functions in the i2c library.
   * `new`
   * `writeByte`
   * `writeBytes`
   * `readByte`
   * `readBytes`
   * `write`
   * `read`
5. I did not use `boneServer.js` for my code.  I used `wi2c.js` to control the LED matrix connected to my Beaglebone.

==========
Prof. Yoder's comments
Very well done.  Nicely documented.
I don't see the Memory Map like figure 2-5.
Otherwise it looks very good.

Grade:  10/10