rm main -f
config-pin P9_27 gpio
config-pin P9_28 gpio
gcc main.c -o main
echo "Done."
./main
