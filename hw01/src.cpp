#include <stdio.h>
#include <stdlib.h>
#include <curses.h>

// Initial size of the Etch-A-Sketch area
int height = 10;
int width = 20;

// (x,y) position of the cursor in the Etch-A-Sketch area
int x = width / 2;
int y = height / 2;

// The three windows for the various parts of the application
WINDOW * win;
WINDOW * titleWin;
WINDOW * tabwin;

/* Sets the cursor color to the given color name. */
void cursor_set_color_string(const char *color) {
        printf("\e]12;%s\a", color);
        fflush(stdout);
}

/* Clears the Etch-A-Sketch. */
void etch_clear() {
        for(uint8_t i = 0; i < height; i++) {
                for(uint8_t j = 0; j < width; j++) {
                        wmove(win, i, j);
                        wprintw(win, " ");
                }
        }
}

/* Redraws everything.  This is only currently necessary after a resize. */
void etch_rerender() {
        touchwin(stdscr);
        touchwin(win);
        touchwin(titleWin);
        touchwin(tabwin);

        wrefresh(stdscr);
        wrefresh(win);
        wrefresh(titleWin);
        wrefresh(tabwin);
}

/* Resizes the Etch-A-Sketch. */
void etch_resize() {
        // Calculate padding
        int padLeft = (COLS - width ) / 2;
        int padTop = (LINES - height - 5) / 2 + 1;

        // Resize and move the window
        wresize(win, height, width);
        mvwin(win, padTop, padLeft);

        // Redraw everything
        etch_rerender();
}

int main(int argc, char** argv) {
        // Initialize curses, must be run first!
        initscr();
        noecho();
        start_color();

        // Set cursor color to lime
        cursor_set_color_string("lime");

        // Create windows
        win = newwin(1, 1, 1, 1);
        titleWin = newwin(1, COLS, 0, 0);
        tabwin = newwin(4, COLS, LINES-4, 0);

        // Calculate the padding to the left and top of the Etch-A-Sketch
        etch_resize();

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
        etch_rerender();

        // Place an X where the cursor starts
        wmove(win, y, x);
        wprintw(win, "X");
        wmove(win, y, x);

        // Begin main loop
        int ch;
        bool redraw = true;
        int selectedTab = -1;
        int lastTab = -1;
        bool done = false;
        while ( !done && (ch = wgetch(win)) != 'q') {

                if(selectedTab==-1) {
                        // The user is drawing
                        switch ( ch ) {
                        case KEY_UP: // Move cursor UP
                                if(y>0) {
                                        y--;
                                        redraw = true;
                                }
                                break;
                        case KEY_DOWN: // Move cursor DOWN
                                if(y<height-1) {
                                        y++;
                                        redraw = true;
                                }
                                break;
                        case KEY_LEFT: // Move cursor LEFT
                                if(x>0) {
                                        x--;
                                        redraw = true;
                                }
                                break;
                        case KEY_RIGHT: // Move cursor RIGHT
                                if(x<width-1) {
                                        x++;
                                        redraw = true;
                                }
                                break;
                        case 9:
                                selectedTab = 0;
                                curs_set(0);
                                redraw = true;
                                break;
                        }
                } else {
                        switch ( ch ) {
                        case KEY_UP:        // Increase count
                                if(selectedTab==0) {
                                        if(width<COLS) {
                                                width++;
                                                etch_resize();
                                                etch_rerender();
                                                lastTab = -1; // Forces tab redraw
                                                redraw = true;
                                        }
                                } else if(selectedTab==1) {
                                        if(height<LINES-5) {
                                                height++;
                                                etch_resize();
                                                etch_rerender();
                                                lastTab = -1; // Forces tab redraw
                                                redraw = true;
                                        }
                                }
                                break;
                        case KEY_DOWN:        // Move cursor DOWN
                                if(selectedTab==0) {
                                        if(width>1) {
                                                width--;
                                                etch_resize();
                                                etch_rerender();
                                                lastTab = -1; // Forces tab redraw
                                                redraw = true;
                                        }
                                } else if(selectedTab==1) {
                                        if(height>1) {
                                                height--;
                                                etch_resize();
                                                etch_rerender();
                                                lastTab = -1; // Forces tab redraw
                                                redraw = true;
                                        }
                                }
                                break;
                        case KEY_LEFT:        // Move one tab to the LEFT
                                if(selectedTab>0) {
                                        selectedTab--;
                                        redraw = true;
                                }
                                break;
                        case KEY_RIGHT:        // Move one tab to the RIGHT
                                if(selectedTab<3) {
                                        selectedTab++;
                                        redraw = true;
                                }
                                break;
                        case 9:
                                selectedTab = -1;
                                curs_set(1);
                                redraw = true;

                                if(x>=width) {
                                        x = width-1;
                                }
                                if(y>=height) {
                                        y = height-1;
                                }
                                break;
                        case 10:
                                if(selectedTab==3) {
                                        done = true;
                                }
                                if(selectedTab==2) {
                                        etch_clear();
                                }
                                break;
                        }
                }

                // If the cursor has moved, move it and place an X
                if(redraw) {
                        if(selectedTab==-1) {
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
