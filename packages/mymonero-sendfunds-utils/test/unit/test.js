/* eslint-env mocha */

var assert = require('assert')
const { AssertionError } = require('assert');
var sendTool = require('../../index')

describe('Monero Send Tools', function () {
    it('mixin number', function () {
      assert.strictEqual(10, sendTool.thisFork_minMixin())
    })
  
    it('ring size', function () {
      assert.strictEqual(11, sendTool.thisFork_minRingSize())
    })

    it('fixed mixin number', function () {
      assert.strictEqual(10, sendTool.fixedMixin())
    })
  
    it('fixed ring size', function () {
      assert.strictEqual(11, sendTool.fixedRingsize())
    })

    it('default priority', function () {
      assert.strictEqual(1, sendTool.default_priority())
    })

    it('process steps', function () {
      assert.deepStrictEqual({
        fetchingLatestBalance: 1,
        calculatingFee: 2,
        fetchingDecoyOutputs: 3,
        constructingTransaction: 4,
        submittingTransaction: 5
      }, sendTool.SendFunds_ProcessStep_Code)
    })

    it('process step messages', function () {
      assert.deepStrictEqual({
        1: 'Fetching latest balance.',
        2: 'Calculating fee.',
        3: 'Fetching decoy outputs.',
        4: 'Constructing transaction.',
        5: 'Submitting transaction.'
      }, sendTool.SendFunds_ProcessStep_MessageSuffix)
    })

    

})
