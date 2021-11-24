'use strict'

const assert = require('assert')
const chai = require('chai')
const nettype = 'MAINNET'

describe('cryptonote_utils tests', function () {
  it('create_address aka address_and_keys_from_seed', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.addressAndKeysFromSeed('9c973aa296b79bbf452781dd3d32ad7f', nettype)
    const expected = {
      address: '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
      publicViewKey: '080a6e9b17de47ec62c8a1efe0640b554a2cde7204b9b07bdf9bd225eeeb1c47',
      privateViewKey: '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
      publicSpendKey: '3eb884d3440d71326e27cc07a861b873e72abd339feb654660c36a008a0028b3',
      privateSpendKey: '4e6d43cd03812b803c6f3206689f5fcc910005fc7e91d50d79b0776dbefcd803'
    }
    assert.deepStrictEqual(
      decoded,
      expected
    )
  })

  it('address and keys from seed with invalid seed', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.addressAndKeysFromSeed('9c973aa296b79bbf452781dd3d32ad7#', nettype)
    }).to.throw('Invalid seed')
  })

  it('is integrated address a subaddress', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.isSubaddress('4L6Gcy9TAHqPVPMnqa5cPtJK25tr7maE7LrJe67vzumiCtWwjDBvYnHZr18wFexJpih71Mxsjv8b7EpQftpB9NjPaL41VrjstLM5WevLZx', nettype)
    assert.strictEqual(
      decoded,
      false
    )
  })

  // @todo add is subaddress test that is true

  it('is address an integrated address', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.isIntegratedAddress('4L6Gcy9TAHqPVPMnqa5cPtJK25tr7maE7LrJe67vzumiCtWwjDBvYnHZr18wFexJpih71Mxsjv8b7EpQftpB9NjPaL41VrjstLM5WevLZx', nettype)
    assert.strictEqual(
      decoded,
      true
    )
  })

  it('is primary address an integrated address', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.isIntegratedAddress('43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg', nettype)
    assert.strictEqual(
      decoded,
      false
    )
  })

  it('creates a random payment id', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.generatePaymentId()
    assert.strictEqual(
      decoded.length,
      16
    )
  })

  it('creates new integrated address', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.newIntegratedAddress(
      '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
      '07749f00b7e3a2f6',
      nettype
    )
    assert.strictEqual(
      decoded,
      '4DhdwdSDgoS9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqmCt59Rh7NPSyUnpkWoC'
    )
  })

  it('creates new integrated address with invalid payment id', async function () {
    const WABridge = await require('../../src/index')({})
    chai.expect(() => {
      WABridge.newIntegratedAddress(
        '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
        '07749f00b7e3a2f#',
        'MAINNET'
      )
    }).to.throw('Not a valid payment Id')
  })

  // @todo add check for the paymentid length exception

  it('checks if two mnemonics are the same', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.compareMnemonics(
      'foxe selfish hum nexus juven dodeg pepp ember biscuti elap jazz vibrate biscui',
      'fox sel hum nex juv dod pep emb bis ela jaz vib bis'
    )
    assert.strictEqual(
      decoded,
      true
    )
  })

  it('derive mnemonic from seed', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.mnemonicFromSeed(
      '9c973aa296b79bbf452781dd3d32ad7f',
      'English'
    )
    assert.strictEqual(
      decoded,
      'foxes selfish humid nexus juvenile dodge pepper ember biscuit elapse jazz vibrate biscuit'
    )
  })

  it('derive mnemonic from invalid language', async function () {
    const WABridge = await require('../../src/index')({})
    chai.expect(() => {
      WABridge.mnemonicFromSeed(
        '9c973aa296b79bbf452781dd3d32ad7f',
        'Foo'
      )
    }).to.throw("Couldn't get mnemonic from hex seed")
  })

  it('derive mnemonic from invalid seed', async function () {
    const WABridge = await require('../../src/index')({})
    chai.expect(() => {
      WABridge.mnemonicFromSeed(
        '9c973aa296b79bbf452781dd3d32ad7#',
        'English'
      )
    }).to.throw('Invalid seed')
  })

  it('derive seed and keys from mnemonic', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.seedAndKeysFromMnemonic(
      'foxe selfish hum nexus juven dodeg pepp ember biscuti elap jazz vibrate biscui',
      'MAINNET'
    )
    const expected = {
      seed: '9c973aa296b79bbf452781dd3d32ad7f',
      mnemonicLanguage: 'English',
      address: '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
      publicViewKey: '080a6e9b17de47ec62c8a1efe0640b554a2cde7204b9b07bdf9bd225eeeb1c47',
      privateViewKey: '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
      publicSpendKey: '3eb884d3440d71326e27cc07a861b873e72abd339feb654660c36a008a0028b3',
      privateSpendKey: '4e6d43cd03812b803c6f3206689f5fcc910005fc7e91d50d79b0776dbefcd803'
    }
    assert.deepStrictEqual(
      decoded,
      expected
    )
  })

  it('throw error when passed numeric mnemonic derive seed and keys from mnemonic', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.seedAndKeysFromMnemonic(
        9999,
        'MAINNET'
      )
    }).to.throw('Invalid mnemonic')
  })

  it('throw error when passed null mnemonic derive seed and keys from mnemonic', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.seedAndKeysFromMnemonic(
        null,
        'MAINNET'
      )
    }).to.throw('Invalid mnemonic')
  })

  it('throw error when passed incomplete mnemonic derive seed and keys from mnemonic', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.seedAndKeysFromMnemonic(
        'one two three four five six seven eight nine ten eleven',
        'MAINNET'
      )
    }).to.throw('Invalid number of words. must be 13 or 25-word mnemonic')
  })

  it('throw error when passed invalid 13-word mnemonic derive seed and keys from mnemonic', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.seedAndKeysFromMnemonic(
        'one two three four five six seven eight nine ten eleven twelve thirteen',
        'MAINNET'
      )
    }).to.throw('Invalid 13-word mnemonic')
  })

  it('throw error when passed invalid 25-word mnemonic derive seed and keys from mnemonic', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.seedAndKeysFromMnemonic(
        'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen ninteen twenty twentyone twentytwo twentythree twentyfour twentyfive',
        'MAINNET'
      )
    }).to.throw('Invalid 25-word mnemonic')
  })

  it('throw error when passed invalid nettype derive seed and keys from mnemonic', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.seedAndKeysFromMnemonic(
        'foxe selfish hum nexus juven dodeg pepp ember biscuti elap jazz vibrate biscui',
        'RANDOMNET'
      )
    }).to.throw('Invalid nettype')
  })

  it('creates new wallet based on locale', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.generateWallet(
      'en-US',
      'MAINNET'
    )
    const keys = Object.keys(decoded)
    const expected = [
      'mnemonic',
      'mnemonicLanguage',
      'seed',
      'address',
      'publicViewKey',
      'privateViewKey',
      'publicSpendKey',
      'privateSpendKey'
    ]
    assert.deepStrictEqual(
      keys,
      expected
    )
  })

  it('validate login components', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.isValidKeys(
      '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
      '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
      '4e6d43cd03812b803c6f3206689f5fcc910005fc7e91d50d79b0776dbefcd803',
      '',
      nettype
    )
    const expected = {
      isValid: true,
      isViewOnly: false,
      publicViewKey: '080a6e9b17de47ec62c8a1efe0640b554a2cde7204b9b07bdf9bd225eeeb1c47',
      publicSpendKey: '3eb884d3440d71326e27cc07a861b873e72abd339feb654660c36a008a0028b3'
    }
    assert.deepStrictEqual(
      decoded,
      expected
    )
  })

  it('validate invalid spend key login components', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.isValidKeys(
        '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
        '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
        '4e6d43cd03812b803c6f3206689f5fcc910005fc7e91d50d79b0776dbefcd80#',
        '',
        'MAINNET'
      )
    }).to.throw('Invalid spend key')
  })

  it('validate incorrect spend key login components', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.isValidKeys(
        '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
        '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
        '4e6d43cd03812b803c6f3206689f5fcc910005fc7e91d50d79b0776dbefcd806',
        '',
        'MAINNET'
      )
    }).to.throw("Address doesn't match spend key")
  })

  it('decode mainnet primary address', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.decodeAddress(
      '49qwWM9y7j1fvaBK684Y5sMbN8MZ3XwDLcSaqcKwjh5W9kn9qFigPBNBwzdq6TCAm2gKxQWrdZuEZQBMjQodi9cNRHuCbTr',
      nettype
    )
    const expected = {
      isSubaddress: false,
      paymentId: undefined,
      publicSpendKey: 'd8f1e81ecbe25ce8b596d426fb02fe7b1d4bb8d14c06b3d3e371a60eeea99534',
      publicViewKey: '576f0e61e250d941746ed147f602b5eb1ea250ca385b028a935e166e18f74bd7'
    }
    assert.deepStrictEqual(decoded, expected)
  })

  it('decode mainnet integrated address', async function () {
    const WABridge = await require('../../src/index')({})
    const decoded = WABridge.decodeAddress(
      '4KYcX9yTizXfvaBK684Y5sMbN8MZ3XwDLcSaqcKwjh5W9kn9qFigPBNBwzdq6TCAm2gKxQWrdZuEZQBMjQodi9cNd3mZpgrjXBKMx9ee7c',
      nettype
    )
    const expected = {
      publicSpendKey: 'd8f1e81ecbe25ce8b596d426fb02fe7b1d4bb8d14c06b3d3e371a60eeea99534',
      publicViewKey: '576f0e61e250d941746ed147f602b5eb1ea250ca385b028a935e166e18f74bd7',
      isSubaddress: false,
      paymentId: '83eab71fbee84eb9'
    }
    assert.deepStrictEqual(decoded, expected)
  })

  it('decode invalid address', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.decodeAddress(
        '49qwWM9y7j1fvaBK684Y5sMbN8MZ3$%wDLcSaqcKwjh5W9kn9qFigPBNBwzdq6TCAm2gKxQWrdZuEZQBMjQodi9cNRHuCbTr',
        nettype
      )
    }).to.throw('Invalid address')
  })

  it('generate key image', async function () {
    const WABridge = await require('../../src/index')({})

    const result = WABridge.generateKeyImage(
      '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
      '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
      '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
      '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
      1
    )
    assert.strictEqual(
      result,
      '8a90c3e855fde0a85e71c9c345a26d094a56a5070b0bba6c1e9495bd49aa0741'
    )
  })

  it('generate key image throws error on invalid output index', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        'z'
      )
    }).to.throw('Invalid outputIndex is not a number')
  })

  it('generate key image throws error on missing output index', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        null
      )
    }).to.throw('Missing outputIndex')
  })

  it('generate key image throws error on empty output index', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        ''
      )
    }).to.throw('Missing outputIndex')
  })

  it('generate key image throws error on invalid length tx public key', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cf',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        0
      )
    }).to.throw('Invalid txPublicKey length')
  })

  it('generate key image throws error on invalid length private view key', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f80997',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        0
      )
    }).to.throw('Invalid privateViewKey length')
  })

  it('generate key image throws error on invalid length public spend key', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50f',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        0
      )
    }).to.throw('Invalid publicSpendKey length')
  })

  it('generate key image throws error on invalid length private spend key', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e',
        0
      )
    }).to.throw('Invalid privateSpendKey length')
  })

  it('generate key image throws error on invalid private view key', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f80997zz',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        0
      )
    }).to.throw('Invalid private view key')
  })

  it('generate key image throws error on invalid private spend key', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104ezz',
        0
      )
    }).to.throw('Invalid private spend key')
  })

  it('generate key image throws error on invalid public spend key', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fzz',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        0
      )
    }).to.throw('Invalid public spend key')
  })

  it('generate key image throws error on invalid private spend key', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.generateKeyImage(
        '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cfzz',
        '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
        '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
        '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
        0
      )
    }).to.throw('Invalid tx public key')
  })

  // it('generate key image throws error unable to generate key image', async function () {
  //   const WABridge = await require('../src/index')({})

  //   chai.expect(() => {
  //     WABridge.generateKeyImage(
  //       '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
  //       '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099777',
  //       '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
  //       '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
  //       0
  //     )
  //   }).to.throw('Unable to generate key image')
  // })

  it('estimate tx fee', async function () {
    const WABridge = await require('../../src/index')({})

    const result = WABridge.estimateTxFee(1, 6000)

    assert.strictEqual(
      result,
      16062000
    )
  })

  it('estimate tx fee invalid priority', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.estimateTxFee(5, 6000)
    }).to.throw('Invalid priority. must be between 1 to 4')
  })

  it('estimate tx fee invalid priority as string', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.estimateTxFee('test', 6000)
    }).to.throw('Invalid priority. must be between 1 to 4')
  })

  it('estimate tx fee invalid feePerb as string', async function () {
    const WABridge = await require('../../src/index')({})

    chai.expect(() => {
      WABridge.estimateTxFee(1, 'test')
    }).to.throw('Invalid feePerb. must be an number')
  })
})
