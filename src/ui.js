const blessed = require("blessed");

const UI = function() {
    this.blessed = blessed;
    this.screen = blessed.screen();
    this.screen.title = "DangerNoodle.js";

    this.gameContainer = this.blessed.box(this.gameBox);
    this.scoreContainer = this.blessed.box(this.scoreBox);

    this.gameBox = function() {
        return {
            parent: this.screen,
            top: 1,
            left: 0,
            width: "100%",
            height: "100%-1",
            style: {
                fg: "black",
                bg: "black",
            }
        }
    };
    this.scoreBox = function() {
        return {
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
        }
    };
    this.gameOverBox = function() {
        return {
            parent: this.screen,
            top: "center",
            left: "center",
            width: 20,
            height: 6,
            tags: true,
            valign: "middle",
            content: `{center}Game Over!\n\nPress enter to try again{/center}`,
            border: {
                type: "line",
            },
            style: {
                fg: "black",
                bg: "red",
                border: {
                    fg: "white",
                },
            },
        }
    };

    this.draw = function(coord, color) {
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

    this.updateScore = function(score) {
        this.scoreContainer.setLine(0, `{bold}Score:{/bold} ${score}`);
    };
    
    this.gameOverScreen = function() {
        this.gameContainer = this.blessed.box(this.gameOverBox);
    };
    
    this.clearScreen = function() {
        this.gameContainer.detach();
        this.gameContainer = this.blessed.box(this.gameBox);
    };
    
    this.resetScore = function() {
        this.scoreContainer.detach();
        this.scoreContainer = this.blessed.box(this.scoreBox);
        this.updateScore(0);
    };
    
    this.render = function() {
        this.screen.render();
    };

    this.bindHandlers = function(keyPressHandler, quitHandler, enterHandler) {
        this.screen.on("keypress", keyPressHandler)
        this.screen.key(["escape", "q", "C-c"], quitHandler)
        this.screen.key(["enter"], enterHandler)
    };
};

module.exports = UI;
