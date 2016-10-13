#HW06: Stepping Motor-Driven Light Finder/Tracker
![Demo Screenshot](https://dl.dropboxusercontent.com/u/8521871/hosted/beaglebone/hw06/demo.gif)

##Wiring
 - A single `Start` button should be connected to `P9_17`, with the other side of the button wired to 3.3 volts.
 - A stepper motor is connected to pins `P9_11`, `P9_13`, `P9_15`, and `P9_16`.
 - Two phototransistors are connected to `P9_39` and `P9_40`, which are `AIN0` and `AIN1` respectively.
 - All these pins can be changed in the first few lines of the `main.js` program.

##Demo
 - Run the program with `node main`.  Nothing will happen at first, but the word `Running` will appear in the console.
 - Hold the infrared LED pointing at the stepper and press the `Start` button.  The word `Scanning` will appear in the console, and the stepper motor will make one full clockwise turn.  It will then turn counterclockwise to face the LED.
 - The word `Tracking` will appear in the console, and the stepper motor will turn to follow the LED as it is moved.
 - Pushing the `Start` button at this point will trigger `Scanning` mode again.
