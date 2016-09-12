#HW02: Buttons and LEDs
![Demo Screenshot](https://dl.dropboxusercontent.com/u/8521871/hosted/beaglebone/hw02/demo.gif)

##Compile and Run
1. Download all the files and put them in the same directory on your Beaglebone.
2. In the directory, run `npm install` to install the required NodeJS packages.
3. Use `node main` to run the program.  `Initializing...` will appear, and it might take a while to start!

##Wiring
 - Four buttons should be connected to GPIO pins 11, 13, 15, and 17.
 - Four LEDs (with current limiting resistors) should be connected to GPIO pins 12, 14, 16, 18.
  - GPIO 11 and 12 control the **up** direction.  11 is the **up** button and 12 is the **up** LED.
  - GPIO 13 and 14 control the **down** direction.  13 is the **down** button and 14 is the **down** LED.
  - GPIO 15 and 16 control the **right** direction.  15 is the **right** button and 16 is the **right** LED.
  - GPIO 17 and 18 control the **left** direction.  17 is the **left** button and 18 is the **left** LED.
 - There are currently no buttons equivalent to `[TAB]` and `[ENTER]`, so a keyboard must be used for these functions.

##Instructions
 - Use the arrow keys to control the Etch-A-Sketch.  An **X** will be placed wherever you move!
 - Press `[TAB]` to switch to the controls along the bottom, and press `[TAB]` again to switch back.
 - Use `[LEFT]` and `[RIGHT]` to move between the options at the bottom.
 - Use `[UP]` and `[DOWN]` to increase and decrease the **width** and **height** when they are selected.
 - Use `[ENTER]` to **clear** or **exit** when those options are selected.
 - The buttons in the wiring section can be used instead of the `[UP]`, `[DOWN]`, `[RIGHT]`, and `[LEFT]` keys.
