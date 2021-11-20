#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { exec } from 'shelljs';

function executeJar(jarFile: string) {
  var userArgs = process.argv.slice(2);
  const javaArgs: string[] = [];
  const programArgs: string[] = [];

  userArgs.forEach(function (arg) {
    if (arg.startsWith('-D') || arg.startsWith('-X') || arg.startsWith('-P')) {
      javaArgs.push(arg);
    } else {
      programArgs.push(arg);
    }
  });

  let cmd = 'java';
  javaArgs.forEach(function (arg) {
    cmd += ` ${arg}`;
  });
  cmd += ` -jar ${jarFile} `;
  programArgs.forEach(function (arg) {
    cmd += ` ${arg}`;
  });
  var child = exec(cmd, { async: true });
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk === null) {
      return;
    }
    try {
      child.stdin.write(chunk);
    } catch (e) {}
  });
  child.on('close', function (code) {
    process.exit(code);
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

  executeJar(runnableJar);
}
