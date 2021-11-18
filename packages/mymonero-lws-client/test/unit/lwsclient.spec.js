'use strict'

const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.should()
chai.use(chaiAsPromised)
const expect = chai.expect

const LWSClient = require('../../src/index')

describe('lwsclient tests', function () {
  it('can login', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/login').reply(200, { new_address: false, start_height: 2547018 })

    const lwsClient = new LWSClient({ httpClient: axios })

    const result = await lwsClient.login(
      '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
      '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
      true
    )

    const expected = {
      isNewAddress: false,
      startHeight: 2547018
    }

    assert.deepStrictEqual(
      result,
      expected
    )
  })

  it('login throws error on invalid server address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/login').networkError()

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.login()).to.be.rejectedWith(Error, 'no response')
  })

  it('login throws error on unknown address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/login').reply(403)

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.login()).to.be.rejectedWith(Error, 'account does not exist')
  })

  it('login throws error on empty address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/login').reply(422)

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.login()).to.be.rejectedWith(Error, 'missing or invalid parameters')
  })

  it('can get address txs', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_address_txs').reply(200, {
      transactions: [
        {
          hash: '42867117f6623ddad4684f2f94ffdea253925e40a5d30d1ca641c2b45989807e',
          id: 17862904,
          timestamp: '2021-08-03T10:58:23Z',
          total_received: '10000000000',
          total_sent: '0',
          unlock_time: 0,
          height: 2418951,
          coinbase: false,
          mempool: false,
          mixin: 10
        },
        {
          hash: 'ed71881597535d09ad9e73a5889aa2130137560566f87de1b5b7c2f25358ae3b',
          id: 17864289,
          timestamp: '2021-08-03T11:54:47Z',
          total_received: '0',
          total_sent: '10000000000',
          fee: '70095000',
          unlock_time: 0,
          height: 2418982,
          coinbase: false,
          mempool: false,
          mixin: 10,
          spent_outputs: []
        }
      ],
      start_height: 17862374,
      scanned_height: 17864912,
      blockchain_height: 2418990,
      scanned_block_height: 2418990,
      transaction_height: 17864912,
      scanned_height: 17864912
    })
    const lwsClient = new LWSClient({ httpClient: axios })

    const result = await lwsClient.getAddressTxs(
      '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
      '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
    )

    const expected = {
      start_height: 17862374,
      scanned_block_height: 2418990,
      blockchain_height: 2418990,
      scanned_height: 17864912,
      transaction_height: 17864912,
      transactions: [
        {
          hash: '42867117f6623ddad4684f2f94ffdea253925e40a5d30d1ca641c2b45989807e',
          id: 17862904,
          timestamp: '2021-08-03T10:58:23Z',
          total_received: '10000000000',
          total_sent: '0',
          unlock_time: 0,
          height: 2418951,
          coinbase: false,
          mempool: false,
          mixin: 10
        },
        {
          hash: 'ed71881597535d09ad9e73a5889aa2130137560566f87de1b5b7c2f25358ae3b',
          id: 17864289,
          timestamp: '2021-08-03T11:54:47Z',
          total_received: '0',
          total_sent: '10000000000',
          fee: '70095000',
          unlock_time: 0,
          height: 2418982,
          coinbase: false,
          mempool: false,
          mixin: 10,
          spent_outputs: []
        }
      ]
    }

    assert.deepStrictEqual(
      result,
      expected
    )
  })

  it('can get address txs with no transactions', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_address_txs').reply(200, {
      start_height: 17862374,
      scanned_height: 17864912,
      blockchain_height: 2418990,
      scanned_block_height: 2418990,
      transaction_height: 17864912,
      scanned_height: 17864912
    })
    const lwsClient = new LWSClient({ httpClient: axios })

    const result = await lwsClient.getAddressTxs(
      '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
      '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
    )

    const expected = {
      start_height: 17862374,
      scanned_height: 17864912,
      blockchain_height: 2418990,
      scanned_block_height: 2418990,
      transaction_height: 17864912,
      transactions: []
    }

    assert.deepStrictEqual(
      result,
      expected
    )
  })

  it('get address txs throws error on invalid server address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_address_txs').networkError()

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.getAddressTxs()).to.be.rejectedWith(Error, 'no response')
  })

  it('get address txs throws error on unknown address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_address_txs').reply(403)

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.getAddressTxs()).to.be.rejectedWith(Error, 'account does not exist')
  })

  it('get address txs throws error on empty address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_address_txs').reply(422)

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.getAddressTxs()).to.be.rejectedWith(Error, 'missing or invalid parameters')
  })

  it('get unspent outputs', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_unspent_outs').reply(200, {
      'amount': '4915189341745',
      'outputs': [
        {
          'amount': '400000000000',
          'public_key': 'cfdbedf495dc30be82d4934b72af8b1af98b4a35faf984f2c16e4866f45330ae',
          'index': 0,
          'global_index': 660333,
          'rct': '40dd3f5c6c1ff8fe353cb08881c182c29ff7d9ab0055ef36f54514db7e894ef17b1117f21a7ec92dae74f07a6dfdf791eb6d8946615c16ea38ab5a0fb0538d056eb5f5bcd5cccb8b91744845d4f3486eaa9e7d9d2ac51f7364628abf44150100',
          'tx_id': 2455631,
          'tx_hash': '354d9874b7b13befcf8f079520ad72b78dc62de6081765ce5490345c7623d41a',
          'tx_pub_key': 'fc7f85bf64c6e4f6aa612dbc8ddb1bb77a9283656e9c2b9e777c9519798622b2',
          'tx_prefix_hash': '4448cbd20af2f4f14286707cc35b742e5eaf184037317017794d003457d720e2',
          'spend_key_images': [
            'ae30ee23051dc0bdf10303fbd3b7d8035a958079eb66516b1740f2c9b02c804e',
            '3eb5bdbf119de8b0fea2b52e2c63ebfd2be152713326f7e0acb9c996a9007611',
            '3c8ee840913cb4163f5b705aeb1da0b9b234be67cb61abf21c6648f40964479f',
            '72fb0972751bfbcdd3ba62114d4371a25d54cf0e4c6c8ecb5bc0e3af1fafadab',
            '810aca616598c564ca856330a3677592a5390bdddadf3e82d1563731dd2eef3c',
            '423b9e89ed014f453eed8e914d7d8e77ca9f75805e5251750c35b09120b38755',
            'dde80dee4ed041ffc2d85c020509fbd568e0ce440b9a12a3268ffe5490d027f8',
            'f8bea7ac0b6777eb5c2db3574ee231cfaf5edbc590b4b3c98ccad5526b1312b7'
          ],
          'height': 1293044,
          'timestamp': '2021-08-12T13:24:59Z'
        },
        {
          'amount': '364000000000',
          'public_key': '583ee3787e11559d0440a2edbdc8ec993f68913a234875d2df401f7726c1dad5',
          'index': 1,
          'global_index': 664673,
          'rct': '98caf1149c4bfdac3603df8649721074aeb36d072a78dedc00c23ad9037ff4b89716ecc91c27637dde21492c6820dbbd4d7be5cc6a1e0ddbb6750a6802f042083f5ebc5807837be21951cf833674a7ea8896661cf6eaa45c0736ffc5fb88fd0a',
          'tx_id': 2457238,
          'tx_hash': 'a727cbcf59cc35f07066b314b53bc6239c4129f60e9ba1c7a8d5591b7a0b3055',
          'tx_pub_key': '74b6ba3dd36a85e6e9b5fe4fc093c1e57ec0dc52cbac5e487a2b7a8da091893d',
          'tx_prefix_hash': 'e6d3a3cf89fa01b093abaeff0085919331ca9cfdadeccfa58ed0d8de528b29ae',
          'spend_key_images': [
            '673ca2516ebb41d612692f3223c367457f685e92c3b6556b28630f9231bf5f54',
            '169baea6bc976ef3bd689e8e810d5d33ca80e2cea6ef28903db324b975a2156b',
            'e848a44a4aefea9d0870bc96d87707e0bf123f311682f252481bbe553e1a91ed',
            '5ddeb3b324094dec2a7ad6091937370c847c870c9abd730ee86062f8a4a93b24',
            '033f1c75e5c5682725f392dc722a14aa28aa6bb05823277065a09e4dd5005881',
            'dbb8e201a3635adf1cddfcd7053eb4d5c3e38afbb41f6cd1311bcf98adda1700'
          ],
          'height': 1293420,
          'timestamp': '2021-08-12T13:24:59Z'
        }
      ],
      'per_byte_fee': 6040,
      'fee_mask': 10000,
      'fork_version': 14
    })

    const lwsClient = new LWSClient({ httpClient: axios })
    const result = await lwsClient.unspentOutputs(
      '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
      '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
    )
    const expected = {
      amount: '4915189341745',
      outputs: [
        {
          amount: '400000000000',
          public_key: 'cfdbedf495dc30be82d4934b72af8b1af98b4a35faf984f2c16e4866f45330ae',
          index: 0,
          global_index: 660333,
          rct: '40dd3f5c6c1ff8fe353cb08881c182c29ff7d9ab0055ef36f54514db7e894ef17b1117f21a7ec92dae74f07a6dfdf791eb6d8946615c16ea38ab5a0fb0538d056eb5f5bcd5cccb8b91744845d4f3486eaa9e7d9d2ac51f7364628abf44150100',
          tx_id: 2455631,
          tx_hash: '354d9874b7b13befcf8f079520ad72b78dc62de6081765ce5490345c7623d41a',
          tx_pub_key: 'fc7f85bf64c6e4f6aa612dbc8ddb1bb77a9283656e9c2b9e777c9519798622b2',
          tx_prefix_hash: '4448cbd20af2f4f14286707cc35b742e5eaf184037317017794d003457d720e2',
          spend_key_images: [
            'ae30ee23051dc0bdf10303fbd3b7d8035a958079eb66516b1740f2c9b02c804e',
            '3eb5bdbf119de8b0fea2b52e2c63ebfd2be152713326f7e0acb9c996a9007611',
            '3c8ee840913cb4163f5b705aeb1da0b9b234be67cb61abf21c6648f40964479f',
            '72fb0972751bfbcdd3ba62114d4371a25d54cf0e4c6c8ecb5bc0e3af1fafadab',
            '810aca616598c564ca856330a3677592a5390bdddadf3e82d1563731dd2eef3c',
            '423b9e89ed014f453eed8e914d7d8e77ca9f75805e5251750c35b09120b38755',
            'dde80dee4ed041ffc2d85c020509fbd568e0ce440b9a12a3268ffe5490d027f8',
            'f8bea7ac0b6777eb5c2db3574ee231cfaf5edbc590b4b3c98ccad5526b1312b7'
          ],
          height: 1293044,
          timestamp: '2021-08-12T13:24:59Z'
        },
        {
          amount: '364000000000',
          public_key: '583ee3787e11559d0440a2edbdc8ec993f68913a234875d2df401f7726c1dad5',
          index: 1,
          global_index: 664673,
          rct: '98caf1149c4bfdac3603df8649721074aeb36d072a78dedc00c23ad9037ff4b89716ecc91c27637dde21492c6820dbbd4d7be5cc6a1e0ddbb6750a6802f042083f5ebc5807837be21951cf833674a7ea8896661cf6eaa45c0736ffc5fb88fd0a',
          tx_id: 2457238,
          tx_hash: 'a727cbcf59cc35f07066b314b53bc6239c4129f60e9ba1c7a8d5591b7a0b3055',
          tx_pub_key: '74b6ba3dd36a85e6e9b5fe4fc093c1e57ec0dc52cbac5e487a2b7a8da091893d',
          tx_prefix_hash: 'e6d3a3cf89fa01b093abaeff0085919331ca9cfdadeccfa58ed0d8de528b29ae',
          spend_key_images: [
            '673ca2516ebb41d612692f3223c367457f685e92c3b6556b28630f9231bf5f54',
            '169baea6bc976ef3bd689e8e810d5d33ca80e2cea6ef28903db324b975a2156b',
            'e848a44a4aefea9d0870bc96d87707e0bf123f311682f252481bbe553e1a91ed',
            '5ddeb3b324094dec2a7ad6091937370c847c870c9abd730ee86062f8a4a93b24',
            '033f1c75e5c5682725f392dc722a14aa28aa6bb05823277065a09e4dd5005881',
            'dbb8e201a3635adf1cddfcd7053eb4d5c3e38afbb41f6cd1311bcf98adda1700'
          ],
          height: 1293420,
          timestamp: '2021-08-12T13:24:59Z'
        }
      ],
      per_byte_fee: 6040,
      fee_mask: 10000,
      fork_version: 14
    }

    assert.deepStrictEqual(
      result,
      expected
    )
  })

  it('get unspent outputs throws error on invalid server address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_unspent_outs').networkError()

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.unspentOutputs()).to.be.rejectedWith(Error, 'no response')
  })

  it('get unspent outputs throws error on unknown address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_unspent_outs').reply(403)

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.unspentOutputs()).to.be.rejectedWith(Error, 'account does not exist')
  })

  it('get unspent outputs throws error on empty address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_unspent_outs').reply(422)

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.unspentOutputs()).to.be.rejectedWith(Error, 'missing or invalid parameters')
  })

  it('can get random outputs', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_random_outs').reply(200, {
      'amount_outs': [
        {
          'amount': '0',
          'outputs': [
            {
              'global_index': '32784828',
              'public_key': 'e5f92bcd97490347f95ccc7da4982bf40e5591a15f1a78253920eefaa4cbe296',
              'rct': '33c6fb87cecdbbfdf79320e71de0116de6a938fef21233b6789b0b7606c08178'
            },
            {
              'global_index': '36338335',
              'public_key': '65db0597f02f7e2ea28d59233f6d6cbd1e60b131552ce5d4e7fccc8200f27226',
              'rct': '696135700ce3dc731edfb07b9db31a3d552c45db1640c3721e01664ba271e6bd'
            },
            {
              'global_index': '36464196',
              'public_key': '823041d755b518be6fcc666d77e21392b5bf25815ae45ed4d5051855f9b6bb03',
              'rct': '4f16b73a7f78a83b2904439d2ce37db0ced6eb6821a9b8491429f5525b4d20ff'
            },
            {
              'global_index': '36788642',
              'public_key': '729006a7248034c1c51db8544d0796740eab4493c7c4ce844f9e730c9b1673f2',
              'rct': 'ff24f1e15e923cf2578664d97e6b6c9c668ffeb310204ec738c056de47d69412'
            },
            {
              'global_index': '36961556',
              'public_key': '431e41fcd17f6e6e7bcadcfeee7902a2d745f37378a8b5f4a2c942159785575c',
              'rct': '7855121c140729c80bc416e2f4037b679b82c5fd463eac7b39db89a71856f8fe'
            },
            {
              'global_index': '37050104',
              'public_key': 'e7b9666e37965f99b2608afaec65fe407ebe4e3bd1829fb6d1adbd3efca11854',
              'rct': '5107a77dfcaeec3dfe5c7c867339571505d683923edeb095fc01b310dc913f08'
            },
            {
              'global_index': '37106658',
              'public_key': '150d51598289595a8dcf9faf7c046e322d810b6b19e30bc6230d4720ce8f4535',
              'rct': '0bac63b357caa4365f022762f76fc7a86fe858fbfaa8533a187c418c8d08008f'
            },
            {
              'global_index': '37109314',
              'public_key': '770b93fe8a54d51ee79af39ac73d680a57233422958a009539004a1df50f6934',
              'rct': '173e6243eda4e2f43635fb0c40d8720390a5eb0261da6aed91b0966ac6127ff9'
            },
            {
              'global_index': '37113264',
              'public_key': '2e0479ff63cd38db631abb2e3bd301cd85bbff31db6399b03c0234350e275048',
              'rct': '40d3e387812f826ca70cfcb8abe4dfb00199f19c65752e42f1f90871dd48a6d1'
            },
            {
              'global_index': '37115564',
              'public_key': '168849124e1a1a63dc368ad0c07c4bc0525e1bac4d165a37c6b653440ec7b34f',
              'rct': 'be41404e1c63781423dd6543a0ffe6df53df113abddc47e7fa9d043f099e3096'
            },
            {
              'global_index': '37126926',
              'public_key': '4347cb3b67ddb90a00ae043d7295b4dd0d7d2e0afcbd6683b240ec3654fe52d5',
              'rct': '0c40c3b206ad81b2cd1a0d273dbabf3118a233c7354bf7638a5faeda0efde5fd'
            }
          ]
        }
      ]
    })

    const lwsClient = new LWSClient({ httpClient: axios })

    const result = await lwsClient.randomOutputs(1)

    const expected = {
      'amount_outs': [
        {
          amount: '0',
          outputs: [
            {
              global_index: '32784828',
              public_key: 'e5f92bcd97490347f95ccc7da4982bf40e5591a15f1a78253920eefaa4cbe296',
              rct: '33c6fb87cecdbbfdf79320e71de0116de6a938fef21233b6789b0b7606c08178'
            },
            {
              global_index: '36338335',
              public_key: '65db0597f02f7e2ea28d59233f6d6cbd1e60b131552ce5d4e7fccc8200f27226',
              rct: '696135700ce3dc731edfb07b9db31a3d552c45db1640c3721e01664ba271e6bd'
            },
            {
              global_index: '36464196',
              public_key: '823041d755b518be6fcc666d77e21392b5bf25815ae45ed4d5051855f9b6bb03',
              rct: '4f16b73a7f78a83b2904439d2ce37db0ced6eb6821a9b8491429f5525b4d20ff'
            },
            {
              global_index: '36788642',
              public_key: '729006a7248034c1c51db8544d0796740eab4493c7c4ce844f9e730c9b1673f2',
              rct: 'ff24f1e15e923cf2578664d97e6b6c9c668ffeb310204ec738c056de47d69412'
            },
            {
              global_index: '36961556',
              public_key: '431e41fcd17f6e6e7bcadcfeee7902a2d745f37378a8b5f4a2c942159785575c',
              rct: '7855121c140729c80bc416e2f4037b679b82c5fd463eac7b39db89a71856f8fe'
            },
            {
              global_index: '37050104',
              public_key: 'e7b9666e37965f99b2608afaec65fe407ebe4e3bd1829fb6d1adbd3efca11854',
              rct: '5107a77dfcaeec3dfe5c7c867339571505d683923edeb095fc01b310dc913f08'
            },
            {
              global_index: '37106658',
              public_key: '150d51598289595a8dcf9faf7c046e322d810b6b19e30bc6230d4720ce8f4535',
              rct: '0bac63b357caa4365f022762f76fc7a86fe858fbfaa8533a187c418c8d08008f'
            },
            {
              global_index: '37109314',
              public_key: '770b93fe8a54d51ee79af39ac73d680a57233422958a009539004a1df50f6934',
              rct: '173e6243eda4e2f43635fb0c40d8720390a5eb0261da6aed91b0966ac6127ff9'
            },
            {
              global_index: '37113264',
              public_key: '2e0479ff63cd38db631abb2e3bd301cd85bbff31db6399b03c0234350e275048',
              rct: '40d3e387812f826ca70cfcb8abe4dfb00199f19c65752e42f1f90871dd48a6d1'
            },
            {
              global_index: '37115564',
              public_key: '168849124e1a1a63dc368ad0c07c4bc0525e1bac4d165a37c6b653440ec7b34f',
              rct: 'be41404e1c63781423dd6543a0ffe6df53df113abddc47e7fa9d043f099e3096'
            },
            {
              global_index: '37126926',
              public_key: '4347cb3b67ddb90a00ae043d7295b4dd0d7d2e0afcbd6683b240ec3654fe52d5',
              rct: '0c40c3b206ad81b2cd1a0d273dbabf3118a233c7354bf7638a5faeda0efde5fd'
            }
          ]
        }
      ]
    }
    assert.deepStrictEqual(
      result,
      expected
    )
  })

  it('random outputs throws error on invalid server address', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_random_outs').networkError()

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.randomOutputs(1)).to.be.rejectedWith(Error, 'no response')
  })

  it('random outputs throws error on number of outputs set to 0', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_random_outs').networkError() // not going to be called here but just in case

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.randomOutputs(0)).to.be.rejectedWith(Error, 'invalid amount')
  })

  it('random outputs throws error on number of outputs set to not a number', async function () {
    const mock = new MockAdapter(axios)

    mock.onPost('/get_random_outs').networkError() // not going to be called here but just in case

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.randomOutputs('z')).to.be.rejectedWith(Error, 'invalid amount')
  })

  it('can fetch exchange rates', async function () {
    const mock = new MockAdapter(axios)

    mock.onGet('/get_exchange_rates').reply(200, {
      'AUD': 354.94,
      'BRL': 1380.54,
      'BTC': 0.00587,
      'CAD': 325.75,
      'CHF': 240.45,
      'CNY': 1756.52,
      'EUR': 226.91,
      'GBP': 188.18,
      'HKD': 2030.06,
      'INR': 20538.69,
      'JPY': 28767.38,
      'KRW': 303687.06,
      'MXN': 5192.99,
      'NOK': 2220.11,
      'NZD': 377.46,
      'SEK': 2216.35,
      'SGD': 353.95,
      'TRY': 2255.2,
      'USD': 261.17,
      'RUB': 18509.12,
      'ZAR': 3969.87
    })

    const lwsClient = new LWSClient({ httpClient: axios })

    const result = await lwsClient.exchangeRates()

    const expected = {
      AUD: 354.94,
      BRL: 1380.54,
      BTC: 0.00587,
      CAD: 325.75,
      CHF: 240.45,
      CNY: 1756.52,
      EUR: 226.91,
      GBP: 188.18,
      HKD: 2030.06,
      INR: 20538.69,
      JPY: 28767.38,
      KRW: 303687.06,
      MXN: 5192.99,
      NOK: 2220.11,
      NZD: 377.46,
      SEK: 2216.35,
      SGD: 353.95,
      TRY: 2255.2,
      USD: 261.17,
      RUB: 18509.12,
      ZAR: 3969.87
    }

    assert.deepStrictEqual(
      result,
      expected
    )
  })

  it('get exchange rates throws error on invalid server address', async function () {
    const mock = new MockAdapter(axios)

    mock.onGet('/get_exchange_rates').networkError()

    const lwsClient = new LWSClient({ httpClient: axios })

    await expect(lwsClient.exchangeRates()).to.be.rejectedWith(Error, 'no response')
  })
})
