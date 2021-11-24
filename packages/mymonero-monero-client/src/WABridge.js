'use strict'

class WABridge {
  constructor (module) {
    this.Module = module
  }

  /**
 * Callback to fetch the random decoys from the light wallet service needed for the transaction.
 *
 * @callback randomOutsCallback
 * @param {number} numberOfOuts - The number of outputs needing decoys.
 */

  /**
   * Creates a transfer of funds to the recipient address and returns the raw signed tx.
   * @param {object} options
   * @param {number} options.amount 
   * @param {string} options.recipientAddress 
   * @param {number} options.priority 
   * @param {string} options.address 
   * @param {string} options.privateViewKey 
   * @param {string} options.publicSpendKey 
   * @param {string} options.privateSpendKey 
   * @param {boolean} options.shouldSweep 
   * @param {?string} options.paymentId - The payment id for the transaction. can be null. 
   * @param {string} options.nettype - The network name eg MAINNET.
   * @param {object} options.unspentOuts - List of unspent outs as well as per byte fee.
   * @param {randomOutsCallback} options.randomOutsCb - Used to fetch the random outs from the light wallet service.
   * @returns 
   */
  async createTransaction (options) {
    const self = this
    checkPriority(options.priority)
    checkNetType(options.nettype)
    if (options.privateViewKey.length !== 64) {
      throw Error('Invalid privateViewKey length')
    }
    if (options.publicSpendKey.length !== 64) {
      throw Error('Invalid publicSpendKey length')
    }
    if (options.privateSpendKey.length !== 64) {
      throw Error('Invalid privateSpendKey length')
    }
    if (typeof options.randomOutsCb !== 'function') {
      throw Error('Invalid randomsOutCB not a function')
    }
    if (options.shouldSweep && options.amount !== 0) {
      throw Error('Invalid amount when sweeping amount must be 0')
    }
    
    const args =
    {
      sending_amount_double_string: '' + options.amount,
      enteredAddressValue: options.recipientAddress,
      is_sweeping: options.shouldSweep,
      from_address_string: options.address,
      sec_viewKey_string: options.privateViewKey,
      sec_spendKey_string: options.privateSpendKey,
      pub_spendKey_string: options.publicSpendKey,
      priority: '' + options.priority,
      nettype_string: options.nettype,
      manuallyEnteredPaymentID: options.paymentId,
      unspentOuts: options.unspentOuts
    }
    
    try {
      // WebAssembly keeps state between calls so we can prepare the tx before getting the random out and signing tx 
      const retString = this.Module.prepareTx(JSON.stringify(args, null, ''))
      const ret = JSON.parse(retString)
      // check for any errors passed back from WebAssembly
      if (ret.err_msg) {
        throw Error(ret.err_msg)
      }
      // fetch random decoys
      const randomOuts = await self._getRandomOuts(ret.amounts.length, options.randomOutsCb)
      // send random decoys on and complete the tx creation 
      const retString2 = this.Module.createAndSignTx(JSON.stringify(randomOuts))
      const rawTx = JSON.parse(retString2)
      // check for any errors passed back from WebAssembly
      if (rawTx.err_msg) {
        throw Error(rawTx.err_msg)
      }
      // parse variables ruturned as strings
      rawTx.mixin = parseInt(rawTx.mixin)
      rawTx.isXMRAddressIntegrated = rawTx.isXMRAddressIntegrated === 'true'

      return rawTx
    } catch (exception) {
      // check for exceptions thrown by WebAssembly that is only a pointer id
      // this is for missed exceptions we havent handled in the code and returned in the err_msg response 
      if (!isNaN(exception)) {
        throw Error(this.Module.getExceptionMessage(exception));
      } else {
        throw exception
      }
    }
  }

  /**
   * Generates a random short payment id.
   * @returns {string} new 16 char short Payment id.
   */
  generatePaymentId () {
    return this.Module.generatePaymentId()
  }

  /**
   * Connects to the WASM to generate the Key Image of the specific output.
   * @param {string} txPublicKey - The output public key.
   * @param {string} privateViewKey - The wallet private view key.
   * @param {string} publicSpendKey - The spend public key.
   * @param {string} privateSpendKey - The spend secret key.
   * @param {number} outputIndex - The output index within the transaction.
   * @returns {string} Returns the key image.
   */
  generateKeyImage (txPublicKey, privateViewKey, publicSpendKey, privateSpendKey, outputIndex) {
    if (txPublicKey.length !== 64) {
      throw Error('Invalid txPublicKey length')
    }
    if (privateViewKey.length !== 64) {
      throw Error('Invalid privateViewKey length')
    }
    if (publicSpendKey.length !== 64) {
      throw Error('Invalid publicSpendKey length')
    }
    if (privateSpendKey.length !== 64) {
      throw Error('Invalid privateSpendKey length')
    }
    if (outputIndex === '' || outputIndex == null) {
      throw Error('Missing outputIndex')
    }
    if (isNaN(outputIndex)) {
      throw Error('Invalid outputIndex is not a number')
    }

    const retString = this.Module.generateKeyImage(txPublicKey, privateViewKey, publicSpendKey, privateSpendKey, '' + outputIndex)
    const ret = JSON.parse(retString)
    if (ret.err_msg) {
      throw Error(ret.err_msg)
    }

    return ret.retVal
  }

  /**
   * Estimates the transaction fee based on two outputs.
   * @param {number} priority - The priority level the estimate is for.
   * @param {number} feePerb - The fee per byte. This is retrieved from the MM server.
   * @param {number} forkVersion - The fork version defaults to 0 which is the latest.
   * @returns {number} The estiamted fee amount in piconeros
   */
  estimateTxFee (priority, feePerb, forkVersion = 0) {
    checkPriority(priority)
    if (isNaN(feePerb)) {
      throw Error('Invalid feePerb. must be an number')
    }
    const retString = this.Module.estimateTxFee('' + priority, '' + feePerb, '' + forkVersion)
    const ret = JSON.parse(retString)

    return parseInt(ret.retVal)
  }

  /**
   * Derives the seed and keys from the mnemonic string.
   * @param {string} mnemonic - The string of mnemonic words.
   * @param {string} nettype - The network name eg MAINNET.
   * @returns {array} List of public and private keys.
   */
  seedAndKeysFromMnemonic (mnemonic, nettype) {
    checkNetType(nettype)
    if (typeof mnemonic !== 'string') {
      throw Error('Invalid mnemonic')
    }
    mnemonic = mnemonic.replace(/\s+/g, ' ').trim()
    const wordArray = mnemonic.split(' ')

    if (wordArray.length !== 13 && wordArray.length !== 25) {
      throw Error('Invalid number of words. must be 13 or 25-word mnemonic')
    }
    const retString = this.Module.seedAndKeysFromMnemonic(mnemonic, nettype)
    const ret = JSON.parse(retString)
    if (ret.err_msg) {
      throw Error(ret.err_msg)
    }

    return ret
  }

  /**
   * Validates the provided information for logging into the wallet.
   * @param {string} address - The primary address.
   * @param {string} privateViewKey - The wallet private view key.
   * @param {string} privateSpendKey - The wallet private spend key.
   * @param {string} seed - The seed as optional.
   * @param {string} nettype - The network name eg MAINNET.
   * @returns {array} Returns if its valid, view only and the public view and spend keys.
   */
  isValidKeys (address, privateViewKey, privateSpendKey, seed, nettype) {
    checkNetType(nettype)
    const retString = this.Module.isValidKeys(address, privateViewKey, privateSpendKey, seed, nettype)
    const ret = JSON.parse(retString)
    if (ret.err_msg) {
      throw Error(ret.err_msg)
    }

    return { // calling these out so as to provide a stable ret val interface
      isValid: ret.isValid === 'true',
      isViewOnly: ret.isViewOnly === 'true',
      publicViewKey: ret.publicViewKey,
      publicSpendKey: ret.publicSpendKey
    }
  }

  /**
   * Decodes address to provide spend and view keys.
   * @param {string} address - The primary address to decode.
   * @param {string} nettype - The network name eg MAINNET.
   * @returns {array} Break down of the address.
   */
  decodeAddress (address, nettype) {
    checkNetType(nettype)
    const retString = this.Module.decodeAddress(address, nettype)
    const ret = JSON.parse(retString)
    if (ret.err_msg) {
      throw Error(ret.err_msg)
    }

    return {
      publicSpendKey: ret.publicSpendKey,
      publicViewKey: ret.publicViewKey,
      paymentId: ret.paymentId, // may be undefined
      isSubaddress: ret.isSubaddress === 'true'
    }
  }

  /**
   * Creates a new wallet based on the locale.
   * @param {string} localeLanguageCode The locale  based on language and Country. eg. en-US.
   * @param {string} nettype - The network name eg MAINNET.
   * @returns {array} mnemonic details as well as the public and private keys.
   */
  generateWallet (localeLanguageCode, nettype) {
    checkNetType(nettype)
    const retString = this.Module.generateWallet(localeLanguageCode, nettype)
    const ret = JSON.parse(retString)
    if (ret.err_msg) {
      throw Error(ret.err_msg)
    }
    return ret
  }

  /**
   * Compares two mnemonics.
   * @param {string} a - First mnemonic.
   * @param {string} b - Second mnemonic.
   * @returns {boolean} True if they match.
   */
  compareMnemonics (a, b) {
    return this.Module.compareMnemonics(a, b)
  }

  /**
   * Derives the mnemonic from the seed.
   * @param {string} seed - Seed that the mnemonic will be derived from.
   * @param {string} wordsetName - The language wordlist name.
   * @returns {string} The mnemonic seed phrase.
   */
  mnemonicFromSeed (seed, wordsetName) {
    const retString = this.Module.mnemonicFromSeed(seed, apiSafeWordsetName(wordsetName))
    const ret = JSON.parse(retString)
    if (ret.err_msg) {
      throw Error(ret.err_msg)
    }

    return ret.retVal
  }

  /**
   * (Deprecated) Returns a list of public amd private keys derived from the seed.
   * @param {string} seed - The seed string. not to be confused with the mnemonic seed.
   * @param {string} nettype - The network name eg MAINNET.
   * @returns {array} A breakdown of the public and private keys.
   */
  addressAndKeysFromSeed (seed, nettype) {
    checkNetType(nettype)
    const retString = this.Module.addressAndKeysFromSeed(seed, nettype)
    const ret = JSON.parse(retString)
    if (ret.err_msg) {
      throw Error(ret.err_msg)
    }

    return ret
  }

  /**
   * (Deprecated) Checks if address is a subaddress.
   * @param {string} address - The address to check.
   * @param {string} nettype - The network type name eg MAINNET.
   * @returns {boolean} True if address is a subaddress.
   */
  isSubaddress (address, nettype) {
    checkNetType(nettype)
    return this.Module.isSubaddress(address, nettype)
  }

  /**
   * (Deprecated) Checks if address is a integrated address.
   * @param {string} address - The address to check.
   * @param {string} nettype - The network type name eg MAINNET.
   * @returns {boolean} True if address is a integrated address.
   */
  isIntegratedAddress (address, nettype) {
    checkNetType(nettype)
    return this.Module.isIntegratedAddress(address, nettype)
  }

  /**
   * (Deprecated) Generates a integraded address using the address and short payment id provided.
   * @param {string} address - Address you would like to integrate with the payment id.
   * @param {string} paymentId - 16 char short payment id.
   * @param {string} nettype - The network name eg MAINNET.
   * @returns {string} The new integrated addresss.
   */
  newIntegratedAddress (address, paymentId, nettype) {
    checkNetType(nettype)
    if (!paymentId || paymentId.length !== 16) {
      throw Error('expected valid paymentId')
    }
    const retString = this.Module.newIntegratedAddress(address, paymentId, nettype)
    const ret = JSON.parse(retString)
    if (ret.err_msg) {
      throw Error(ret.err_msg)
    }
    return ret.retVal
  }

  /**
   *  Calls the randomOutsCb function provided and validates the response.
   * @private
   * @param {number} numberOfOuts - number of random outs needed.
   * @param {randomOutsCallback} randomOutsCb - The callback function to fetch random outs.
   * @returns {object} An object with a property amount_outs array.
   */
   async _getRandomOuts (numberOfOuts, randomOutsCb) {
    const randomOuts = await randomOutsCb(numberOfOuts)

    if (typeof randomOuts.amount_outs == "undefined" || !Array.isArray(randomOuts.amount_outs)) {
      throw Error("Invalid amount_outs in randomOutsCb response")
    }

    return randomOuts
  }
}

module.exports = WABridge

function checkNetType (netType) {
  switch (netType) {
    case 'MAINNET':
    case 'STAGENET':
    case 'TESTNET':
    case 'FAKECHAIN':
      break
    default:
      throw Error('Invalid nettype')
  }
}

function checkPriority (priority) {
  switch (priority) {
    case 1:
    case 2:
    case 3:
    case 4:
      break
    default:
      throw Error('Invalid priority. must be between 1 to 4')
  }
}

function apiSafeWordsetName (wordsetName) {
  // convert all lowercase, legacy values to core-cpp compatible
  if (wordsetName === 'english') {
    return 'English'
  } else if (wordsetName === 'spanish') {
    return 'Español'
  } else if (wordsetName === 'portuguese') {
    return 'Português'
  } else if (wordsetName === 'japanese') {
    return '日本語'
  }
  return wordsetName // must be a value returned by core-cpp
}
