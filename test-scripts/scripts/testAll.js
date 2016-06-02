'use strict';

/**
 * testAll -- Initiates the testing process with Istanbul and Mocha invoking an all inclusive test
 * `./test-scripts/mocha/TestScriptsRunner.js` which runs all TyphonJS NPM scripts directly so that they are
 * instrumented by Istanbul.
 */

var cp = require('child_process');

// Append test source glob
var mochaOptions = '-t 120000 --recursive ./test-scripts/mocha/TestScriptsRunner.js';

// Includes only the TyphonJS node_modules NPM scripts. Outputs to `coverage-test`.
var istanbulOptions = "-x '[ **/test-scripts/** **/test-src/** ]' --dir coverage-test ";

var exec;

/**
 * If running on Travis CI only generate lcov data and pipe to Codecov.
 */
if (process.env.TRAVIS)
{
   exec = './node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha ' + istanbulOptions
    + ' --report lcovonly -- ' + mochaOptions + ' && ./node_modules/.bin/codecov';
}
else
{
   exec = './node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha ' + istanbulOptions + ' -- '
    + mochaOptions;
}

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });