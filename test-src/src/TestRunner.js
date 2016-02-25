'use strict';

var assert =      require('chai').assert;

var TestDummy =   require('../fixture/TestDummy');

/**
 * Provides a basic test.
 *
 * @test {onHandleCode}
 */
describe('Test Runner', function()
{
   it('Verify TestClass', function()
   {
      // Attempt to load transpiled test.
      var test = new TestDummy();

      assert('Test Success' === test.test());
   });
});