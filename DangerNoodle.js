#!/usr/bin/env node

const { Game, UI } = require("./index");

const dangerNoodle = new Game(new UI());
dangerNoodle.play();