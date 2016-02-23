'use strict';

var assert =      require('chai').assert;

var TestClass =   require('../fixture/TestClass');

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
      var test = new TestClass();

      assert('Test Success' === test.test());
   });
});