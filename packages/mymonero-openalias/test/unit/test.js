'use strict'

const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.should()
chai.use(chaiAsPromised)
const expect = chai.expect

const OpenAlias = require('../../index')

describe('Open alias tests', function () {
  it('lookup throws error on invalid server address', async function () {
    const mock = new MockAdapter(axios)

    mock.onGet('/dns-query').networkError()

    const oa = new OpenAlias({ httpClient: axios, url: 'example.com' })

    await expect(oa.lookup('none.mymonero.com')).to.be.rejectedWith(Error, 'no response')
  })

  it('lookup returns no answer response', async function () {
    const mock = new MockAdapter(axios)

    mock.onGet('/dns-query').reply(200, {
      Status: 0,
      TC: false,
      RD: true,
      RA: true,
      AD: false,
      CD: false,
      Question: [ { name: '', type: 16 } ],
      Authority: [
        {
          name: '',
          type: 6,
          TTL: 86400,
          data: 'a.root-servers.net. nstld.verisign-grs.com. 2021110300 1800 900 604800 86400'
        }
      ]
    })

    const oa = new OpenAlias({ httpClient: axios, url: 'example.com' })

    await expect(oa.lookup('')).to.be.rejectedWith(Error, 'no records found')
  })

  it('lookup returns multiple results', async function () {
    const mock = new MockAdapter(axios)

    mock.onGet('/dns-query').reply(200, {
      Status: 0,
      TC: false,
      RD: true,
      RA: true,
      AD: true,
      CD: false,
      Question: [ { name: 'donate.getmonero.org', type: 16 } ],
      Answer: [
        {
          name: 'donate.getmonero.org',
          type: 16,
          TTL: 271,
          data: '"oa1:btc recipient_address=1KTexdemPdxSBcG55heUuTjDRYqbC5ZL8H; recipient_name=Monero Development; tx_description=Donation to Monero Core Team;"'
        },
        {
          name: 'donate.getmonero.org',
          type: 16,
          TTL: 271,
          data: '"oa1:xmr recipient_address=888tNkZrPN6JsEgekjMnABU4TBzc2Dt29EPAvkRxbANsAnjyPbb3iQ1YBRk1UXcdRsiKc9dhwMVgN5S9cQUiyoogDavup3H; recipient_name=Monero Development; tx_description=Donation to Monero Core Team;"'
        }
      ]
    })

    const oa = new OpenAlias({ httpClient: axios, url: '' })

    const result = await oa.lookup('donate.getmonero.org')

    const expected = [
      {
        currency: 'btc',
        address: '1KTexdemPdxSBcG55heUuTjDRYqbC5ZL8H',
        name: 'Monero Development',
        description: 'Donation to Monero Core Team'
      },
      {
        currency: 'xmr',
        address: '888tNkZrPN6JsEgekjMnABU4TBzc2Dt29EPAvkRxbANsAnjyPbb3iQ1YBRk1UXcdRsiKc9dhwMVgN5S9cQUiyoogDavup3H',
        name: 'Monero Development',
        description: 'Donation to Monero Core Team'
      }
    ]

    assert.deepStrictEqual(
      result,
      expected
    )
  })

  it('lookup returns multiple non open alias results', async function () {
    const mock = new MockAdapter(axios)

    mock.onGet('/dns-query').reply(200, {
      Status: 0,
      TC: false,
      RD: true,
      RA: true,
      AD: true,
      CD: false,
      Question: [ { name: 'mymonero.com', type: 16 } ],
      Answer: [
        {
          name: 'mymonero.com',
          type: 16,
          TTL: 10647,
          data: '"SECUREBROWSE 1.0"'
        },
        {
          name: 'mymonero.com',
          type: 16,
          TTL: 10647,
          data: '"libera-verify-TODxU57t5l"'
        },
        {
          name: 'mymonero.com',
          type: 16,
          TTL: 10647,
          data: '"SECUREBROWSE-WHITELIST google-analytics.com/analytics.js widget.intercom.io/widget/hi3rzlw0 js.intercomcdn.com/*"'
        }
      ]
    })

    const oa = new OpenAlias({ httpClient: axios, url: '' })

    const result = await oa.lookup('mymonero.com')

    const expected = []

    assert.deepStrictEqual(
      result,
      expected
    )
  })

  it('lookup returns multiple single open alias result', async function () {
    const mock = new MockAdapter(axios)

    mock.onGet('/dns-query').reply(200, {
      Status: 0,
      TC: false,
      RD: true,
      RA: true,
      AD: true,
      CD: false,
      Question: [ { name: 'mymonero.com', type: 16 } ],
      Answer: [
        {
          name: 'mymonero.com',
          type: 16,
          TTL: 10647,
          data: '"SECUREBROWSE 1.0"'
        },
        {
          name: 'mymonero.com',
          type: 16,
          TTL: 10647,
          data: '"libera-verify-TODxU57t5l"'
        },
        {
          name: 'donate.getmonero.org',
          type: 16,
          TTL: 271,
          data: '"oa1:xmr recipient_address=888tNkZrPN6JsEgekjMnABU4TBzc2Dt29EPAvkRxbANsAnjyPbb3iQ1YBRk1UXcdRsiKc9dhwMVgN5S9cQUiyoogDavup3H; recipient_name=Monero Development; tx_description=Donation to Monero Core Team;"'
        },
        {
          name: 'mymonero.com',
          type: 16,
          TTL: 10647,
          data: '"SECUREBROWSE-WHITELIST google-analytics.com/analytics.js widget.intercom.io/widget/hi3rzlw0 js.intercomcdn.com/*"'
        }
      ]
    })

    const oa = new OpenAlias({ httpClient: axios, url: '' })

    const result = await oa.lookup('mymonero.com')

    const expected = [
      {
        currency: 'xmr',
        address: '888tNkZrPN6JsEgekjMnABU4TBzc2Dt29EPAvkRxbANsAnjyPbb3iQ1YBRk1UXcdRsiKc9dhwMVgN5S9cQUiyoogDavup3H',
        name: 'Monero Development',
        description: 'Donation to Monero Core Team'
      }
    ]

    assert.deepStrictEqual(
      result,
      expected
    )
  })
})
