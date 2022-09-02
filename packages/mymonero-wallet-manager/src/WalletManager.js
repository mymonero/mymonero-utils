'use strict'

const LWSClient = require('@mymonero/mymonero-lws-client')
const Wallet = require('./Wallet')
const ContactManager = require('./ContactManager')

class WalletManager {
  constructor (netType = 'MAINNET', url = 'https://api.mymonero.com') {
    this.netType = netType
    this.url = url
    this.bridgeClass = {}
    this.wallets = []
    this.contactManager = new ContactManager()
    this.appName = 'MyMonero'
    this.appVersion = '1.1.24'
    this.apiClient = new LWSClient({ url: url })
  }

  /**
   * Loads the WASM and Initilizes the WASM Bridge.
   */
  async init () {
    const self = this
    try {
      self.bridgeClass = await require('@mymonero/mymonero-monero-client')({})
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Opens Wallet and adds it to the wallet array.
   * @param {array} options
   * @returns {Wallet}
   */
  openWallet (options) {
    const self = this
    const wallet = new Wallet(self.bridgeClass, self.apiClient, self.contactManager, options)

    self.wallets.push(wallet)

    return wallet
  }

  /**
   * Creates a new wallet by generating a new mnemonic phrase.
   * @param {string} name - The Wallet name.
   * @returns {Wallet}
   */
  createWallet (name) {
    const self = this
    const walletDetails = self.bridgeClass.generateWallet('en-US', self.netType)
    const options = {
      name: name,
      netType: self.netType,
      url: self.url,
      appName: self.appName,
      appVersion: self.appVersion,
      mnemonic: walletDetails.mnemonic,
      mnemonicLanguage: walletDetails.mnemonicLanguage,
      seed: walletDetails.seed,
      address: walletDetails.address,
      publicViewKey: walletDetails.publicViewKey,
      privateViewKey: walletDetails.privateViewKey,
      publicSpendKey: walletDetails.publicSpendKey,
      privateSpendKey: walletDetails.privateSpendKey
    }
    const wallet = new Wallet(self.bridgeClass, self.apiClient, self.contactManager, options)
    self.wallets.push(wallet)
    return wallet
  }

  /**
   * Imports wallet from known mnemonic phrase.
   * @param {string} name - Name given to the wallet.
   * @param {string} mnemonic - The mnemonic phrase.
   * @returns {Wallet}
   */
  importWallet (name, mnemonic) {
    const self = this
    const keyStore = this.bridgeClass.seedAndKeysFromMnemonic(mnemonic, self.netType)

    const options = {
      name: name,
      netType: self.netType,
      url: self.url,
      appName: self.appName,
      appVersion: self.appVersion,
      mnemonic: mnemonic,
      seed: keyStore.seed,
      address: keyStore.address,
      publicViewKey: keyStore.publicViewKey,
      privateViewKey: keyStore.privateViewKey,
      publicSpendKey: keyStore.publicSpendKey,
      privateSpendKey: keyStore.privateSpendKey
    }
    const wallet = new Wallet(self.bridgeClass, self.apiClient, self.contactManager, options)

    self.wallets.push(wallet)

    return wallet
  }

  /**
   * Imports wallet from known private keys.
   * @param {string} name - Name giben to the wallet.
   * @param {string} address - The Wallets primary address.
   * @param {string} privateViewKey - The Wallets private view key.
   * @param {string} privateSpendKey - The Wallets private spend key.
   * @returns {Wallet}
   */
  importWalletKeys (name, address, privateViewKey, privateSpendKey) {
    const self = this
    const result = this.bridgeClass.isValidKeys(address, privateViewKey, privateSpendKey, '', self.netType)

    const options = {
      name: name,
      netType: self.netType,
      url: self.url,
      appName: self.appName,
      appVersion: self.appVersion,
      address: address,
      publicViewKey: result.publicViewKey,
      privateViewKey: privateViewKey,
      publicSpendKey: result.publicSpendKey,
      privateSpendKey: privateSpendKey
    }
    const wallet = new Wallet(self.bridgeClass, self.apiClient, self.contactManager, options)

    self.wallets.push(wallet)

    return wallet
  }
}

module.exports = WalletManager
