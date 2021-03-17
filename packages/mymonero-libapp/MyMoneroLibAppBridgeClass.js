// Copyright (c) 2014-2019, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
const MyMoneroCoreBridgeEssentialsClass = require('./MyMoneroCoreBridgeEssentialsClass')
const MyMoneroBridge_utils = require('./MyMoneroBridge_utils')
const nettype_utils = require('@mymonero/mymonero-nettype')
//
class MyMoneroLibAppBridgeClass extends MyMoneroCoreBridgeEssentialsClass {
  constructor (this_Module) {
    super(this_Module)
    //
    const self = this
    self._register_async_cb_fns__SendFundsFormSubmission()
  }
  //
  // SendFundsFormSubmissionController
  _register_async_cb_fns__SendFundsFormSubmission () {
    const self = this
    self.Module.fromCpp__SendFundsFormSubmission__get_unspent_outs = function (req_params) {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__get_unspent_outs'](req_params)
    }
    self.Module.fromCpp__SendFundsFormSubmission__get_random_outs = function (req_params) {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__get_random_outs'](req_params)
    }
    self.Module.fromCpp__SendFundsFormSubmission__submit_raw_tx = function (req_params) {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__submit_raw_tx'](req_params)
    }
    self.Module.fromCpp__SendFundsFormSubmission__status_update = function (params) {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__status_update'](params)
    }
    self.Module.fromCpp__SendFundsFormSubmission__error = function (params) {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__error'](params)
    }
    self.Module.fromCpp__SendFundsFormSubmission__success = function (params) {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__success'](params)
    }
    self.Module.fromCpp__SendFundsFormSubmission__willBeginSending = function () {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__willBeginSending']()
    }
    self.Module.fromCpp__SendFundsFormSubmission__canceled = function () {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__canceled']()
    }
    self.Module.fromCpp__SendFundsFormSubmission__authenticate = function () {
      self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__authenticate']()
    }
  }
  __new_cb_args_with_no_task_id (err_msg, res) {
    const args = {}
    if (typeof err_msg !== 'undefined' && err_msg) {
      args.err_msg = err_msg // errors must be sent back so that C++ can free heap vals container
    } else {
      args.res = res
    }
    return args
  }
  async__send_funds (fn_args) {
    const self = this
    // register cb handler fns to wait for calls with thi task id
    if (typeof self._cb_handlers__SendFundsFormSubmission !== 'undefined' && self._cb_handlers__SendFundsFormSubmission != null) {
      throw 'Expected self._cb_handlers__SendFundsFormSubmission - send-funds must already be in progress - this should be disallowed in the UI'
    }
    const errHandler_fn = function (params) {
      if (typeof params.err_code !== 'undefined' && params.err_code !== null) { // this can be nil in case of a server error
        params.err_code = parseInt('' + params.err_code)
      }
      if (typeof params.createTx_errCode !== 'undefined' && params.createTx_errCode !== null) {
        params.createTx_errCode = parseInt('' + params.createTx_errCode)
      }
      fn_args.error_fn(params)
      self._cb_handlers__SendFundsFormSubmission = null // reset so we can enter process again
    }
    self._cb_handlers__SendFundsFormSubmission = {}
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__get_unspent_outs'] = function (req_params) {
      // convert bridge-strings to native primitive types
      req_params.use_dust = MyMoneroBridge_utils.ret_val_boolstring_to_bool(req_params.use_dust)
      req_params.mixin = parseInt(req_params.mixin)
      //
      fn_args.get_unspent_outs_fn(req_params, function (err_msg, res) {
        const args = self.__new_cb_args_with_no_task_id(err_msg, res)
        const ret_string = self.Module.send_cb_I__got_unspent_outs(JSON.stringify(args))
        const ret = JSON.parse(ret_string)
        if (typeof ret.err_msg !== 'undefined' && ret.err_msg) { // this is actually an exception
          errHandler_fn({
            err_msg: ret.err_msg
          })
          // ^-- this will clean up cb handlers too
        } else {
          // TODO: assert Object.keys(ret).length == 0
        }
      })
    }
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__get_random_outs'] = function (req_params) {
      // convert bridge-strings to native primitive types
      req_params.count = parseInt(req_params.count)
      //
      fn_args.get_random_outs_fn(req_params, function (err_msg, res) {
        const args = self.__new_cb_args_with_no_task_id(err_msg, res)
        const ret_string = self.Module.send_cb_II__got_random_outs(JSON.stringify(args))
        const ret = JSON.parse(ret_string)
        if (typeof ret.err_msg !== 'undefined' && ret.err_msg) { // this is actually an exception
          errHandler_fn({
            err_msg: ret.err_msg
          })
          // ^-- this will clean up cb handlers too
        } else {
          // TODO: assert Object.keys(ret).length == 0
        }
      })
    }
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__submit_raw_tx'] = function (req_params) {
      fn_args.submit_raw_tx_fn(req_params, function (err_msg, res) {
        const args = self.__new_cb_args_with_no_task_id(err_msg, res)
        const ret_string = self.Module.send_cb_III__submitted_tx(JSON.stringify(args))
        const ret = JSON.parse(ret_string)
        if (typeof ret.err_msg !== 'undefined' && ret.err_msg) { // this is actually an exception
          errHandler_fn({
            err_msg: ret.err_msg
          })
          // ^-- this will clean up cb handlers too
        } else {
          // TODO: assert Object.keys(ret).length == 0
        }
      })
    }
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__status_update'] = function (params) {
      params.code = parseInt('' + params.code)
      //
      fn_args.status_update_fn(params)
    }
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__error'] = errHandler_fn
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__canceled'] = function () {
      fn_args.canceled_fn()
      self._cb_handlers__SendFundsFormSubmission = null // reset so we can enter process again
    }
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__authenticate'] = function () {
      fn_args.authenticate_fn(function (did_pass) {
        const payload = { did_pass: did_pass }
        self.Module.send_cb__authentication(JSON.stringify(payload))
      })
    }
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__willBeginSending'] = function () {
      fn_args.willBeginSending_fn()
    }
    self._cb_handlers__SendFundsFormSubmission['fromCpp__SendFundsFormSubmission__success'] = function (params) {
      params.mixin = parseInt(params.mixin)
      params.isXMRAddressIntegrated = MyMoneroBridge_utils.ret_val_boolstring_to_bool(params.isXMRAddressIntegrated)
      //
      fn_args.success_fn(params)
      self._cb_handlers__SendFundsFormSubmission = null // reset so we can enter process again
    }
    const args =
		{
		  fromWallet_didFailToInitialize: fn_args.fromWallet_didFailToInitialize,
		  fromWallet_didFailToBoot: fn_args.fromWallet_didFailToBoot,
		  fromWallet_needsImport: fn_args.fromWallet_needsImport,
		  requireAuthentication: fn_args.requireAuthentication,
		  //
		  sending_amount_double_string: fn_args.sending_amount_double_string,
		  hasPickedAContact: fn_args.hasPickedAContact,
		  resolvedAddress_fieldIsVisible: fn_args.resolvedAddress_fieldIsVisible,
		  manuallyEnteredPaymentID_fieldIsVisible: fn_args.manuallyEnteredPaymentID_fieldIsVisible,
		  resolvedPaymentID_fieldIsVisible: fn_args.resolvedPaymentID_fieldIsVisible,

		  is_sweeping: fn_args.is_sweeping,
		  from_address_string: fn_args.from_address_string,
		  sec_viewKey_string: fn_args.sec_viewKey_string,
		  sec_spendKey_string: fn_args.sec_spendKey_string,
		  pub_spendKey_string: fn_args.pub_spendKey_string,
		  priority: '' + fn_args.priority,
		  nettype_string: nettype_utils.nettype_to_API_string(fn_args.nettype)
		}
    if (typeof fn_args.contact_payment_id !== 'undefined' && fn_args.contact_payment_id !== null && fn_args.contact_payment_id !== '') {
      args.contact_payment_id = fn_args.contact_payment_id
    }
    if (typeof fn_args.cached_OAResolved_address !== 'undefined' && fn_args.cached_OAResolved_address !== null && fn_args.cached_OAResolved_address !== '') {
      args.cached_OAResolved_address = fn_args.cached_OAResolved_address
    }
    if (typeof fn_args.contact_hasOpenAliasAddress !== 'undefined' && fn_args.contact_hasOpenAliasAddress !== null && fn_args.contact_hasOpenAliasAddress !== '') {
      args.contact_hasOpenAliasAddress = fn_args.contact_hasOpenAliasAddress
    }
    if (typeof fn_args.contact_address !== 'undefined' && fn_args.contact_address !== null && fn_args.contact_address !== '') {
      args.contact_address = fn_args.contact_address
    }
    if (typeof fn_args.enteredAddressValue !== 'undefined' && fn_args.enteredAddressValue !== null && fn_args.enteredAddressValue !== '') {
      args.enteredAddressValue = fn_args.enteredAddressValue
    }
    if (typeof fn_args.resolvedAddress !== 'undefined' && fn_args.resolvedAddress !== null && fn_args.resolvedAddress !== '') {
      args.resolvedAddress = fn_args.resolvedAddress
    }
    if (typeof fn_args.manuallyEnteredPaymentID !== 'undefined' && fn_args.manuallyEnteredPaymentID !== null && fn_args.manuallyEnteredPaymentID !== '') {
      args.manuallyEnteredPaymentID = fn_args.manuallyEnteredPaymentID
    }
    if (typeof fn_args.resolvedPaymentID !== 'undefined' && fn_args.resolvedPaymentID !== null && fn_args.resolvedPaymentID !== '') {
      args.resolvedPaymentID = fn_args.resolvedPaymentID
    }
    const args_str = JSON.stringify(args, null, '')
    const ret_string = this.Module.send_funds(args_str)
    const ret = JSON.parse(ret_string)
    if (typeof ret.err_msg !== 'undefined' && ret.err_msg) { // this is actually an exception
      errHandler_fn({
        err_msg: ret.err_msg
      })
      // ^-- this will clean up cb handlers too
    } else {
      // TODO: assert Object.keys(ret).length == 0
    }
  }
}
module.exports = MyMoneroLibAppBridgeClass
