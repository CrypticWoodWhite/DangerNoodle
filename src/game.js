// game constants
const SPEED = 25,
    DIRECTIONS = {
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
    INIT_NOODLE_SIZE = 5,
    NOODLE_COLOR = "blue",
    DOT_COLOR = "yellow";


// game constructor takes in user interface constructor
const Game = function(ui) {

    this.ui = ui;
    this.noodle;
    this.dot;
    this.score;
    this.currentDirection;
    this.changingDirection;
    this.timer;

    // initialize game
    this.init = () => {
        noodle = [];
        for (let i = INIT_NOODLE_SIZE; i >= 0; i--) {
            noodle[INIT_NOODLE_SIZE - i] = {
                x: i,
                y: 0
            }
        };
    
        dot = {};
        score = 0;
        currentDirection = "right";
        changingDirection = false;
        timer = null;

        this.randomDot();
        // these two methods come from UI module
        this.ui.resetScore();
        this.ui.render();
    };

    this.randomPixel = (max, min) => {
        // Get a random coordinate from 0 to max container height/width
        return Math.round(Math.random() * (max - min) + min);
    };

    this.randomDot = () => {
        this.dot.x = this.randomPixel(0, this.ui.gameContainer.width - 1);
        this.dot.y = this.randomPixel(1, this.ui.gameContainer.height - 1);
    
        // if the pixel is on a snake, regenerate the dot
        noodle.forEach(segment => {
            if (segment.x === this.dot.x && segment.y === this.dot.y) {
            randomDot();
            }
        });
    };

    this.drawNoodle = () => {
        this.noodle.forEach(segment => {
            // draw method comes from UI module
            this.ui.draw(segment, NOODLE_COLOR);
        });
    };

    this.drawDot = () => {
        this.ui.draw(this.dot, DOT_COLOR);
    };

    this.changeDirection = key => {
        if ((key.name === "up") && this.currentDirection !== 'down') {
            this.currentDirection = "up";
            this.changingDirection = true;
        } else if ((key.name === "down") && this.currentDirection !== "up") {
            this.currentDirection = "down";
            this.changingDirection = true;
        } else if ((key.name === "left") && this.currentDirection !== "right") {
            this.currentDirection = "left";
            this.changingDirection = true;
        } else if ((key.name === "right") && this.currentDirection !== 'left') {
            this.currentDirection = "right";
            this.changingDirection = true;
        } else {
            this.changingDirection = false;
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
            x: this.noodle[0].x + DIRECTIONS[this.currentDirection].x,
            y: this.noodle[0].y + DIRECTIONS[this.currentDirection].y,
        }
    
        this.snake.unshift(head);
    
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
        // Filter out the head
            .filter((_, i) => i > 0)
            // If head collides with any segment, collision
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
        if (isGameOver()) {
            this.showGameOverScreen();
            clearInterval(this.timer);
            this.timer = null;
            return;
        } else {    
            changingDirection = false;
            this.ui.clearScreen();
            this.drawDot();
            this.slither();
            this.drawNoodle();
            this.ui.render();
        }
    }

    this.play = () => {
        if (!this.timer) {
            this.init();
            this.timer = setInterval(tick.bind(this), SPEED)
        } else {
            console.log("We're already playing what's going on?");
        }
    };

    this.exit = () => {
        process.exit(0);
    };    

};

module.exports = Game;