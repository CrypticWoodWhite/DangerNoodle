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
        }
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
    this.turning = false;
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
        this.turning = false;
        this.timer = null;

        this.ui.bindHandlers(
            this.turn.bind(this),
            this.play.bind(this),
            this.exit.bind(this)
        );

        this.randomDot();
        // these two methods come from UI module
        this.ui.resetScore();
        this.ui.render();

    };
    
    // Get a random coordinate from 0 to max container height/width
    this.randomPixel = (max, min) => {
        return Math.round(Math.random() * (max - min) + min);
    };

    // use random pixel to give the dot coordinates
    this.randomDot = () => {
        this.dot.x = this.randomPixel(0, this.ui.gameContainer.width - 1);
        this.dot.y = this.randomPixel(1, this.ui.gameContainer.height - 1);
    
        // if the pixel is on a snake, regenerate the dot
        this.noodle.forEach(segment => {
            if (segment.x === this.dot.x && segment.y === this.dot.y) {
                this.randomDot();
            }
        });
    };

    this.growNoodle = () => {
        const eatDot = {
            x: this.noodle[0].x + ONSTANTS.directions[this.currentDirection].x,
            y: this.noodle[0].y + CONSTANTS.directions[this.currentDirection].y
        };
        this.noodle.unshift(eatDot);
    };

    this.drawNoodle = () => {
        this.noodle.forEach(segment => {
            this.ui.draw(segment, CONSTANTS.noodle_color);
        });
    };

    this.drawDot = () => {
        this.ui.draw(this.dot, CONSTANTS.dot_color);
    };

    this.turn = (_, key) => {
        // prevent 180deg direction change
        if (key.name === "up" && this.currentDirection !== "down") {
            this.currentDirection = "up";
        } 
        if (key.name === "down" && this.currentDirection !== "up") {
            this.currentDirection = "down";
        }
        if (key.name === "left" && this.currentDirection !== "right") {
            this.currentDirection = "left";
        }
        if (key.name === "right" && this.currentDirection !== "left") {
            this.currentDirection = "right";
        }

    };

    // move snake
    this.slither = () => {
        if (this.turning) {
            return;
        }
        this.turning = true;
        
        // move forward one pixel at a time by adding one pixel to head and removing last pixel
        const head = {
            x: this.noodle[0].x + CONSTANTS.directions[this.currentDirection].x,
            y: this.noodle[0].y + CONSTANTS.directions[this.currentDirection].y
        };
    
        this.noodle.unshift(head);
        this.noodle.pop();
    
        // If the snake lands on a dot, increase the score, increase snake size by 2, and generate a new dot
        if (this.noodle[0].x === this.dot.x && this.noodle[0].y === this.dot.y) {
            this.score++;
            this.growNoodle();
            this.drawNoodle();
            this.ui.updateScore(this.score);
            this.randomDot();
        }
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
            this.noodle[0].x >= this.ui.gameContainer.width ||
            // Left wall
            this.noodle[0].x <= -1 ||
            // Top wall
            this.noodle[0].y >= this.ui.gameContainer.height ||
            // Bottom wall
            this.noodle[0].y <= -1
        )
    };

    this.showGameOverScreen = () => {
        this.ui.gameOverScreen();
        this.ui.render();
    };

    // timer - game "resets" itself based on game speed constant
    this.tick = () => {
        if (this.isGameOver()) {
            this.showGameOverScreen();
            clearInterval(this.timer);
            this.timer = null;
            return;
        }
        this.turning = false;
        this.ui.clearScreen();
        this.drawDot();
        this.drawNoodle();
        this.slither();
        this.ui.render();
    };

    this.play = (_, key) => {
        if (!this.timer) {
            this.init();
            this.timer = setInterval(this.tick.bind(this), CONSTANTS.speed);
        }
    };

    this.exit = (_, key) => {
        return process.exit(0);
    };
};

module.exports = Game;