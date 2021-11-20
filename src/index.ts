#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import child_process from 'child_process';

function execute(command: string) {
  child_process.exec(command, function (error, stdout, stderr) {
    if (error) {
      console.error(error);
    }
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
}

function search(dir: string, regex: string): string[] {
  let result: string[] = [];
  for (let file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && new RegExp(regex).test(filePath)) {
      result.push(filePath);
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

  execute(`java -jar ${runnableJar}`);
}
