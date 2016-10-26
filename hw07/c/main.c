#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <signal.h>
#include "gpio.h"

int keepgoing = 1;
void signal_handler(int sig) {
		keepgoing = 0;
}

int main(int argc, char *argv[]) {
 	  // Handle CTRL+C
  	signal(SIGINT, signal_handler);

		// Variables for GPIO3
    volatile void *gpio_addr3;
    volatile unsigned int *gpio_oe_addr3;
    volatile unsigned int *gpio_datain3;
    volatile unsigned int *gpio_setdataout_addr3;
    volatile unsigned int *gpio_cleardataout_addr3;

		// Memory map on GPIO3
    int fd = open("/dev/mem", O_RDWR);
    gpio_addr3 = mmap(0, GPIO3_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, GPIO3_START_ADDR);
    gpio_oe_addr3           = gpio_addr3 + GPIO_OE;
		gpio_datain3            = gpio_addr3 + GPIO_DATAIN;
    gpio_setdataout_addr3   = gpio_addr3 + GPIO_SETDATAOUT;
    gpio_cleardataout_addr3 = gpio_addr3 + GPIO_CLEARDATAOUT;

		// Print if there was a failure
    if(gpio_addr3 == MAP_FAILED) {
        printf("Unable to map GPIO\n");
        exit(1);
    }

		// Setup the pins
    unsigned int reg = *gpio_oe_addr3;
		reg |= P9_28;
		reg &= ~P9_27;
    *gpio_oe_addr3 = reg;

    while(keepgoing) {
				// P9_11 controls USR0
				if(*gpio_datain3 & P9_28) {
						*gpio_setdataout_addr3= P9_27;
				} else {
						*gpio_cleardataout_addr3 = P9_27;
				}
    }

		// Unmap memory
    munmap((void *)gpio_addr3, GPIO3_SIZE);
    close(fd);

		// Return success
    return 0;
}
