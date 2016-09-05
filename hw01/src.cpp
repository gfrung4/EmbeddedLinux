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

int padLeft, padTop;

WINDOW * win;
WINDOW * titleWin;
WINDOW * tabwin;

void cursor_set_color_string(const char *color) {
        printf("\e]12;%s\a", color);
        fflush(stdout);
}

void screen_redraw() {
        clear();
        refresh();
}

void etch_clear() {
        for(uint8_t i = 0; i < height; i++) {
                for(uint8_t j = 0; j < width; j++) {
                        wmove(win, i, j);
                        wprintw(win, " ");
                }
        }
}

void calculate_padding() {
        padLeft = (COLS - width ) / 2;
        padTop = (LINES - height - 5) / 2 + 1;
}

void recalculate_padding() {
        calculate_padding();
        mvwin(win, padTop, padLeft);
}

void rerender() {
        touchwin(stdscr);
        touchwin(win);
        touchwin(titleWin);
        touchwin(tabwin);
        refresh();
        wrefresh(titleWin);
}

int main(int argc, char** argv) {
        // Initialize curses, must be run first!
        initscr();
        noecho();
        start_color();
        cursor_set_color_string("lime");

        // Calculate the padding to the left and top of the Etch-A-Sketch
        calculate_padding();

        // Create windows
        win = newwin(height, width, padTop, padLeft);
        titleWin = newwin(1, COLS, 0, 0);
        tabwin = newwin(4, COLS, LINES-4, 0);

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
        bool inSketch = true;
        bool redraw = true;
        int selectedTab = -1;
        int lastTab = -1;
        bool done = false;
        while ( !done && (ch = wgetch(win)) != 'q') {
                switch ( ch ) {
                case KEY_UP:      // Move cursor UP
                        if(inSketch) {
                                if(y>0) {
                                        y--;
                                        redraw = true;
                                }
                        } else {
                                if(selectedTab==0) {
                                        if(width<COLS) {
                                                width++;
                                                recalculate_padding();
                                                wresize(win, height, width);
                                                rerender();
                                                lastTab = -1;
                                                redraw = true;
                                        }
                                }
                                if(selectedTab==1) {
                                        if(height<LINES-5) {
                                                height++;
                                                recalculate_padding();
                                                wresize(win, height, width);
                                                rerender();
                                                lastTab = -1;
                                                redraw = true;
                                        }
                                }
                        }
                        break;
                case KEY_DOWN:      // Move cursor DOWN
                        if(inSketch) {
                                if(y<height-1) {
                                        y++;
                                        redraw = true;
                                }
                        } else {
                                if(selectedTab==0) {
                                        if(width>1) {
                                                width--;
                                                recalculate_padding();
                                                wresize(win, height, width);
                                                rerender();
                                                lastTab = -1;
                                                redraw = true;
                                        }
                                }
                                if(selectedTab==1) {
                                        if(height>1) {
                                                height--;
                                                recalculate_padding();
                                                wresize(win, height, width);
                                                rerender();
                                                lastTab = -1;
                                                redraw = true;
                                        }
                                }
                        }
                        break;
                case KEY_LEFT:      // Move cursor LEFT
                        if(inSketch) {
                                if(x>0) {
                                        x--;
                                        redraw = true;
                                }
                        } else {
                                if(selectedTab>0) {
                                        selectedTab--;
                                        redraw = true;
                                }
                        }
                        break;
                case KEY_RIGHT:      // Move cursor RIGHT
                        if(inSketch) {
                                if(x<width-1) {
                                        x++;
                                        redraw = true;
                                }
                        } else {
                                if(selectedTab<3) {
                                        selectedTab++;
                                        redraw = true;
                                }
                        }
                        break;
                case 9:
                        if(inSketch) {
                                inSketch = false;
                                selectedTab = 0;
                                curs_set(0);
                                redraw = true;
                        } else {
                                inSketch = true;
                                curs_set(1);
                                redraw = true;

                                if(x>=width) {
                                        x = width-1;
                                }
                                if(y>=height) {
                                        y = height-1;
                                }
                        }
                        break;
                case 10:
                        if(!inSketch) {
                                if(selectedTab==3) {
                                        done = true;
                                }
                                if(selectedTab==2) {
                                        etch_clear();
                                }
                        }
                        break;
                }

                // If the cursor has moved, move it and place an X
                if(redraw) {
                        if(inSketch) {
                                wmove(win, y, x);
                                wprintw(win, "X");
                                wmove(win, y, x);
                                selectedTab = -1;
                        }

                        if(selectedTab!=lastTab) {
                                switch(lastTab) {
                                case 0:
                                        // Leaving WIDTH tab
                                        wmove(tabwin, 2, 2);
                                        wprintw(tabwin, "    %-7d", width);
                                        wrefresh(tabwin);
                                        break;
                                case 1:
                                        // Leaving HEIGHT tab
                                        wmove(tabwin, 2, 15);
                                        wprintw(tabwin, "    %-7d", height);
                                        wrefresh(tabwin);
                                        break;
                                case 2:
                                        // Leaving CLEAR tab
                                        wmove(tabwin, 2, COLS-26);
                                        wprintw(tabwin, "           ");
                                        wrefresh(tabwin);
                                        break;
                                case 3:
                                        // Leaving EXIT tab
                                        wmove(tabwin, 2, COLS-13);
                                        wprintw(tabwin, "           ");
                                        wrefresh(tabwin);
                                        break;
                                }

                                switch(selectedTab) {
                                case 0:
                                        // Entering WIDTH tab
                                        wmove(tabwin, 2, 2);
                                        wattron(tabwin, A_STANDOUT);
                                        wprintw(tabwin, "    %-7d", width);
                                        wattroff(tabwin, A_STANDOUT);
                                        wrefresh(tabwin);
                                        break;
                                case 1:
                                        // Entering HEIGHT tab
                                        wmove(tabwin, 2, 15);
                                        wattron(tabwin, A_STANDOUT);
                                        wprintw(tabwin, "    %-7d", height);
                                        wattroff(tabwin, A_STANDOUT);
                                        wrefresh(tabwin);
                                        break;
                                case 2:
                                        // Entering CLEAR tab
                                        wmove(tabwin, 2, COLS-26);
                                        wattron(tabwin, A_STANDOUT);
                                        wprintw(tabwin, "  [ENTER]  ");
                                        wattroff(tabwin, A_STANDOUT);
                                        wrefresh(tabwin);
                                        break;
                                case 3:
                                        // Entering EXIT tab
                                        wmove(tabwin, 2, COLS-13);
                                        wattron(tabwin, A_STANDOUT);
                                        wprintw(tabwin, "  [ENTER]  ");
                                        wattroff(tabwin, A_STANDOUT);
                                        wrefresh(tabwin);
                                        break;
                                }

                                lastTab = selectedTab;
                        }

                        redraw = false;
                }
        }

        // Free windows
        delwin(win);
        delwin(titleWin);
        delwin(tabwin);

        // End curses
        endwin();

        // Return successful
        return 0;
}
