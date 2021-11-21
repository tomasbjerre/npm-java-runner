#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

const { spawn } = require('child_process');

function executeJar(jarFile: string) {
  var userArgs = process.argv
    .slice(2)
    .map((it) => it.replace(/(?:\\r\\n|\\r|\\n)/g, '\n'));
  var command = spawn('java', ['-jar', jarFile, ...userArgs]);
  command.stdout.pipe(process.stdout);
  command.stderr.pipe(process.stderr);
  command.on('close', (code: number) => {
    process.exit(code);
  });
}

function search(dir: string, regex: string): string[] {
  let result: string[] = [];
  for (let file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const filePathString = filePath.replace(/\\/g, '/');
    const stat = fs.statSync(filePath);
    if (stat.isFile() && new RegExp(regex).test(filePathString)) {
      result.push(filePathString);
    } else if (stat.isDirectory()) {
      result = result.concat(search(filePath, regex));
    }
  }
  return result;
}

function resolveRunnableJar(regexp: string, path: string) {
  const found = search(path, regexp);
  if (found.length > 1) {
    throw `Multiple matches of ${regexp} in ${path} ${JSON.stringify(found)}`;
  }
  if (found.length == 0) {
    throw `No matches of ${regexp} in ${path}`;
  }
  return found[0];
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

  executeJar(runnableJar);
}
