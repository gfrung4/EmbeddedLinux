# Delete the program if it's already been compiled
if [ -f "program" ]
then
rm program
fi

# Compile the program anew
echo "Compiling..."
g++ src.cpp -lncurses -o program

# If the program was compiled successfully, run it, if not, inform the user
if [ -f "program" ]
then
./program
echo "Done."
else
echo "Compilation failed, the program will not run."
fi
