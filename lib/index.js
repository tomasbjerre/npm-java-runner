#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var path_1 = __importDefault(require("path"));
function resolveRunnableJar(regexp, path) {
    throw "Cannot find " + regexp + " in " + path;
}
function run(userPath) {
    var packageJsonPathOfUser = path_1.default.join(userPath, 'package.json');
    var packageJsonOfUser = require(packageJsonPathOfUser);
    var runnableJarRegexpAttr = 'runnable-jar-regexp';
    var runnableJarRegexp = packageJsonOfUser[runnableJarRegexpAttr];
    if (!runnableJarRegexp) {
        throw "Did not find " + runnableJarRegexpAttr + " within " + JSON.stringify(packageJsonOfUser);
    }
    var runnableJar = resolveRunnableJar(runnableJarRegexp, userPath);
    console.log("Runnable jar: " + runnableJar);
}
exports.run = run;
//# sourceMappingURL=index.js.map