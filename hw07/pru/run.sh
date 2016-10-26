export PRU_CGT=/usr/share/ti/cgt-pru
export PRU_SUPPORT=/opt/source/pru-software-support-package
make clean
make
cp gen/*.out /lib/firmware/am335x-pru0-fw
config-pin -a P9_27 pruout
config-pin -a P9_28 pruin
echo "4a334000.pru0" > /sys/bus/platform/drivers/pru-rproc/unbind 2>/dev/null
echo "4a334000.pru0" > /sys/bus/platform/drivers/pru-rproc/bind
echo "Done."
