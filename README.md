![typhonjs-npm-scripts-test-mocha](https://i.imgur.com/2mhnLT8.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-npm-scripts-test-mocha.svg?label=npm)](https://www.npmjs.com/package/typhonjs-npm-scripts-test-mocha)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha.svg?branch=master)](https://travis-ci.org/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha)
[![Coverage](https://img.shields.io/codecov/c/github/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha.svg)](https://codecov.io/github/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha)
[![Dependency Status](https://www.versioneye.com/user/projects/56e5a053df573d0043113afe/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56e5a053df573d0043113afe)

Requirements: Node v5+ / NPM 3+

Provides NPM scripts for testing with [Mocha](https://mochajs.org/) / [Chai](http://chaijs.com/), generating code coverage with [Istanbul](https://gotwarlost.github.io/istanbul/) and uploading results to [Codecov](https://codecov.io/) when running continuous integration on [Travis CI](https://travis-ci.org/) for all TyphonJS NPM modules and beyond. Linting support is also enabled via [ESLint](http://eslint.org/).

This NPM module uses entries defined in the `test` entry located in `.npmscriptrc` in the root path of a project. This module works for both ES5 and ES6+ testing, but please note the usage instructions below for ES6 testing.

For the latest significant changes please see the [CHANGELOG](https://github.com/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha/blob/master/CHANGELOG.md).

IMPORTANT (deprecation) in `0.2.0`: The [codecov.io](https://github.com/cainus/codecov.io) NPM module has been deprecated and will be removed in a future update in favor of the official [codecov](https://www.npmjs.com/package/codecov) NPM module. You will need to modify `.npmscriptrc` and replace `"travis": { "report": "cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js" },` with `"travis": { "report": "./node_modules/.bin/codecov" },`.

Also [snyk](https://www.npmjs.com/package/snyk) has been added which provides monitoring of known vulnerabilities in Node.js npm packages. One can add it to an NPM script on in [Travis CI](https://github.com/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha/blob/master/.travis.yml#L6) add the following: `- snyk test --dev`. 

For a comprehensive ES6 build / testing / publishing NPM module please see [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) as it combines this module for testing  along with transpiling ES6 sources with Babel, pre-publish script detection, ESDoc dependencies and an Istanbul instrumentation hook for JSPM / SystemJS tests. For a full listing of all TyphonJS NPM script modules available please see [typhonjs-node-npm-scripts](https://github.com/typhonjs-node-npm-scripts) organization on GitHub.

There are three testing scripts provided by this module:

- [mocha.js](https://github.com/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha/blob/master/scripts/mocha.js)
- [mocha-istanbul.js](https://github.com/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha/blob/master/scripts/mocha-istanbul.js)
- [mocha-istanbul-report.js](https://github.com/typhonjs-node-npm-scripts/typhonjs-npm-scripts-test-mocha/blob/master/scripts/mocha-istanbul-report.js)

`mocha.js` just runs Mocha tests.

Both `mocha-istanbul.js` and `mocha-istanbul-report.js` execute Mocha tests and Istanbul. Also an additional `report` command in `.npmscriptrc` is executed afterward if defined which is useful when running on Travis CI to upload results to Codecov.

The main difference between `mocha-istanbul.js` and `mocha-istanbul-report.js` is that `istanbul report` is automatically run after the initial `istanbul` command from `.npmscriptrc` is executed. This is necessary for instance when instrumenting JSPM / SystemJS tests.

------

To configure the test scripts provide this entry in `package.json` scripts entry:

```
  "devDependencies": {
    "typhonjs-npm-scripts-test-mocha": "^0.2.0"
  },
  "scripts": {
    "test": "babel-node ./node_modules/typhonjs-npm-scripts-test-mocha/scripts/mocha.js",
    "test-coverage": "babel-node ./node_modules/typhonjs-npm-scripts-test-mocha/scripts/mocha-istanbul.js"
  },
```

Please note the usage of `babel-node` to invoke the test scripts. If you are using ES6 for tests and sources and have Babel or [typhonjs-npm-scripts-build-babel](https://www.npmjs.com/package/typhonjs-npm-scripts-build-babel) installed use `babel-node` instead of `node`.

`.npmscriptrc` must be defined in the root path and contain a JSON formatted object hash `test` hash
with the following options:
```
(string)          report - An optional command to execute that may upload results to Codecov on Travis CI.

(object)          istanbul - An object hash containing Istanbul configuration with the following options:
   (string)          command - The Istanbul command to execute (cover, check-coverage, instrument, report).
   (Array<string>)   options - An array of optional parameters which are appended to the invocation of Istanbul.
                               Please run `./node_modules/.bin/istanbul help` for all available options.
                               
(object)          mocha - An object hash containing Mocha configuration with the following options:
   (string)          source - The test source directory.
   (Array<string>)   options - An array of optional parameters which are prepended to the invocation of Mocha. Please
                               run `./node_modules/.bin/mocha --help` for all available options.
```

When running on Travis CI a `test.travis` hash in `.npmscriptrc` may be provided which overrides any
data stored in the `test` hash. This is useful for specifying the `coverage` command when running on Travis CI.

A basic configuration for testing ES6 NPM modules in `.npmscriptrc` follows:
```
{
   "test":
   {
      // Provides a report handling command that is executed after running tests / coverage when running on Travis CI.
      "travis": { "report": "./node_modules/.bin/codecov" },
`
      "istanbul": { "command": "cover", "options": [ "--report lcovonly" ] },
      "mocha": { "source": "./test/src", "options": [ "--compilers js:babel-register", "-t 120000 --recursive" ] }
   }
}
```

Please note that you can add comments to `.npmscriptrc`. Also please note that if you are testing ES6 sources you must include `"--compilers js:babel-register"` in the mocha options. 

By default coverage results from Istanbul are output to `./coverage`. The `test-coverage.js` script only empties `./coverage` when executed, so if you change the directory Istanbul outputs to please note that it won't be cleared automatically.
