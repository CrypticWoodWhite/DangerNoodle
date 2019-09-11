const blessed = require("blessed");

const UI = function() {
    this.blessed = blessed;
    this.screen = blessed.screen();
    this.screen.title = "DangerNoodle.js";

    this.gameBox = this.createGameBox();
    this.scoreBox = this.createScoreBox();
    this.gameOverBox = this.createGameOverBox();

    this.gameContainer = this.blessed.box(this.gameBox);
    this.scoreContainer = this.blessed.box(this.scoreBox);
};

const createGameBox = () => {
    return {
        parent: this.screen
    }

};
const createScoreBox = () => {
    return {
        parent: this.screen
    }
};
const createGameOverBox = () => {
    return {
        parent: this.screen
    }
};

module.exports = UI;
