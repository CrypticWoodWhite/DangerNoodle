const blessed = require("blessed");

// const BOXES = {
//     game: {
//         parent: this.screen,
//         top: 1,
//         left: 0,
//         width: "100%",
//         height: "100%-1",
//         style: {
//             fg: "black",
//             bg: "black",
//         }
//     },
//     score: {
//         parent: this.screen,
//         top: 0,
//         left: "left",
//         width: "100%",
//         height: 1,
//         tags: true,
//         style: {
//             fg: "white",
//             bg: "blue",
//         }
//     },
//     gameOver: {
//         parent: this.screen,
//         top: "center",
//         left: "center",
//         width: 20,
//         height: 6,
//         tags: true,
//         valign: "middle",
//         content: `{center}Game Over!\n\nPress enter to play again{/center}`,
//         border: {
//             type: "line",
//         },
//         style: {
//             fg: "black",
//             bg: "red",
//             border: {
//                 fg: "white",
//             },
//         }
//     }
// }

// user interface constructor
const UI = function() {
    this.blessed = blessed;
    this.screen = blessed.screen();
    this.screen.title = "DangerNoodle.js";

    this.gameContainer = this.blessed.box({
        parent: this.screen,
        top: 1,
        left: 0,
        width: "100%",
        height: "100%-1",
        style: {
            fg: "black",
            bg: "black",
        }
    });
    this.scoreContainer = this.blessed.box({
        parent: this.screen,
        top: 0,
        left: "left",
        width: "100%",
        height: 1,
        tags: true,
        style: {
            fg: "white",
            bg: "blue",
        }
    });

    // functions below

    this.draw = (coord, color) => {
        this.blessed.box({
            parent: this.gameContainer,
            top: coord.y,
            left: coord.x,
            width: 1,
            height: 1,
            style: {
                fg: color,
                bg: color,
            }
        })
    };

    this.updateScore = score => {
        this.scoreContainer.setLine(0, `{bold}Score:{/bold} ${score}`);
    };
    
    this.gameOverScreen = () => {
        this.gameContainer = this.blessed.box({
            parent: this.screen,
            top: "center",
            left: "center",
            width: 20,
            height: 6,
            tags: true,
            valign: "middle",
            content: `{center}GAME OVER\n\nPress ENTER to play again{/center}`,
            border: {
                type: "line",
            },
            style: {
                fg: "black",
                bg: "red",
                border: {
                    fg: "white",
                },
            }
        });
    };
    
    this.clearScreen = () => {
        this.gameContainer.detach();
        this.gameContainer = this.blessed.box({
            parent: this.screen,
            top: 1,
            left: 0,
            width: "100%",
            height: "100%-1",
            style: {
                fg: "black",
                bg: "black",
            }
        });
    };
    
    this.resetScore = () => {
        this.scoreContainer.detach();
        this.scoreContainer = this.blessed.box({
            parent: this.screen,
            top: 0,
            left: "left",
            width: "100%",
            height: 1,
            tags: true,
            style: {
                fg: "white",
                bg: "blue",
            }
        });
        this.updateScore(0);
    };
    
    this.render = () => {
        this.screen.render();
    };

    this.bindHandlers = (keyPressHandler, playHandler, exitHandler) => {
        this.screen.key(["up", "down", "left", "right"], keyPressHandler);
        this.screen.key(["enter"], playHandler);
        this.screen.key(["escape", "q", "C-c"], exitHandler);      
    };
};

module.exports = UI;
