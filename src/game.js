// game constants
const SPEED = 25,
    DIRECTIONS = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        right: { x: 1, y: 0 },
        left: { x: -1, y: 0 },
    },
    INIT_SNAKE_SIZE = 5,
    SNAKE_COLOR = "blue",
    DOT_COLOR = "yellow";

const Game = ui => {

    // game constructor takes in user interface constructor
    this.ui = ui;
    this.snake;
    this.dot;
    this.score;
    this.currentDirection;
    this.changingDirection;
    this.timer;

    // initialize game
    this.init = () => {
        snake = [];
        for (let i = INIT_SNAKE_SIZE; i >= 0; i--) {
            snake[INIT_SNAKE_SIZE - i] = {
                x: i,
                y: 0
            }
        };
    
        dot = {};
        score = 0;
        currentDirection = "right";
        changingDirection = false;
        timer = null;

        randomDot();
        // these two methods come from UI module
        ui.resetScore();
        ui.render();
    };

    this.randomPixel = (max, min) => {
        // Get a random coordinate from 0 to max container height/width
        return Math.round(Math.random() * (max - min) + min)
    };

    this.randomDot = () => {
        dot.x = randomPixel(0, ui.gameContainer.width - 1)
        dot.y = randomPixel(1, ui.gameContainer.height - 1)
    
        // if the pixel is on a snake, regenerate the dot
        snake.forEach(segment => {
            if (segment.x === dot.x && segment.y === dot.y) {
            randomDot();
            }
        });
    };

    this.drawSnake = () => {
        snake.forEach(segment => {
            // draw method comes from UI module
            ui.draw(segment, SNAKE_COLOR)
        });
    };

    this.drawDot = () => {
        ui.draw(this.dot, DOT_COLOR);
    };

    // TODO: check this syntax
    this.ui.bindHandlers(
        changeDirection.bind(this),
        play.bind(this),
        exit.bind(this)
    );

    this.changeDirection = key => {
        if ((key.name === "up") && this.currentDirection !== 'down') {
            currentDirection = "up";
            changingDirection = true;
        } else if ((key.name === "down") && this.currentDirection !== "up") {
            currentDirection = "down";
            changingDirection = true;
        } else if ((key.name === "left") && this.currentDirection !== "right") {
            currentDirection = "left";
            changingDirection = true;
        } else if ((key.name === "right") && this.currentDirection !== 'left') {
            currentDirection = "right";
            changingDirection = true;
        } else {
            changingDirection = false;
        }
    };

    // move snake
    this.slither = () => {

    };

    // end game if runs into itself or edges of screen
    this.isGameOver = () => {

    };

    this.tick = () => {
        if (isGameOver()) {
            showGameOverScreen()
            clearInterval(this.timer)
            timer = null
            return;
        } else {    
            changingDirection = false;
            ui.clearScreen();
            drawDot();
            slither();
            drawSnake();
            ui.render();
        }
    }

    this.play = () => {
        console.log("========-=====");
        console.log("START GAME");
        console.log("==============");
        if (!this.timer) {
            init();
            timer = setInterval(tick.bind(this), GAME_SPEED)
        } else {
            console.log("We're already playing what's going on?");
        }
    };

    this.exit = () => {
        console.log("================");
        console.log("EXIT");
        console.log("================");
        process.exit(0);
    }; 

};

module.exports = { Game };