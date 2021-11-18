'use strict'

const axios = require('axios').default

/**
 * Lite Wallet Service Client module.
 */
class LWSClient {
  /**
   *
   * @param {object} options
   * @param {object} [options.httpClient] - Currently only supports axios.
   * @param {string} [options.url] - The light wallet compatible server uri.
   * @param {string} [options.appName] - Your app name identifier.console
   * @param {string} [options.appVersion] - MyMonero compatible App version. used for checking compatibility.
   */
  constructor (options = {}) {
    this.httpClient = options.httpClient || axios
    this.appName = options.appName || 'MyMonero'
    this.appVersion = options.appVersion || '1.1.24'
    axios.defaults.baseURL = options.url || 'https://api.mymonero.com'
  }

  /**
   * Logs the wallet in to the server. this puts it in the queue to scan.
   * If the wallet is not on the mymonero server it will create it if create_account is true.
   * @todo add test cases for create account.
   * @param {string} viewkey - Wallet private viewkey.
   * @param {string} address - Wallet primary address.
   * @param {boolean} createAddress - Whether to create the account on the server or not.
   * @returns {object} whether the address is new and its start height.
   */
  async login (viewkey, address, createAccount = false) {
    const response = await this.httpClient.post('/login', {
      address: address,
      view_key: viewkey,
      create_account: createAccount,
      generated_locally: true
    }).catch(err => {
      if (err.response === undefined) {
        throw new Error('no response')
      }
      if (err.response.status === 403) {
        throw new Error('account does not exist')
      }
      if (err.response.status === 422) {
        throw new Error('missing or invalid parameters')
      }
      throw err
    })
    // { new_address: false, start_height: 2547018}
    const result = {
      isNewAddress: response.data.new_address,
      startHeight: response.data.start_height
    }

    return result
  }

  /**
   * Gets a list of transactions for the address. Will include mixins.
   * Also provided the blockchain heights.
   * @param {string} viewkey - Wallet private viewkey.
   * @param {string} address - Wallet primary address.
   * @returns {object} Transactions and blockchain heights.
   */
  async getAddressTxs (viewkey, address) {
    const response = await this.httpClient.post('/get_address_txs', {
      address: address,
      view_key: viewkey
    }).catch(err => {
      if (err.response === undefined) {
        throw new Error('no response')
      }
      if (err.response.status === 403) {
        throw new Error('account does not exist')
      }
      if (err.response.status === 422) {
        throw new Error('missing or invalid parameters')
      }
      throw err
    })
    if (response.data.transactions == null) {
      response.data.transactions = []
    }

    return response.data
  }

  /**
   * Fetches the accounts unspent outputss. It also returns the fees per byte for calculating network fees.
   * @param {string} viewkey - Wallet private viewkey.
   * @param {string} address - Wallet primary address.
   * @returns {Object} List of outputs as well as the fee per byte for calculating network fees
   */
  async unspentOutputs (viewkey, address) {
    const self = this
    const response = await this.httpClient.post('/get_unspent_outs', {
      address: address,
      view_key: viewkey,
      amount: '0',
      dust_threshold: '2000000000',
      use_dust: true,
      mixin: 10,
      app_name: self.appName,
      app_version: self.appVersion
    }).catch(err => {
      if (err.response === undefined) {
        throw new Error('no response')
      }
      if (err.response.status === 403) {
        throw new Error('account does not exist')
      }
      if (err.response.status === 422) {
        throw new Error('missing or invalid parameters')
      }
      throw err
    })

    return response.data
  }

  /**
   * Fetches the required amount of random outputs.
   * @param {number} [numberOfOuts] - The number of outputs the server needs to return. Defaults to 1.
   * @returns {array} The random outputs.
   */
  async randomOutputs (numberOfOuts = 1) {
    if (numberOfOuts < 1 || isNaN(numberOfOuts)) {
      throw new Error('invalid amount')
    }
    const self = this
    const amounts = []
    for (let i = 0; i < numberOfOuts; i++) {
      amounts.push('0')
    }
    const response = await this.httpClient.post('/get_random_outs', {
      amounts: amounts,
      count: 11,
      app_name: self.appName,
      app_version: self.appVersion
    }).catch(err => {
      if (err.response === undefined) {
        throw new Error('no response')
      }
      if (err.response.status === 422) {
        throw new Error('missing or invalid parameters')
      }
      throw err
    })

    return response.data
  }

  /**
   * Submits the raw transaction to the server to be passed on to the monero network.
   * @param {string} tx - The raw transaction generated bt the monero client.
   */
  async submitRawTx (tx) {
    const self = this
    const response = await this.httpClient.post('/submit_raw_tx', {
      tx: tx,
      app_name: self.appName,
      app_version: self.appVersion
    }).catch(err => {
      if (err.response === undefined) {
        throw new Error('no response')
      }
      if (err.response.status === 403) {
        throw new Error('account does not exist')
      }
      if (err.response.status === 422) {
        throw new Error('missing or invalid parameters')
      }
      throw err
    })

    return response.data
  }

  /**
   * Fetches the latest fiat rates for XMR.
   * @returns {object} key pair list of currencies and their rate.
   */
  async exchangeRates () {
    const response = await this.httpClient.get('/get_exchange_rates').catch(err => {
      if (err.response === undefined) {
        throw new Error('no response')
      }
      throw err
    })

    return response.data
  }

  /**
   * (Deprecated)Fetches Address info for the wallet. this function will no longer be used as getAddressTx provides all the data.
   * Exchange rates has its own call, getExchangeRates.
   * @param {string} viewkey - Wallet private viewkey.
   * @param {string} address - Wallet primary address.
   */
  async getAddressInfo (viewkey, address) {
    const response = await this.httpClient.post('/get_address_info', {
      address: address,
      view_key: viewkey
    }).catch(err => {
      if (err.response === undefined) {
        throw new Error('no response')
      }
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`)
      }
      if (err.response.status === 422) {
        throw new Error('missing or invalid parameters')
      }
      throw err
    })

    return response.data
  }
}

module.exports = LWSClient
