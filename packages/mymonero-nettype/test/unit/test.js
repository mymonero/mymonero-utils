/* eslint-env mocha */

var assert = require('assert')
const { AssertionError } = require('assert');
var nettype = require('../../index')

describe('MyMonero Net Type', function () {
  describe('#nettypes', function () {
    it('should return list of network types', function () {
      assert.deepStrictEqual({
        MAINNET: 0,
        TESTNET: 1,
        STAGENET: 2,
        FAKECHAIN: 3,
        UNDEFINED: 4
      }, nettype.network_type)
    })
    it('should return mainnet', function () {
      assert.deepStrictEqual("MAINNET", nettype.nettype_to_API_string(0))
    })
    it('should throw for unknowns', function () {
      try {
        nettype.nettype_to_API_string(5); // this should fail
        assert.fail('expected exception not thrown'); // this throws an AssertionError
      } catch (e) { // this catches all errors, those thrown by the function under test
                    // and those thrown by assert.fail
        if (e instanceof AssertionError) {
          // bubble up the assertion error
          throw e;
        }
        assert.strictEqual(e.message, 'Unrecognized nettype');
      }
    })

    it('should return prefix for standard address on mainnet', function () {
        assert.strictEqual(18, nettype.cryptonoteBase58PrefixForStandardAddressOn(0));
    })

    it('should return prefix for standard address on testnet', function () {
      assert.strictEqual(53, nettype.cryptonoteBase58PrefixForStandardAddressOn(1));
    })

    it('should return prefix for standard address on stagenet', function () {
      assert.strictEqual(24, nettype.cryptonoteBase58PrefixForStandardAddressOn(2));
    })

    it('should throw for unknown net for standard address', function () {
      try {
        nettype.cryptonoteBase58PrefixForStandardAddressOn(5); // this should fail
        assert.fail('expected exception not thrown'); // this throws an AssertionError
      } catch (e) { // this catches all errors, those thrown by the function under test
                    // and those thrown by assert.fail
        if (e instanceof AssertionError) {
          // bubble up the assertion error
          throw e;
        }
        assert.strictEqual(e.message, 'Illegal nettype');
      }
    })

    it('should return prefix for integrated address on mainnet', function () {
      assert.strictEqual(19, nettype.cryptonoteBase58PrefixForIntegratedAddressOn(0));
    })

    it('should return prefix for integrated address on testnet', function () {
      assert.strictEqual(54, nettype.cryptonoteBase58PrefixForIntegratedAddressOn(1));
    })

    it('should return prefix for integrated address on stagenet', function () {
      assert.strictEqual(25, nettype.cryptonoteBase58PrefixForIntegratedAddressOn(2));
    })

    it('should throw for unknown net for integrated address', function () {
      try {
        nettype.cryptonoteBase58PrefixForIntegratedAddressOn(5); // this should fail
        assert.fail('expected exception not thrown'); // this throws an AssertionError
      } catch (e) { // this catches all errors, those thrown by the function under test
                    // and those thrown by assert.fail
        if (e instanceof AssertionError) {
          // bubble up the assertion error
          throw e;
        }
        assert.strictEqual(e.message, 'Illegal nettype');
      }
    })

    it('should return prefix for sub address on mainnet', function () {
      assert.strictEqual(42, nettype.cryptonoteBase58PrefixForSubAddressOn(0));
    })

    it('should return prefix for sub address on testnet', function () {
      assert.strictEqual(63, nettype.cryptonoteBase58PrefixForSubAddressOn(1));
    })

    it('should return prefix for sub address on stagenet', function () {
      assert.strictEqual(36, nettype.cryptonoteBase58PrefixForSubAddressOn(2));
    })

    it('should throw for unknown net for sub address', function () {
      try {
        nettype.cryptonoteBase58PrefixForSubAddressOn(5); // this should fail
        assert.fail('expected exception not thrown'); // this throws an AssertionError
      } catch (e) { // this catches all errors, those thrown by the function under test
                    // and those thrown by assert.fail
        if (e instanceof AssertionError) {
          // bubble up the assertion error
          throw e;
        }
        assert.strictEqual(e.message, 'Illegal nettype');
      }
    })
  })
})
