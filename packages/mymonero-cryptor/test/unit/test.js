/* eslint-env mocha */

var assert = require('assert')
var cryptor = require('../../index')

describe('Cryptor module', function () {
    it('should encrypt text', async function () {
      let result = await cryptor.New_EncryptedBase64String__Async('testing test', '111111')
      let result2 = await cryptor.New_DecryptedString__Async(result, '111111')
      assert.strictEqual('testing test', result2)
    })
})
