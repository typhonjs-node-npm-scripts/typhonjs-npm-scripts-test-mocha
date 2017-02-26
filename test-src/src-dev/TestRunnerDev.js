'use strict';

var assert =      require('chai').assert;

var TestDummy =   require('../fixture/TestDummy');

/**
 * Provides a basic test.
 *
 * @test {onHandleCode}
 */
describe('Test Runner Dev', function()
{
   it('Verify TestDummy Dev', function()
   {
      // Attempt to load transpiled test.
      var test = new TestDummy();

      assert('Test Success' === test.test());
   });
});