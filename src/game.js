// game constants
const CONSTANTS = {
    speed: 100,
    directions: {
        up: {
            x: 0,
            y: -1
        },
        down: {
            x: 0,
            y: 1
        },
        right: {
            x: 1,
            y: 0
        },
        left: {
            x: -1,
            y: 0
        },
    },
    init_noodle_size: 5,
    noodle_color: "green",
    dot_color: "red"
}

// game constructor takes in user interface constructor
const Game = function(ui) {

    this.ui = ui;
    this.noodle = [];
    this.dot = {};
    this.score = 0;
    this.currentDirection = "right";
    this.changingDirection = false;
    this.timer = null;

    // initialize game
    this.init = () => {
        this.noodle = [];
        for (let i = CONSTANTS.init_noodle_size; i >= 0; i--) {
            this.noodle[CONSTANTS.init_noodle_size - i] = {
                x: i,
                y: 0
            }
        };
    
        this.dot = {};
        this.score = 0;
        this.currentDirection = "right";
        this.changingDirection = false;
        this.timer = null;

        this.randomDot();
        // these two methods come from UI module
        this.ui.resetScore();
        this.ui.render();

        this.ui.bindHandlers(
            this.changeDirection,
            this.play.bind(this),
            this.exit.bind(this)
        );
    };
    
    // Get a random coordinate from 0 to max container height/width
    this.randomPixel = (max, min) => {
        return Math.round(Math.random() * (max - min) + min);
    };

    this.randomDot = () => {
        this.dot.x = this.randomPixel(0, this.ui.gameContainer.width - 1);
        this.dot.y = this.randomPixel(1, this.ui.gameContainer.height - 1);
    
        // if the pixel is on a snake, regenerate the dot
        this.noodle.forEach(segment => {
            if (segment.x === this.dot.x && segment.y === this.dot.y) {
            randomDot();
            }
        });
    };

    this.drawNoodle = () => {
        this.noodle.forEach(segment => {
            // draw method comes from UI module
            this.ui.draw(segment, CONSTANTS.noodle_color);
        });
    };

    this.drawDot = () => {
        this.ui.draw(this.dot, CONSTANTS.dot_color);
    };

    this.changeDirection = (_, key) => {
        console.log("CHANGE DIRECTION");
        console.log(key);
        console.log("=======================");
        // prevent 180deg direction change
        if ((key.name === "ArrowUp") && this.currentDirection !== "down") {
            this.currentDirection = "up";
        } else if ((key.name === "ArrowDown") && this.currentDirection !== "up") {
            this.currentDirection = "down";
        } else if ((key.name === "ArrowLeft") && this.currentDirection !== "right") {
            this.currentDirection = "left";
        } else if ((key.name === "ArrowRight") && this.currentDirection !== "left") {
            this.currentDirection = "right";
        }
    };

    // move snake
    this.slither = () => {
        if (this.changingDirection) {
            return;
        } else {
            this.changingDirection = true;
        }
        // Move the head forward by one pixel based on velocity
        const head = {
            x: this.noodle[0].x + CONSTANTS.directions[this.currentDirection].x,
            y: this.noodle[0].y + CONSTANTS.directions[this.currentDirection].y,
        }
    
        this.noodle.unshift(head);
    
        // If the snake lands on a dot, increase the score and generate a new dot
        if (this.noodle[0].x === this.dot.x && this.noodle[0].y === this.dot.y) {
            this.score++;
            this.ui.updateScore(this.score);
            this.generateDot();
        } else {
        // Otherwise, slither
            this.noodle.pop();
        };
    };

    // end game if runs into itself or edges of screen
    this.isGameOver = () => {
    // If the snake collides with itself, end the game
        const collide = this.noodle
            .filter((_, i) => i > 0)
            .some(segment => segment.x === this.noodle[0].x && segment.y === this.noodle[0].y);

        return (
            collide ||
            // Right wall
            this.noodle[0].x >= this.ui.gameContainer.width - 1 ||
            // Left wall
            this.noodle[0].x <= -1 ||
            // Top wall
            this.noodle[0].y >= this.ui.gameContainer.height - 1 ||
            // Bottom wall
            this.noodle[0].y <= -1
        )
    };

    this.showGameOverScreen = () => {
        this.ui.gameOverScreen();
        this.ui.render();
    };

    this.tick = () => {
        if (this.isGameOver()) {
            this.showGameOverScreen();
            clearInterval(this.timer);
            this.timer = null;
            return;
        } else {    
            this.changingDirection = false;
            this.ui.clearScreen();
            this.drawDot();
            this.slither();
            this.drawNoodle();
            this.ui.render();
        }
    }

    this.play = (_, key) => {
        if (!this.timer) {
            this.init();
            this.timer = setInterval(this.tick.bind(this), CONSTANTS.speed)
        }
    };

    this.exit = (_, key) => {
        console.log("EXIT");
        console.log(key);
        console.log("============================");
        return process.exit(0);
    };


};

module.exports = Game;