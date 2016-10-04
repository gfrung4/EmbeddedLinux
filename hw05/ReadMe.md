#HW05: Make, Kernel, Cross-Compiling, and The Cloud
![Demo Screenshot](https://dl.dropboxusercontent.com/u/8521871/hosted/beaglebone/hw05/demo.png)

##Make
 - The `Makefile`, along with required files to run it, are included in the `make` folder.
 - The file `answers.txt` is also included.  This file contains the answers to the two questions on [the activity page](http://elinux.org/EBC_Exercise_15_make).

##Installing the Kernel Source
 - I was able to complete the "Installing Development Tools v4.4" exercise, and successfully installed the kernel on my BeagleBone.  The version installed was `4.4.23-bone14`.
 - I was unable to conmplete the DAS U-boot portion.  When compiling, the `make` command returns an error and I am unable to identify the problem, as everything before it worked (including the two other `make` commands).

##Pushing to the Cloud
 - The `cloud` folder contains a `main.js` that reads two TMP101 temperature sensors every 5 seconds and sends the data to Phant running on `rose.engineer:8080`.
 - It is expected that one temperature sensor has `ADD0` grounded, and the other temperature sensor has `ADD0` connected to 3.3 volts.
 - The raw data can be [viewed here](http://rose.engineer:8080/streams/28KO4mjOAGfMabmO0al2coLo4jm).
 - A plot of the data can be viewed at the [JSFiddle here](http://jsfiddle.net/pLa9ncwv/).
