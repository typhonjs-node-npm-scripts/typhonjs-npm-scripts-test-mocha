'use strict';

/**
 * testAll -- Initiates the testing process with Istanbul and Mocha invoking an all inclusive test
 * `./test-scripts/mocha/TestScriptsRunner.js` which runs all TyphonJS NPM scripts directly so that they are
 * instrumented by Istanbul.
 */

var cp = require('child_process');

var exec;

// Notify what command is being executed then execute it.
exec = 'npm run test-mocha';
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Notify what command is being executed then execute it.
exec = 'npm run test-mocha-istanbul';
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Notify what command is being executed then execute it.
exec = 'npm run test-mocha-istanbul-report';
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Notify what command is being executed then execute it.
exec = 'npm run test-alternate-mocha';
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Notify what command is being executed then execute it; this one fails!
exec = 'npm run test-error-mocha';
process.stdout.write('Executing: ' + exec + '\n');

var thrown = false;
try { cp.execSync(exec, { stdio: ['ignore', 'ignore', 'ignore'] }); }
catch (err)
{
   process.stdout.write('Successfully failed / threw error.\n');
   thrown = true;
}
if (!thrown) { throw new Error("Failed to throw error for 'test-error-mocha'."); }