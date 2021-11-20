#!/usr/bin/env node

const path = require('path');

function resolveRunnableJar(regexp,path) {
    throw `Cannot find ${regexp} in ${path}`
}

export function run(userPath) {
    const packageJsonPathOfUser = path.join(userPath, 'package.json');

    const packageJsonOfUser = require(packageJsonPathOfUser);
    
    const runnableJarRegexpAttr = 'runnable-jar-regexp'
    const runnableJarRegexp = packageJsonOfUser[runnableJarRegexpAttr];
    if (!runnableJarRegexp) {
        throw `Did not find ${runnableJarRegexpAttr} within ${JSON.stringify(packageJsonOfUser)}`
    }
    const runnableJar = resolveRunnableJar(runnableJarRegexp,userPath);
}

