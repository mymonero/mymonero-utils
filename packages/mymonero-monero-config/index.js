'use strict'

const JSBigInt = require('@mymonero/mymonero-bigint').BigInteger

module.exports = {
  // Number of atomic units in one unit of currency. e.g. 12 => 10^12 = 1000000000000
  coinUnitPlaces: 12,

  // Minimum number of confirmations for a transaction to show as confirmed
  txMinConfirms: 10,

  // Currency symbol
  coinSymbol: 'XMR',

  // OpenAlias prefix
  openAliasPrefix: 'xmr',

  // Currency name
  coinName: 'Monero',

  // Payment URI Prefix
  coinUriPrefix: 'monero:',

  // Dust threshold in atomic units
  // 2*10^9 used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
  dustThreshold: new JSBigInt('2000000000'),

  // Maximum block number, used for tx unlock time
  maxBlockNumber: 500000000,

  // Average block time in seconds, used for unlock time estimation
  avgBlockTime: 60
}