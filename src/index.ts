#!/usr/bin/env node

import path from 'path';

function resolveRunnableJar(regexp: string, path: string) {
  throw `Cannot find ${regexp} in ${path}`;
}

export function run(userPath: string) {
  const packageJsonPathOfUser = path.join(userPath, 'package.json');

  const packageJsonOfUser = require(packageJsonPathOfUser);

  const runnableJarRegexpAttr = 'runnable-jar-regexp';
  const runnableJarRegexp = packageJsonOfUser[runnableJarRegexpAttr];
  if (!runnableJarRegexp) {
    throw `Did not find ${runnableJarRegexpAttr} within ${JSON.stringify(
      packageJsonOfUser
    )}`;
  }
  const runnableJar = resolveRunnableJar(runnableJarRegexp, userPath);
  console.log(`Runnable jar: ${runnableJar}`);
}
