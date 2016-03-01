![typhonjs-npm-scripts-test-mocha](http://i.imgur.com/GA4VpJI.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-npm-scripts-test-mocha.svg?label=npm)](https://www.npmjs.com/package/typhonjs-npm-scripts-test-mocha)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-npm/typhonjs-npm-scripts-test-mocha/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-npm/typhonjs-npm-scripts-test-mocha.svg?branch=master)](https://travis-ci.org/typhonjs-node-npm/typhonjs-npm-scripts-test-mocha)
[![Coverage](https://img.shields.io/codecov/c/github/typhonjs-node-npm/typhonjs-npm-scripts-test-mocha.svg)](https://codecov.io/github/typhonjs-node-npm/typhonjs-npm-scripts-test-mocha)
[![Dependency Status](https://www.versioneye.com/user/projects/56cea0186b21e5003d47429f/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56cea0186b21e5003d47429f)

Provides NPM scripts for testing with [Mocha](https://mochajs.org/) / [Chai](http://chaijs.com/), generating code coverage with [Istanbul](https://gotwarlost.github.io/istanbul/) and uploading results to [Codecov](https://codecov.io/) when running continuous integration on [Travis CI](https://travis-ci.org/) for all TyphonJS NPM modules and beyond.

This NPM module uses entries defined in the `test` entry located in `npm-scripts.json` in the root path of a project. This module works for both ES5 and ES6+ testing, but please note the usage instructions below for ES6 testing.

For a comprehensive ES6 build / testing / publishing NPM module please see [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) as it combines this module for testing  along with transpiling ES6 sources with Babel via 
[typhonjs-npm-scripts-build-babel](https://www.npmjs.com/package/typhonjs-npm-scripts-build-babel) and pre-publish script detection via [typhonjs-npm-scripts-publish](https://www.npmjs.com/package/typhonjs-npm-scripts-publish). For a full listing of all TyphonJS NPM script modules available please see [typhonjs-node-npm](https://github.com/typhonjs-node-npm) organization on GitHub.

There are two testing scripts provided by this module:

- [test.js](https://github.com/typhonjs-node-npm/typhonjs-npm-scripts-test-mocha/blob/master/scripts/test.js)
- [test-coverage.js](https://github.com/typhonjs-node-npm/typhonjs-npm-scripts-test-mocha/blob/master/scripts/test-coverage.js)

The main difference is that `test-coverage.js` provides code coverage with Istanbul and if running on Travis CI also allows the addition of options to upload results to Codecov. 

------

To configure the test scripts provide this entry in `package.json` scripts entry:

```
  "devDependencies": {
    "typhonjs-npm-scripts-test-mocha": "^0.0.8"
  },
  "scripts": {
    "test": "babel-node ./node_modules/typhonjs-npm-scripts-test-mocha/scripts/test.js",
    "test-coverage": "babel-node ./node_modules/typhonjs-npm-scripts-test-mocha/scripts/test-coverage.js"
  },
```

Please note the usage of `babel-node` to invoke the test scripts. If you are using ES6 for tests and sources and have Babel or [typhonjs-npm-scripts-build-babel](https://www.npmjs.com/package/typhonjs-npm-scripts-build-babel) installed use `babel-node` instead of `node`.

`npm-scripts.json` must be defined in the root path and contain an object hash `test` hash
with the following options:
```
(string)          coverage - An optional string to append that may upload results to Codecov on Travis CI.
(object)          istanbul - An object hash containing Istanbul configuration with the following options:
   (string)          command - The Istanbul command to execute (cover, check-coverage, instrument, report).
   (Array<string>)   options - An array of optional parameters which are appended to the invocation of Istanbul.
                               Please run `./node_modules/.bin/istanbul help` for all available options.
(object)          mocha - An object hash containing Mocha configuration with the following options:
   (string)          source - The test source directory.
   (Array<string>)   options - An array of optional parameters which are prepended to the invocation of Mocha. Please
                               run `./node_modules/.bin/mocha --help` for all available options.
```

When running on Travis CI a `test.travis` hash in `npm-scripts.json` may be provided which overrides any
data stored in the `test` hash. This is useful for specifying the `coverage` command when running on Travis CI.

A basic configuration for testing ES6 NPM modules in `npm-scripts.json` follows:
```
{
   "test":
   {
      // Provides a `coverage` handling command that is appended when running on Travis CI.
      "travis": { "coverage": "&& cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js" },
`
      "istanbul": { "command": "cover", "options": [ "--report lcovonly" ] },
      "mocha": { "source": "./test/src", "options": [ "--compilers js:babel-register", "-t 120000 --recursive" ] }
   }
}
```

Please note that you can add comments to `npm-scripts.json`. Also please note that if you are testing ES6 sources you must include `"--compilers js:babel-register"` in the mocha options. 

By default coverage results from Istanbul are output to `./coverage`. The `test-coverage.js` script only empties `./coverage` when executed, so if you change the directory Istanbul outputs to please note that it won't be cleared automatically.
