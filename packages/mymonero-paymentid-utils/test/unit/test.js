/* eslint-env mocha */

var assert = require('assert')
const { AssertionError } = require('assert');
var paymentTool = require('../../index')

describe('Monero Payment IDs', function () {
    it('is a valid short payment id', function () {
      assert.strictEqual(true, paymentTool.IsValidPaymentIDOrNoPaymentID('f020853457bd110b'))
    })

    it('not a valid short payment id', function () {
      assert.strictEqual(false, paymentTool.IsValidPaymentIDOrNoPaymentID('00000000'))
    })

    it('is a valid long payment id', function () {
      assert.strictEqual(true, paymentTool.IsValidPaymentIDOrNoPaymentID('75d2d810e653b35a9c8cb611faa4e1faa839afc22fc8f757ed6491bf34cb7262'))
    })

    it('not a valid long payment id', function () {
      assert.strictEqual(false, paymentTool.IsValidPaymentIDOrNoPaymentID('75d2d810e653b35a9c8cb611faa4e1faa839afc22fc8f757ed6491bf34cXX'))
    })

    it('null payment id', function () {
      assert.strictEqual(true, paymentTool.IsValidPaymentIDOrNoPaymentID(null))
    })

    it('empty payment id', function () {
      assert.strictEqual(true, paymentTool.IsValidPaymentIDOrNoPaymentID(''))
    })

    it('undefined payment id', function () {
      assert.strictEqual(true, paymentTool.IsValidPaymentIDOrNoPaymentID())
    })

})
