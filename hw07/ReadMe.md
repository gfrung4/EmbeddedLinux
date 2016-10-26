#HW07: GPIO Speed

Four different implementations of reading the value of P9_28 and copying it to P9_27.  One in JavaScript using the bonescript library, one in C using mmap, one that runs as a kernel module, and one running in the PRU.

##Compile and Run
Included are four folders, one for each implementation.  To be consistent, each folder contains a `run.sh` script that will run the code.  This script handles any setup and compiling that is necessary for that specific implementation.

To run each implementation, `cd` into its directory and run `./run.sh`.

Note that the kernel module is not unloaded, and the PRU is not stopped.  No scripts are included to do this, so these modules will continue to run until stopped manually.

Included in the report.pdf are timing and percent CPU usage for each implementation, as well as oscilloscope screenshots.
