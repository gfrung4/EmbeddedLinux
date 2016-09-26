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

		// Variables for GPIO0
    volatile void *gpio_addr0;
    volatile unsigned int *gpio_oe_addr0;
    volatile unsigned int *gpio_datain0;
    volatile unsigned int *gpio_setdataout_addr0;
    volatile unsigned int *gpio_cleardataout_addr0;
		// Variables for GPIO1
    volatile void *gpio_addr1;
    volatile unsigned int *gpio_oe_addr1;
    volatile unsigned int *gpio_datain1;
    volatile unsigned int *gpio_setdataout_addr1;
    volatile unsigned int *gpio_cleardataout_addr1;

		// Memory map on GPIO0 and GPIO1
    int fd = open("/dev/mem", O_RDWR);
    gpio_addr0 = mmap(0, GPIO0_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, GPIO0_START_ADDR);
		gpio_addr1 = mmap(0, GPIO1_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, GPIO1_START_ADDR);
    gpio_oe_addr0           = gpio_addr0 + GPIO_OE;
		gpio_datain0            = gpio_addr0 + GPIO_DATAIN;
    gpio_setdataout_addr0   = gpio_addr0 + GPIO_SETDATAOUT;
    gpio_cleardataout_addr0 = gpio_addr0 + GPIO_CLEARDATAOUT;
    gpio_oe_addr1           = gpio_addr1 + GPIO_OE;
		gpio_datain1            = gpio_addr1 + GPIO_DATAIN;
    gpio_setdataout_addr1   = gpio_addr1 + GPIO_SETDATAOUT;
    gpio_cleardataout_addr1 = gpio_addr1 + GPIO_CLEARDATAOUT;

		// Print if there was a failure
    if(gpio_addr0 == MAP_FAILED || gpio_addr1 == MAP_FAILED) {
        printf("Unable to map GPIO\n");
        exit(1);
    }

		// Set the buttons to be inputs
    unsigned int reg = *gpio_oe_addr0;
		reg |= P9_11;
		reg |= P9_13;
    *gpio_oe_addr0 = reg;

		// Set the USR LEDs to be outputs
		reg = *gpio_oe_addr1;
	  reg &= ~USR0;
		reg &= ~USR1;
		*gpio_oe_addr1 = reg;

    while(keepgoing) {
				// P9_11 controls USR0
				if(*gpio_datain0 & P9_11) {
						*gpio_setdataout_addr1= USR0;
				} else {
						*gpio_cleardataout_addr1 = USR0;
				}

				// P9_13 controls USR1
				if(*gpio_datain0 & P9_13) {
						*gpio_setdataout_addr1= USR1;
				} else {
						*gpio_cleardataout_addr1 = USR1;
				}
    }

		// Unmap memory
    munmap((void *)gpio_addr0, GPIO0_SIZE);
		munmap((void *)gpio_addr1, GPIO1_SIZE);
    close(fd);

		// Return success
    return 0;
}
