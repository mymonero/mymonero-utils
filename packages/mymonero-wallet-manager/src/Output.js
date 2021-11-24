'use strict'

const BigNumber = require('bignumber.js')

class Output {
  constructor (txPublicKey, keyImage, amount, outputIndex, mixin = 10) {
    this.txPublicKey = txPublicKey
    this.keyImage = keyImage
    this.amount = new BigNumber(amount)
    this.outputIndex = outputIndex
    this.mixin = mixin
  }
}

module.exports = Output
