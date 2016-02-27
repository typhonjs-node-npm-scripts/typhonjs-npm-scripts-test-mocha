'use strict';

/**
 * test -- Initiates the testing process with Mocha. A valid `npm-scripts.json` configuration file must be located
 * in the root path. This configuration file contains the following options:
 * ```
 * (string)          codecov - An optional string to include uploading for results to Codecov on Travis CI.
 * (object)          istanbul - An object hash containing Istanbul configuration with the following options:
 *    (string)          command - The Istanbul command to execute (cover, check-coverage, instrument, report).
 *    (Array<string>)   options - An array of optional parameters which are appended to the invocation of Istanbul.
 *                                Please run `./node_modules/.bin/istanbul help` for all available options.
 * (object)          mocha - An object hash containing Mocha configuration with the following options:
 *    (string)          source - The test source directory.
 *    (Array<string>)   options - An array of optional parameters which are prepended to the invocation of Mocha. Please
 *                                run `./node_modules/.bin/mocha --help` for all available options.
 * ```
 */

var cp =                require('child_process');
var fs =                require('fs');
var stripJsonComments = require('strip-json-comments');

// Verify that `npm-scripts.json` exists.
try
{
   if (!fs.statSync('./npm-scripts.json').isFile())
   {
      throw new Error("'npm-scripts.json' not found in root path.");
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

// Load `npm-scripts.json` and strip comments.
var configInfo = JSON.parse(stripJsonComments(fs.readFileSync('./npm-scripts.json', 'utf-8')));

// Verify that mocha entry is an object.
if (typeof configInfo.test !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (test) error: 'test' entry is not an object or is missing in 'npm-scripts.json'.");
}

var testConfig = configInfo.test;

// Verify that mocha entry is an object.
if (typeof testConfig.mocha !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (test) error: 'test.mocha' entry is not an object or is missing in 'npm-scripts.json'.");
}

// Verify that source entry is a string.
if (typeof testConfig.mocha.source !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (test) error: 'test.mocha.source' entry is not a string or is missing in 'npm-scripts.json'.");
}

// Build base execution command.
var exec = './node_modules/.bin/mocha';

// Add any optional parameters.
if (typeof testConfig.mocha.options !== 'undefined')
{
   if (!Array.isArray(testConfig.mocha.options))
   {
      throw new Error(
       "TyphonJS NPM script (test) error: 'test.mocha.options' entry is not an array in 'npm-scripts.json'.");
   }

   exec += ' ' + testConfig.mocha.options.join(' ');
}

// Append test source glob
exec += ' ' + testConfig.mocha.source;

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });