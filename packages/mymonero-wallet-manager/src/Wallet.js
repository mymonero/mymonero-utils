'use strict'

const BigNumber = require('bignumber.js')

const Transaction = require('./Transaction')

class Wallet {
  /**
   * Construct new Wallet
   * @param {object} options
   * @param {object} options.bridge
   * @param {object} options.apiClient
   * @param {string} [options.netType]
   * @param {string} [options.url]
   * @param {string} [options.appName]
   * @param {string} [options.appVersion]
   */
  constructor (bridge, apiClient, contactManager, options = {}) {
    this.contactManager = contactManager
    this.name = options.name || null
    this.seed = options.seed || null
    this.mnemonic = options.mnemonic || null
    this.mnemonicLanguage = options.mnemonicLanguage || null
    this.netType = options.netType || 'MAINNET'
    this.keyImageCache = []
    this.bridgeClass = bridge
    this.lwsClient = apiClient
    this.url = options.url || 'https://api.mymonero.com'
    this.feePerb = null
    this.feeMask = null
    this.address = options.address || null
    this.publicViewKey = options.publicViewKey || null
    this.privateViewKey = options.privateViewKey || null
    this.publicSpendKey = options.publicSpendKey || null
    this.privateSpendKey = options.privateSpendKey || null
    this.startHeight = null // Block height the wallet was created.
    this.scannedBlockHeight = null // The block height the wallet has scanned too.
    this.blockHeight = null // The current block height of the blockchain.
    this.scannedTransactionHeight = null // The current transaction height the wallet has scanned too.
    this.transactionHeight = null // The current transaction height of the blockchain.
    this.rawTransactions = [] // The list of transactions before they have been key imaged. Will be used for view only tests.
    this.transactions = [] // Clean list of transactions after being key imaged.
    this.balance = new BigNumber(0)
    this.balancePending = new BigNumber(0)
    this.balanceUnlocked = new BigNumber(0)
    this.isSendingFunds = false
    this.appName = options.appName || 'MyMonero'
    this.appVersion = options.appVersion || '1.1.24'
    this.cachedTransactions = []
    if (Array.isArray(options.cachedTransactions)) {
      for (let i = 0; options.cachedTransactions.length > i; i++) {
        this.cachedTransactions[options.cachedTransactions[i].hash] = options.cachedTransactions[i]
      }
    }
  }

  /**
   * Syncs up the transactions from the server. This includes the syncing the blockhain heights
   * @returns {object} list of transactions for now. they are assigned to wallet.transactions.
   */
  async sync () {
    const self = this
    const data = await self.lwsClient.getAddressTxs(self.privateViewKey, self.address)
    self.startHeight = data.start_height
    self.scannedBlockHeight = data.scanned_block_height
    self.blockHeight = data.blockchain_height
    self.scannedTransactionHeight = data.scanned_height
    self.transactionHeight = data.transaction_height
    self.rawTransactions = data.transactions
    self.sinceTxId = data.since_tx_id
    self.transactions = await self._parseTransactions(self.rawTransactions, self.cachedTransactions)
    // calculate current balances based on the transaction list
    self._calculateBalances()
    return self.transactions
  }

  /**
   * Logins the Wallet in to the light wallet server.
   * @param {boolean} createAccount - Whether to create the account on the server or not.
   * @returns
   */
  async login (createAccount = false) {
    const self = this
    const result = await self.lwsClient.login(self.privateViewKey, self.address, createAccount)
    self.startHeight = result.startHeight

    return result
  }

  /**
   * Gives an estimated transaction fee.
   * @param {number} priority - The fee weight. should be set to 1 in most cases.
   * @returns {BigNumber} the fee in atomic units.
   */
  async estimateFee (priority = 1) {
    const self = this
    if (self.feePerb == null) {
      await self._fetchFeePerByte()
    }
    const networkFee = self.bridgeClass.estimateTxFee(priority, self.feePerb)

    return new BigNumber((Math.ceil(networkFee / self.feeMask) * self.feeMask))
  }

  /**
   * Generate a Random Payment Id.
   * @returns 16 char payment id.
   */
  generatePaymentId () {
    const self = this

    const paymentId = self.bridgeClass.generatePaymentId()

    return paymentId
  }

  /**
   * Decodes a monero address. It can be passed a primary, integrated or subaddress for validation.
   * @param {string} address - The address to decode.
   * @returns {object}
   */
  decodeAddress (address) {
    const self = this
    const addressDetails = self.bridgeClass.decodeAddress(address, self.netType)

    return addressDetails
  }

  /**
   * Generates the raw transaction and broadcasts it to the network.
   * @param {object} options
   * @returns
   */
  async transfer (options) {
    const self = this
    // state-lock the function
    if (self.isSendingFunds === true) {
      throw Error('Currently already sending funds. Please try again when complete.')
    }

    options.destinations.forEach(function (destination) {
      try {
        self.decodeAddress(destination.to_address)
      } catch (err) {
        let recipientAddress = null
        for (let i = 0; i < self.contactManager.contacts.length; i++) {
          if (destination.to_address === self.contactManager.contacts[i].name) {
            recipientAddress = self.contactManager.contacts[i].address
            break
          }
        }
        if (recipientAddress == null) {
          throw Error('contact or address not found')
        }
        destination.to_address = recipientAddress
      }
    })

    self.isSendingFunds = true

    try {
      const unspentOuts = await self.lwsClient.unspentOutputs(self.privateViewKey, self.address)

      const params = {
        destinations: options.destinations,
        priority: options.priority,
        address: self.address,
        privateViewKey: self.privateViewKey,
        publicSpendKey: self.publicSpendKey,
        privateSpendKey: self.privateSpendKey,
        shouldSweep: options.shouldSweep,
        nettype: self.netType,
        unspentOuts: unspentOuts,
        randomOutsCb: function (numberOfOuts) {
          return self.lwsClient.randomOutputs(numberOfOuts)
        }
      }
      const result = await self.bridgeClass.createTransaction(params)
      result.contact = options.contact || null

      return await this._broadcastTransfer(result)
    } catch (error) {
      self.isSendingFunds = false
      throw error
    }
  }

  /**
   * Fetches the latest exchange rates from the light wallet server
   * @returns {array} List of fiat exchange rates.
   */
  async exchangeRates () {
    const self = this
    return self.lwsClient.exchangeRates()
  }

  /**
   * Broadcasts the transaction to the monero network and adds it to  the transaction list
   * @private
   * @param {object} options
   * @returns
   */
  async _broadcastTransfer (options) {
    const self = this

    self.isSendingFunds = false
    // will need to now submit raw transaction here
    const result = await self.lwsClient.submitRawTx(options.serialized_signed_tx)
    if (result.status !== 'OK') {
      throw Error('broadcast failed')
    }
    const params = {
      hash: options.tx_hash,
      contact: options.contact,
      destinationAddress: options.target_address,
      txPublicKey: options.tx_key,
      id: null,
      timestamp: new Date(),
      recieved: new BigNumber(0),
      sent: new BigNumber('' + options.total_sent),
      fee: new BigNumber('' + options.used_fee),
      unlockTime: 0,
      height: null,
      coinbase: false,
      mempool: true,
      mixin: options.mixin,
      spentOutputs: [],
      currentBlockHeight: self.blockHeight
    }
    const transaction = new Transaction(params)
    // manually insert .. and subsequent fetches from the server will be
    // diffed against this, preserving the tx_fee, tx_key, target_address...
    self.cachedTransactions[options.tx_hash] = transaction
    self.transactions.unshift(transaction)

    return transaction.hash // wont actually return at this point
  }

  /**
   * fetches the fee per byte from the server
   */
  async _fetchFeePerByte () {
    const self = this
    const unspentOuts = await self.lwsClient.unspentOutputs(self.privateViewKey, self.address)
    self.feePerb = unspentOuts.per_byte_fee
    self.feeMask = unspentOuts.fee_mask
  }

  /**
   * Parses Transactions. This removes mixins and spent outputs that are not related to the address.
   * @private
   * @param {array} rawTransactions - List of all transactions including mixins retrieved from the server.
   * @param {array} cachedTransactions - List of all sent transactions with local data.
   * @returns {array} Clean set of transactions without mixins and foreign outputs
   */
  _parseTransactions (rawTransactions, cachedTransactions) {
    const self = this
    if (rawTransactions == null || Object.keys(rawTransactions).length === 0) {
      return {}
    }
    const transactions = []
    // TODO: rewrite this with more clarity if possible
    for (let i = 0; i < rawTransactions.length; ++i) {
      const options = {
        hash: rawTransactions[i].hash,
        id: rawTransactions[i].id,
        timestamp: rawTransactions[i].timestamp,
        received: rawTransactions[i].total_received,
        sent: rawTransactions[i].total_sent,
        fee: rawTransactions[i].fee,
        unlockTime: rawTransactions[i].unlock_time,
        height: rawTransactions[i].height,
        coinbase: rawTransactions[i].coinbase,
        mempool: rawTransactions[i].mempool,
        mixin: rawTransactions[i].mixin,
        spentOutputs: rawTransactions[i].spent_outputs || [],
        currentBlockHeight: self.blockHeight
      }

      if (cachedTransactions[rawTransactions[i].hash] !== undefined) {
        options.contact = cachedTransactions[rawTransactions[i].hash].contact
        options.txPublicKey = cachedTransactions[rawTransactions[i].hash].txPublicKey
        options.destinationAddress = cachedTransactions[rawTransactions[i].hash].destinationAddress
      }
      const transaction = new Transaction(options)

      if ((transaction.spentOutputs || []).length > 0) {
        for (let j = 0; j < transaction.spentOutputs.length; ++j) {
          const keyImage = self._generateKeyImage(transaction.spentOutputs[j].txPublicKey, transaction.spentOutputs[j].outputIndex)
          // check if the output was ours - if not we remove the amount from transaction and remove the spent outputs
          if (transaction.spentOutputs[j].keyImage !== keyImage) {
            transaction.sent = transaction.sent.minus(transaction.spentOutputs[j].amount)
            transaction.spentOutputs.splice(j, 1)
            j--
          }
        }
      }
      // if no funds were sent or received remove transaction. reason that it would 0 is the outputs were not ours
      if (transaction.received.plus(transaction.sent).comparedTo(0) <= 0) {
        continue
      }
      transactions.push(transaction)
    }

    // sort transactions mempool first then by newest to oldest
    transactions.sort(function (a, b) {
      if (a.mempool === true) {
        if (b.mempool !== true) {
          return -1 // a first
        }
        // both mempool - fall back to .id compare
      } else if (b.mempool === true) {
        return 1 // b first
      }
      return b.id - a.id // compare sequential transaction id
    })

    return transactions
  }

  /**
   * Retrieves the keyImage from local cache if it exists or generates it using the WASM and addeds it to the cache.
   * @private
   * @param {string} txPublicKey - The spent outputs public key.
   * @param {number} outputIndex - The spent output array index.
   * @returns {string} The spent outputs keyImage
   */
  _generateKeyImage (txPublicKey, outputIndex) {
    const self = this
    const cacheIndex = `${txPublicKey}:${outputIndex}`
    const cachedKeyImage = self.keyImageCache[cacheIndex]
    if (typeof cachedKeyImage !== 'undefined' && cachedKeyImage !== null) {
      return cachedKeyImage
    }
    const keyImage = self.bridgeClass.generateKeyImage(txPublicKey, self.privateViewKey, self.publicSpendKey, self.privateSpendKey, outputIndex)
    // cache:
    self.keyImageCache[cacheIndex] = keyImage

    return keyImage
  }

  /**
   * Calculates the wallets balances. Total, locked and pending
   * @private
   */
  _calculateBalances () {
    const self = this
    const transactions = self.transactions
    let totalReceived = new BigNumber(0)
    let totalSent = new BigNumber(0)
    let totalPendingReceived = new BigNumber(0)
    let totalPendingSent = new BigNumber(0)
    let totalLockedReceived = new BigNumber(0)
    let totalLockedSent = new BigNumber(0)
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].mempool === true) { // pending transactions
        totalPendingSent = totalPendingSent.plus(transactions[i].sent)
        totalPendingReceived = totalPendingReceived.plus(transactions[i].received)
      } else { // confirmed or completed
        if (transactions[i].confirmations < 10) {
          totalLockedReceived = totalLockedReceived.plus(transactions[i].received)
          totalLockedSent = totalLockedSent.plus(transactions[i].sent)
        }
        totalReceived = totalReceived.plus(transactions[i].received)
        totalSent = totalSent.plus(transactions[i].sent)
      }
    }
    // also... you could just subtract the total_sent amount from the balance, no?
    self.balance = totalReceived.minus(totalSent)
    self.balancePending = totalPendingReceived.minus(totalPendingSent)
    self.balanceUnlocked = self.balance.minus(totalLockedReceived.minus(totalLockedSent))
  }

  /**
   * Changes atomic units into monero.
   * @param {BigNumber} bigNumber - The atomic monero amount to be converted in to monero amount.
   * @returns A number string of monero amount.
   */
  convertFromPicos (bigNumber) {
    return bigNumber.dividedBy(1000000000000).toFormat(12)
  }

  /**
   * Returns key paired array of wallet values used for saving
   * @returns {array}
   */
  serialize () {
    const self = this
    const tempCache = []
    Object.keys(self.cachedTransactions).forEach((element) => {
      tempCache.push(self.cachedTransactions[element])
    })
    return {
      name: self.name,
      seed: self.seed,
      mnemonic: self.mnemonic,
      mnemonicLanguage: self.mnemonicLanguage,
      netType: self.netType,
      keyImageCache: self.keyImageCache,
      url: self.url,
      feePerb: self.feePerb,
      address: self.address,
      publicViewKey: self.publicViewKey,
      privateViewKey: self.privateViewKey,
      publicSpendKey: self.publicSpendKey,
      privateSpendKey: self.privateSpendKey,
      startHeight: self.startHeight,
      scannedBlockHeight: self.scannedBlockHeight,
      blockHeight: self.blockHeight,
      scannedTransactionHeight: self.scannedTransactionHeight,
      transactionHeight: self.transactionHeight,
      rawTransactions: self.rawTransactions,
      transactions: self.transactions,
      balance: self.balance,
      balancePending: self.balancePending,
      balanceUnlocked: self.balanceUnlocked,
      cachedTransactions: tempCache
    }
  }
}

module.exports = Wallet
