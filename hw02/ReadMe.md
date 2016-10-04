#HW02: Buttons and LEDs
<img src="https://dl.dropboxusercontent.com/u/8521871/hosted/beaglebone/hw02/demo.gif" width="640">

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

==========
Comments from Prof. Yoder

It looks well structured, but I'm getting the error below.  Plese demo in class.

Grade: 2/10 (so far) 
Grade: 10/10 (now)

node main.js 
Initializing...
[0 q[0 q]112Error: EIO, i/o error
  at Error (native)
  at Object.fs.writeSync (fs.js:613:20)
  at Object.fs.writeFileSync (fs.js:1108:21)
  at Object.exports.exportGPIOControls (/usr/local/lib/node_modules/bonescript/src/hw_mainline.js:136:8)
  at Object.f.pinMode (/usr/local/lib/node_modules/bonescript/src/index.js:191:19)
  at Object.<anonymous> (/root/studentWork/rung/hw02/main.js:239:7)
  at Module._compile (module.js:460:26)
  at Object.Module._extensions..js (module.js:478:10)
  at Module.load (module.js:355:32)
  at Function.Module._load (module.js:310:12)
  at Function.Module.runMain (module.js:501:10)
  at startup (node.js:129:16)
  at node.js:814:3