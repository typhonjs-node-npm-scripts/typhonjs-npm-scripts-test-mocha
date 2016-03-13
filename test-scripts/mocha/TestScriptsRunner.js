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
    * Test `../../scripts/mocha.js`.
    */
   it('test', function()
   {
      require('../../scripts/mocha.js');
   });

   /**
    * Test `../../scripts/mocha-istanbul.js`.
    */
   it('test-coverage', function()
   {
      // Store current TRAVIS environment variable.
      var origTravis = process.env.TRAVIS;
      delete process.env.TRAVIS;

      fs.emptyDirSync('./coverage');

      // Instruments test-coverage script.
      require('../../scripts/mocha-istanbul.js');

      // Verify that there are files / directories in `./coverage`.

      var files = fs.readdirSync('./coverage');
      assert(files.length > 0);

      fs.emptyDirSync('./coverage');

      // Restore Travis environment variable
      if (typeof origTravis !== 'undefined') { process.env.TRAVIS = origTravis; }
   });

   /**
    * Test `../../scripts/mocha-istanbul-report.js`.
    */
   it('test-coverage', function()
   {
      // Store current TRAVIS environment variable.
      var origTravis = process.env.TRAVIS;
      delete process.env.TRAVIS;

      fs.emptyDirSync('./coverage');

      // Instruments test-coverage script.
      require('../../scripts/mocha-istanbul-report.js');

      // Verify that there are files / directories in `./coverage`.

      var files = fs.readdirSync('./coverage');
      assert(files.length > 0);

      fs.emptyDirSync('./coverage');

      // Restore Travis environment variable
      if (typeof origTravis !== 'undefined') { process.env.TRAVIS = origTravis; }
   });
});