'use strict';

/**
 * test -- Initiates the testing process with Mocha. A valid `npm-test-mocha.json` configuration file must be located
 * in the root path. This configuration file contains the following options:
 * ```
 * (string)          source - The source directory.
 * (Array<string>)   options - An array of optional parameters which are prepended to the invocation of Mocha. Please
 *                             run `./node_modules/.bin/mocha --help` for all available options.
 * ```
 */

var cp =                require('child_process');
var fs =                require('fs-extra');
var stripJsonComments = require('strip-json-comments');

// Verify that `npm-test-mocha.json` exists.
try
{
   if (!fs.statSync('./npm-test-mocha.json').isFile())
   {
      throw new Error("'npm-test-mocha.json' not found in root path.");
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (test) error: " + err);
}

// Verify that `Mocha` exists.
try
{
   if (!fs.statSync('./node_modules/.bin/mocha').isFile())
   {
      throw new Error("could not locate Mocha at './node_modules/.bin/mocha'.");
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (test) error: " + err);
}

// Load `npm-test-mocha.json` and strip comments.
var configInfo = JSON.parse(stripJsonComments(fs.readFileSync('./npm-test-mocha.json', 'utf-8')));

// Verify that source entry is a string.
if (typeof configInfo.source !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (test) error: source entry is not a string or is missing in 'npm-test-mocha.json'.");
}

var mochaOptions = '';

// Add any optional parameters.
if (typeof configInfo.options !== 'undefined')
{
   if (!Array.isArray(configInfo.options))
   {
      throw new Error(
       "TyphonJS NPM script (test) error: options entry is not an array in 'npm-test-mocha.json'.");
   }

   mochaOptions = configInfo.options.join(' ');
}

// Append test source glob
mochaOptions += ' ' + configInfo.source;

var exec;

/**
 * If running on Travis CI only generate lcov data and pipe to Codecov.
 */
if (process.env.TRAVIS)
{
   exec = './node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- ' + mochaOptions
    + ' && cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js';
}
else
{
   exec = './node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha -- ' + mochaOptions;
}

fs.emptyDirSync('./coverage');

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });