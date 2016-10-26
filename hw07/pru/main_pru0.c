#include <stdint.h>
#include <pru_cfg.h>
#include "resource_table_pru1.h"

volatile register unsigned int __R30;
volatile register unsigned int __R31;

void main(void) {

	CT_CFG.SYSCFG_bit.STANDBY_INIT = 0;

	while(1) {
		if(__R31&(1<<3)) {
			__R30 |= (1<<5);
		} else {
			__R30 &= ~(1<<5);
		}
	}
}
