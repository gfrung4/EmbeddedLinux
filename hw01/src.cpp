#include <stdio.h>
#include <stdlib.h>
#include <curses.h>

// Initial size of the Etch-A-Sketch area
int height = 10;
int width = 20;

// (x,y) position of the cursor in the Etch-A-Sketch area
int x = width / 2;
int y = height / 2;

// Last (lx,ly) position of the cursor in the Etch-A-Sketch area
int lx = 0;
int ly = 0;

void cursor_set_color_string(const char *color) {
        printf("\e]12;%s\a", color);
        fflush(stdout);
}

int main(int argc, char** argv) {
        // Initialize curses, must be run first!
        initscr();
        noecho();
        start_color();
        cursor_set_color_string("lime");

        // Calculate the padding to the left and top of the Etch-A-Sketch
        int padLeft = (COLS - width ) / 2;
        int padTop = (LINES - height - 5) / 2 + 1;

        // Create windows
        WINDOW * win = newwin(height, width, padTop, padLeft);
        WINDOW * titleWin = newwin(1, COLS, 0, 0);
        WINDOW * tabwin = newwin(4, COLS, LINES-4, 0);

        // Setup the main window
        keypad(stdscr, TRUE);
        init_pair(1,COLOR_BLACK, COLOR_WHITE);
        wbkgd(stdscr, COLOR_PAIR(1));

        // Setup the title window
        init_pair(2,COLOR_WHITE, COLOR_RED);
        wbkgd(titleWin, COLOR_PAIR(2));
        wattron(titleWin, A_BOLD);
        wmove(titleWin, 0, 1);
        wprintw(titleWin, "Etch A Sketch");
        wmove(titleWin, 0, COLS - 14);
        wprintw(titleWin, "by Ricky Rung");
        wattroff(titleWin, A_BOLD);

        // Setup the etch-a-sketch window
        keypad(win, TRUE);
        init_pair(3, COLOR_BLACK, COLOR_GREEN);
        wbkgd(win, COLOR_PAIR(3));

        // Setup the tab window
        keypad(tabwin, TRUE);
        wbkgd(tabwin, COLOR_PAIR(2));

        // Width selection tab
        wmove(tabwin, 1, 2);
        wattron(tabwin, A_STANDOUT);
        wprintw(tabwin, "   WIDTH   ");
        wattroff(tabwin, A_STANDOUT);
        wmove(tabwin, 2, 6);
        wprintw(tabwin, "20");

        // Height selection tab
        wmove(tabwin, 1, 15);
        wattron(tabwin, A_STANDOUT);
        wprintw(tabwin, "  HEIGHT   ");
        wattroff(tabwin, A_STANDOUT);
        wmove(tabwin, 2, 19);
        wprintw(tabwin, "10");

        // Exit tab
        wmove(tabwin, 1, COLS-13);
        wattron(tabwin, A_STANDOUT);
        wprintw(tabwin, "   EXIT    ");
        wattroff(tabwin, A_STANDOUT);

        // Clear tab
        wmove(tabwin, 1, COLS-26);
        wattron(tabwin, A_STANDOUT);
        wprintw(tabwin, "   CLEAR   ");
        wattroff(tabwin, A_STANDOUT);

        // Tab instruction text
        wmove(tabwin, 1, COLS/2 - 7);
        wprintw(tabwin, "Press <TAB> to");
        wmove(tabwin, 2, COLS/2 - 10);
        wprintw(tabwin, "switch between panes.");

        // Refresh the windows
        wrefresh(stdscr);
        wrefresh(titleWin);
        wrefresh(tabwin);

        // Place an X where the cursor starts
        wmove(win, y, x);
        wprintw(win, "X");
        wmove(win, y, x);

        // Begin main loop
        int ch;
        while ( (ch = wgetch(win)) != 'q' ) {
                switch ( ch ) {
                case KEY_UP:      // Move cursor UP
                        if(y>0) {
                                y--;
                        }
                        break;
                case KEY_DOWN:      // Move cursor DOWN
                        if(y<height-1) {
                                y++;
                        }
                        break;
                case KEY_LEFT:      // Move cursor LEFT
                        if(x>0) {
                                x--;
                        }
                        break;
                case KEY_RIGHT:      // Move cursor RIGHT
                        if(x<width-1) {
                                x++;
                        }
                        break;
                }

                // If the cursor has moved, move it and place an X
                if(x!=lx||y!=ly) {
                        wmove(win, y, x);
                        wprintw(win, "X");
                        wmove(win, y, x);
                        lx = x;
                        ly = y;
                }
        }

        // Delete windows
        delwin(win);
        delwin(titleWin);
        delwin(tabwin);

        // End curses
        endwin();

        // Return successful
        return 0;
}
