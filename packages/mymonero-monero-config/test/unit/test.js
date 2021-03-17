/* eslint-env mocha */

var assert = require('assert')
var config = require('../../index')
const JSBigInt = require('@mymonero/mymonero-bigint').BigInteger

describe('MyMonero Monero Config', function () {
  describe('#config', function () {
    it('fetch coin unit places from config', function () {
      assert.strictEqual(12, config.coinUnitPlaces)
    })
    it('fetch tx min confirms from config', function () {
      assert.strictEqual(10, config.txMinConfirms)
    })
    it('fetch coin symbol from config', function () {
      assert.strictEqual('XMR', config.coinSymbol)
    })
    it('fetch open alias prefix from config', function () {
      assert.strictEqual("xmr", config.openAliasPrefix)
    })
    it('fetch coin name from config', function () {
      assert.strictEqual("Monero", config.coinName)
    })
    it('fetch coin url prefix from config', function () {
      assert.strictEqual("monero:", config.coinUriPrefix)
    })
    it('fetch dust threshold from config', function () {
      assert.deepStrictEqual(new JSBigInt('2000000000'), config.dustThreshold)
    })
    it('fetch max block number from config', function () {
      assert.strictEqual(500000000, config.maxBlockNumber)
    })
    it('fetch avg block time from config', function () {
      assert.strictEqual(60, config.avgBlockTime)
    })
  })
})
