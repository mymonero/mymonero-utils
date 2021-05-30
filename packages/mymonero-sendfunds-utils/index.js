'use strict'

function _mixinToRingsize (mixin) {
  return mixin + 1
}

function thisFork_minMixin () {
  return 10
}

function thisFork_minRingSize () {
  return _mixinToRingsize(thisFork_minMixin())
}

exports.thisFork_minMixin = thisFork_minMixin
exports.thisFork_minRingSize = thisFork_minRingSize

function fixedMixin () {
  return thisFork_minMixin() /* using the monero app default to remove MM user identifiers */
}

function fixedRingsize () {
  return _mixinToRingsize(fixedMixin())
}

exports.fixedMixin = fixedMixin
exports.fixedRingsize = fixedRingsize

function default_priority () {
  return 1
} // aka .low

exports.default_priority = default_priority

const SendFunds_ProcessStep_Code = {
  fetchingLatestBalance: 1,
  calculatingFee: 2,
  fetchingDecoyOutputs: 3,
  constructingTransaction: 4, // may go back to .calculatingFee
  submittingTransaction: 5
}

exports.SendFunds_ProcessStep_Code = SendFunds_ProcessStep_Code

const SendFunds_ProcessStep_MessageSuffix = {
  1: 'Fetching latest balance.',
  2: 'Calculating fee.',
  3: 'Fetching decoy outputs.',
  4: 'Constructing transaction.', // may go back to .calculatingFee
  5: 'Submitting transaction.'
}

exports.SendFunds_ProcessStep_MessageSuffix = SendFunds_ProcessStep_MessageSuffix
