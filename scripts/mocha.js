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
var path =              require('path');
var stripJsonComments = require('strip-json-comments');

var configName = '';
var npmScript = getNPMScript();
var testEntry = 'test';

// Potentially set a new testEntry.
if (typeof process.argv[2] === 'string')
{
   testEntry = process.argv[2];
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
   throw new Error("TyphonJS NPM script (" + testEntry + ") error: " + err);
}

var configInfo;

// Attempt to require `.npmscriptrc.js`
/* istanbul ignore next */
try
{
   if (fs.statSync('./.npmscriptrc.js').isFile())
   {
      configInfo = require(path.resolve('./.npmscriptrc.js'));
      configName = '.npmscriptrc.js';
   }
}
catch (err)
{
   // Attempt to load `.npmscriptrc` and strip comments.
   /* istanbul ignore next */
   try
   {
      if (fs.statSync('./.npmscriptrc').isFile())
      {
         configInfo = JSON.parse(stripJsonComments(fs.readFileSync('./.npmscriptrc', 'utf-8')));
         configName = '.npmscriptrc';
      }
   }
   catch (err) { /* nop */ }
}

// Exit now if no configInfo object has been loaded.
if (typeof configInfo !== 'object')
{
   throw new Error("TyphonJS NPM script (" + npmScript + ") could not load `./npmscriptrc.js` or `./npmscriptrc`.");
}

// Verify that mocha entry is an object.
if (typeof configInfo[testEntry] !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (" + npmScript + ") error: '" + testEntry
     + "' entry is not an object or is missing in '" + configName + "'.");
}

var testConfig = configInfo[testEntry];

// Verify that mocha entry is an object.
/* istanbul ignore if */
if (typeof testConfig.mocha !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (" + npmScript + ") error: '" + testEntry
     + ".mocha' entry is not an object or is missing in '" + configName + "'.");
}

// Verify that source entry is a string.
/* istanbul ignore if */
if (typeof testConfig.mocha.source !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (" + npmScript + ") error: '" + testEntry
     + ".mocha.source' entry is not a string or is missing in '" + configName + "'.");
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
       "TyphonJS NPM script (" + npmScript + ") error: '" + testEntry
        + ".mocha.options' entry is not an array in '" + configName + "'.");
   }

   exec += ' ' + testConfig.mocha.options.join(' ');
}

// Append test source glob
exec += ' ' + testConfig.mocha.source;

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

/**
 * Gets the NPM script name.
 * @returns {string}
 */
function getNPMScript()
{
   try
   {
      var npmArgv = JSON.parse(process.env['npm_config_argv']).cooked;
      return npmArgv[1];
   }
   catch (err)
   {
      console.error("could not obtain 'npm_config_argv' environment variable.");
      process.exit(1);
   }
}
