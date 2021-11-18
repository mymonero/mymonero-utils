'use strict'

const BigNumber = require('bignumber.js')
const Output = require('./Output')

class Transaction {
  constructor (options) {
    this.hash = options.hash
    this.contact = options.contact || null
    this.destinationAddress = options.destinationAddress || null
    this.txPublicKey = options.txPublicKey || null
    this.id = options.id
    this.timestamp = new Date(options.timestamp)
    this.received = new BigNumber(options.received || 0)
    this.sent = new BigNumber(options.sent || 0)
    this.fee = new BigNumber(options.fee || 0)
    this.unlockTime = options.unlockTime
    this.height = options.height
    this.coinbase = options.coinbase
    this.mempool = options.mempool
    this.mixin = options.mixin
    this.spentOutputs = []
    this.currentBlockHeight = options.currentBlockHeight
    this.amount = this.received.minus(this.sent.minus(this.fee))
    this._prepareSpentOutputs(options.spentOutputs)
    if (this._confirmWeExchangedValue()) {
      this._calculateConfirmations()
      this._calulateStatus()
      this._calculateDirection()
    }
  }

  /**
   * Whether the transaction was ours and not a decoy.
   * @returns {boolean}
   */
  _confirmWeExchangedValue () {
    const self = this
    return (self.received.plus(self.sent).comparedTo(0) > 0)
  }

  /**
   * Calaculate the number of confirmations.
   * @private
   */
  _calculateConfirmations () {
    const self = this
    let confirmations = 0
    if (self.mempool === false) {
      confirmations = self.currentBlockHeight - self.height + 1
    }

    self.confirmations = confirmations
  }

  /**
   * Calculates the confirmation status.
   * @private
   */
  _calulateStatus () {
    const self = this
    let status = 'unconfirmed'
    if (self.mempool === false) {
      status = 'confirmed'
    }
    if (self.confirmations >= 10) {
      status = 'complete'
    }
    self.status = status
  }

  /**
   * Determines if the transaction is incoming or outgoing.
   * @private
   */
  _calculateDirection () {
    const self = this
    if (self.amount.isNegative()) {
      self.direction = 'outgoing'
    } else {
      self.direction = 'incoming'
    }
  }

  /**
   * Convert Outputs into Output objects.
   * @private
   * @param {array} outputs - Array of outputs.
   */
  _prepareSpentOutputs (outputs) {
    for (let i = 0; i < outputs.length; i++) {
      if (outputs[i] instanceof Output) {
        continue
      }
      this.spentOutputs.push(new Output(outputs[i].tx_pub_key, outputs[i].key_image, outputs[i].amount, outputs[i].out_index, outputs[i].mixin))
    }
  }
}

module.exports = Transaction
