'use strict'

function IsValidPaymentIDOrNoPaymentID (payment_id__orNil) {
  if (
    payment_id__orNil == null ||
		payment_id__orNil == ''
  ) {
    return true // no pid
  }
  let payment_id = payment_id__orNil
  if (IsValidShortPaymentID(payment_id)) {
    return true
  }
  if (IsValidLongPaymentID(payment_id)) {
    return true
  }
  return false
}

exports.IsValidPaymentIDOrNoPaymentID = IsValidPaymentIDOrNoPaymentID

function IsValidShortPaymentID (payment_id) {
  return IsValidPaymentIDOfLength(payment_id, 16)
}

exports.IsValidShortPaymentID = IsValidShortPaymentID

function IsValidLongPaymentID (payment_id) {
  return IsValidPaymentIDOfLength(payment_id, 64)
}

exports.IsValidLongPaymentID = IsValidLongPaymentID

function IsValidPaymentIDOfLength (payment_id, required_length) {
  if (required_length != 16 && required_length != 64) {
    throw Error('unexpected IsValidPaymentIDOfLength required_length')
  }
  let payment_id_length = payment_id.length
  if (payment_id_length !== required_length) {
    // new encrypted short
    return false // invalid length
  }
  let pattern = RegExp('^[0-9a-fA-F]{' + required_length + '}$')
  if (pattern.test(payment_id) != true) {
    // not a valid required_length char pid
    return false // then not valid
  }
  return true
}
