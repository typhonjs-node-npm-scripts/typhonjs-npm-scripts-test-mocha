'use strict';

var assert =   require('chai').assert;
var fs =       require('fs-extra');

fs.emptyDirSync('./coverage-test');

/**
 * Runs the following scripts:
 * `../../scripts/test.js`
 * `../../scripts/test-coverage.js`
 *
 * @test {onHandleCode}
 */
describe('Script Test', function()
{
   /**
    * Test `../../scripts/test.js`.
    */
   it('test', function()
   {
      require('../../scripts/test.js');
   });

   /**
    * Test `../../scripts/test-coverage.js`.
    */
   it('test-coverage', function()
   {
console.log('!! TestScriptsRunner - 0 - process.env.TRAVIS: ' + process.env.TRAVIS);

      // Store current TRAVIS environment variable.
      var origTravis = process.env.TRAVIS;
      delete process.env.TRAVIS;

      fs.emptyDirSync('./coverage');

console.log('!! TestScriptsRunner - 1 - process.env.TRAVIS: ' + process.env.TRAVIS);

      // Instruments test-coverage script.
      require('../../scripts/test-coverage.js');

      // Verify that there are files / directories in `./coverage`.

      var files = fs.readdirSync('./coverage');
      assert(files.length > 0);

      fs.emptyDirSync('./coverage');

      // Restore Travis environment variable
      if (typeof origTravis !== 'undefined')
      {
         process.env.TRAVIS = origTravis;
      }
   });
});