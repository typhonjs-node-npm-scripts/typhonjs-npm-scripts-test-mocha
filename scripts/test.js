'use strict';

/**
 * test -- Initiates the testing process with Mocha. A valid `npm-test.json` configuration file must be located
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

// Verify that `npm-test.json` exists.
try
{
   if (!fs.statSync('./npm-test.json').isFile())
   {
      throw new Error("'npm-test.json' not found in root path.");
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

// Load `npm-test.json` and strip comments.
var configInfo = JSON.parse(stripJsonComments(fs.readFileSync('./npm-test.json', 'utf-8')));

// Verify that mocha entry is an object.
if (typeof configInfo.mocha !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (test) error: mocha entry is not an object or is missing in 'npm-test.json'.");
}

// Verify that source entry is a string.
if (typeof configInfo.mocha.source !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (test) error: mocha source entry is not a string or is missing in 'npm-test.json'.");
}

// Build base execution command.
var exec = './node_modules/.bin/mocha';

// Add any optional parameters.
if (typeof configInfo.mocha.options !== 'undefined')
{
   if (!Array.isArray(configInfo.mocha.options))
   {
      throw new Error(
       "TyphonJS NPM script (test) error: mocha options entry is not an array in 'npm-test.json'.");
   }

   exec += ' ' + configInfo.mocha.options.join(' ');
}

// Append test source glob
exec += ' ' + configInfo.mocha.source;

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });