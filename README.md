# NPM Java Runner

[![NPM](https://img.shields.io/npm/v/npm-java-runner.svg?style=flat-square)](https://www.npmjs.com/package/npm-java-runner)

- Include configured `jar` inside the NPM-package.
- Provide a layer, delegating all arguments, so that the `jar` is runnable with `npx`.

So that you can create a command line tool with Java and distribute it as an NPM package.

## Usage

Create an `index.js` with:

```js
#!/usr/bin/env node
require('npm-java-runner/lib/index').run(__dirname);
```

Create `package.json` with:

```json
{
  "name": "NAME",
  "runnable-jar-regexp": ".*build/libs/.*\\d+\\.\\d+\\.\\d+\\.jar",
  "files": ["build/libs"],
  "bin": "./index.js",
  "dependencies": {
    "npm-java-runner": "a.b.c"
  }
}
```

If you release this (`npm publish`), you will be able to run your jar with:

```sh
npx NAME --whatever arguments
```

## Examples

- [Wiremock](https://github.com/tomasbjerre/wiremock-npm)
