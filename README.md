# NPM Java Runner

- It will make sure you have JRE installed, or else help download it.
- Include configured `jar` inside the NPM-package.
- Provide a layer, delegating all arguments, so that the `jar` is runnable with `npx`.

## Usage

Create an _index.js_ with:

```js
#!/usr/bin/env node
require('npm-java-runner/lib/index').run(__dirname);
```

Create _package.json_ with:

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

If you release this, you will be able to run your jar with:

```sh
npx NAME
```
