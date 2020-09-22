#!/usr/bin/env node
const webview = require("@suchipi/webview");
const run = require("./run");
const opt = require("./options");

const options = opt.parseArgv();
run(options);
