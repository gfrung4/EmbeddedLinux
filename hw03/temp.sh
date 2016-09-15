temp=`i2cget -y 2 0x48 00`
celsius=$(($temp))
fahrenheit=$(($temp *9/5+32))
printf "\n"
printf "%s\n" "--- [   ADD0 Grounded   ] ---"
printf "%s\n" "The current temperature is:"
printf "%d °C\n" $celsius
printf "%d °F\n" $fahrenheit

temp=`i2cget -y 2 0x4a 00`
celsius=$(($temp))
fahrenheit=$(($temp *9/5+32))
printf "\n"
printf "%s\n" "--- [   ADD0 Powered    ] ---"
printf "%s\n" "The current temperature is:"
printf "%d °C\n" $celsius
printf "%d °F\n" $fahrenheit
printf "\n"
