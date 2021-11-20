#!/usr/bin/env node

const path = require('path');

function resolveRunnableJar(regexp,path) {
    throw `Cannot find ${regexp} in ${path}`
}

const userPath = path.join(__dirname, '..');
const packageJsonPathOfUser = path.join(userPath, 'package.json');

const packageJsonOfUser = require(packageJsonPathOfUser);

const runnableJarRegexp = packageJsonOfUser['runnable-jar-regexp'];
const runnableJar = resolveRunnableJar(runnableJarRegexp,userPath);

