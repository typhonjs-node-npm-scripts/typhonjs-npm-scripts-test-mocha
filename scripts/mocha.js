'use strict';

/**
 * mocha -- Initiates the testing process with Mocha. A valid `.npmscriptrc` configuration file must be located
 * in the root path. This configuration file contains the following options:
 * ```
 * (object)          mocha - An object hash containing Mocha configuration with the following options:
 *    (string)          source - The test source directory.
 *    (Array<string>)   options - An array of optional parameters which are prepended to the invocation of Mocha. Please
 *                                run `./node_modules/.bin/mocha --help` for all available options.
 * ```
 */

var cp =                require('child_process');
var fs =                require('fs');
var stripJsonComments = require('strip-json-comments');

// Verify that `.npmscriptrc` exists.
/* istanbul ignore next */
try
{
   if (!fs.statSync('./.npmscriptrc').isFile())
   {
      throw new Error("'.npmscriptrc' not found in root path.");
   }
}
catch (err)
{
   throw new Error("TyphonJS NPM script (test) error: " + err);
}

// Verify that `Mocha` exists.
/* istanbul ignore next */
try
{
   if (!fs.statSync('./node_modules/.bin/mocha').isFile())
   {
      throw new Error("could not locate Mocha at './node_modules/.bin/mocha'.");
   }
}
catch (err)
{
   throw new Error("TyphonJS NPM script (test) error: " + err);
}

// Load `.npmscriptrc` and strip comments.
var configInfo = JSON.parse(stripJsonComments(fs.readFileSync('./.npmscriptrc', 'utf-8')));

// Verify that mocha entry is an object.
if (typeof configInfo.test !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (test) error: 'test' entry is not an object or is missing in '.npmscriptrc'.");
}

var testConfig = configInfo.test;

// Verify that mocha entry is an object.
/* istanbul ignore if */
if (typeof testConfig.mocha !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (test) error: 'test.mocha' entry is not an object or is missing in '.npmscriptrc'.");
}

// Verify that source entry is a string.
/* istanbul ignore if */
if (typeof testConfig.mocha.source !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (test) error: 'test.mocha.source' entry is not a string or is missing in '.npmscriptrc'.");
}

// Build base execution command.
var exec = './node_modules/.bin/mocha';

// Add any optional parameters.
if (typeof testConfig.mocha.options !== 'undefined')
{
   /* istanbul ignore if */
   if (!Array.isArray(testConfig.mocha.options))
   {
      throw new Error(
       "TyphonJS NPM script (test) error: 'test.mocha.options' entry is not an array in '.npmscriptrc'.");
   }

   exec += ' ' + testConfig.mocha.options.join(' ');
}

// Append test source glob
exec += ' ' + testConfig.mocha.source;

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });