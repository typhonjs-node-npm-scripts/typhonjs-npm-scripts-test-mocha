'use strict';

/**
 * mocha-istanbul-report -- Initiates the testing process with Mocha & Istanbul. A valid `.npmscriptrc` configuration
 * file must be located in the root path. This configuration file contains the following options:
 * ```
 * (string)          report - An optional command to execute that may upload results to Codecov on Travis CI.
 *
 * (object)          istanbul - An object hash containing Istanbul configuration with the following options:
 *    (string)          command - The Istanbul command to execute (cover, check-coverage, instrument, report).
 *    (Array<string>)   options - An array of optional parameters which are appended to the invocation of Istanbul.
 *                                Please run `./node_modules/.bin/istanbul help` for all available options.
 *
 * (object)          mocha - An object hash containing Mocha configuration with the following options:
 *    (string)          source - The test source directory.
 *    (Array<string>)   options - An array of optional parameters which are prepended to the invocation of Mocha. Please
 *                                run `./node_modules/.bin/mocha --help` for all available options.
 * ```
 *
 * The main use case for this script is JSPM / SystemJS instrumented tests. After Mocha / Istanbul is executed
 * Istanbul with the report is invoked again to ensure that all source code instrumented by SystemJS is represented
 * in the report.
 *
 * When running on Travis CI a `test.travis` hash in `.npmscriptrc` may be provided which overrides any
 * data stored in the `test` hash. This is useful for specifying the `report` command when running on Travis CI.
 *
 */

var cp =                require('child_process');
var fs =                require('fs-extra');
var stripJsonComments = require('strip-json-comments');

// Verify that `.npmscriptrc` exists.
/* istanbul ignore next */
try
{
   if (!fs.statSync('./.npmscriptrc').isFile())
   {
      throw new Error("'.npmscriptrc' not found in root path: " + process.cwd());
   }
}
catch (err)
{
   throw new Error("TyphonJS NPM script (test-coverage) error: " + err);
}

// Verify that `Istanbul` exists.
/* istanbul ignore next */
try
{
   if (!fs.statSync('./node_modules/.bin/istanbul').isFile())
   {
      throw new Error("could not locate Istanbul at './node_modules/.bin/istanbul'.");
   }
}
catch (err)
{
   throw new Error("TyphonJS NPM script (test-coverage) error: " + err);
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
   throw new Error("TyphonJS NPM script (test-coverage) error: " + err);
}

// Load `.npmscriptrc` and strip comments.
var configInfo = JSON.parse(stripJsonComments(fs.readFileSync('./.npmscriptrc', 'utf-8')));

// Verify that mocha entry is an object.
/* istanbul ignore if */
if (typeof configInfo.test !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (test-coverage) error: 'test' entry is not an object or is missing in '.npmscriptrc'.");
}

var testConfig = configInfo.test;

/**
 * If running on Travis CI potentially copy any overrides from an internal `travis` key in `test` hash.
 */
if (process.env.TRAVIS && typeof testConfig.travis === 'object')
{
   for (var key in testConfig.travis) { testConfig[key] = testConfig.travis[key]; }
}

// Verify that Istanbul entry is an object.
/* istanbul ignore if */
if (typeof testConfig.istanbul !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (test-coverage) error: 'test.istanbul' entry is not an object or is missing in "
    + "'.npmscriptrc'.");
}

// Verify that Istanbul command entry is a string.
/* istanbul ignore if */
if (typeof testConfig.istanbul.command !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (test-coverage) error: 'test.istanbul.command' entry is not a string or is missing in "
    + "'.npmscriptrc'.");
}

var istanbulOptions = testConfig.istanbul.command;

// Add any Istanbul optional parameters.
if (typeof testConfig.istanbul.options !== 'undefined')
{
   /* istanbul ignore if */
   if (!Array.isArray(testConfig.istanbul.options))
   {
      throw new Error(
       "TyphonJS NPM script (test-coverage) error: 'test.istanbul.options' entry is not an array in "
       + "'.npmscriptrc'.");
   }

   istanbulOptions += ' ' + testConfig.istanbul.options.join(' ');
}

// Verify that mocha entry is an object.
/* istanbul ignore if */
if (typeof testConfig.mocha !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (test-coverage) error: 'test.mocha' entry is not an object or is missing in "
    + "'.npmscriptrc'.");
}

// Verify that source entry is a string.
/* istanbul ignore if */
if (typeof testConfig.mocha.source !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (test-coverage) error: 'test.mocha.source' entry is not a string or is missing in "
    + "'.npmscriptrc'.");
}

// Create mocha options.
var mochaOptions = '';

// Add any optional parameters.
if (typeof testConfig.mocha.options !== 'undefined')
{
   /* istanbul ignore if */
   if (!Array.isArray(testConfig.mocha.options))
   {
      throw new Error(
       "TyphonJS NPM script (test-coverage) error: 'test.mocha.options' entry is not an array in '.npmscriptrc'.");
   }

   mochaOptions += ' ' + testConfig.mocha.options.join(' ');
}

// Append test source glob
mochaOptions += ' ' + testConfig.mocha.source;

// Build executable statement
var exec = './node_modules/.bin/istanbul ' + istanbulOptions + ' ./node_modules/mocha/bin/_mocha --'
 + mochaOptions;

// Empty the standard Istanbul coverage directory.
fs.emptyDirSync('./coverage');

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// In some cases such as instrumenting JSPM / SystemJS tests `Istanbul report` needs to be run again for all sources to
// be represented in report.
exec = './node_modules/.bin/istanbul report';
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Load any report command
var reportCommand = '';

if (typeof testConfig.report === 'string') { reportCommand = testConfig.report; }

// Execute any coverage command
if (reportCommand !== '')
{
   exec = reportCommand;
   process.stdout.write('Executing: ' + exec + '\n');
   cp.execSync(exec, { stdio: 'inherit' });
}
