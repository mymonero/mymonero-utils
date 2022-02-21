'use strict'

const xhr = require('xhr')

function New_ParametersForWalletRequest (address, view_key__private) {
  return {
    address: address,
    view_key: view_key__private
  }
}
exports.New_ParametersForWalletRequest = New_ParametersForWalletRequest

function AddUserAgentParamters (parameters, appUserAgent_product, appUserAgent_version) {
  // setting these on params instead of as header field User-Agent so as to retain all info found in User-Agent, such as platform… and these are set so server has option to control delivery
  parameters['app_name'] = appUserAgent_product
  parameters['app_version'] = appUserAgent_version
}
exports.AddUserAgentParamters = AddUserAgentParamters

function HTTPRequest (apiAddressAuthority, endpointPath, finalParameters, fn) {
  if (typeof finalParameters === 'undefined' || finalParameters == null) {
    throw Error('final_parameters must not be nil')
  }
  const completeURL = apiAddress_authority + endpointPath
  console.log('📡  ' + completeURL)

  const requestOptions = {
    method: 'POST',
    url: completeURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    json: finalParameters,
    useXDR: true, // CORS
    withCredentials: true // CORS
  }

  const requestHandle = xhr(
    requestOptions,
    function (err_orProgressEvent, res, body) {
      _new_HTTPRequestHandlerFunctionCallingFn(completeURL,
        err_orProgressEvent,
        res,
        body, fn)
    }
  )
  //
  return requestHandle
}
exports.HTTPRequest = HTTPRequest

function _new_HTTPRequestHandlerFunctionCallingFn (completeURL, err_orProgressEvent, res, body, fn) {
  // err appears to actually be a ProgressEvent
  var err = null
  const statusCode = typeof res !== 'undefined' ? res.statusCode : -1
  if (statusCode == 0 || statusCode == -1) {
    // we'll treat 0 as a lack of internet connection.. unless there's a better way to make use of err_orProgressEvent which is apparently going to be typeof ProgressEvent here
    err = new Error('Connection Failure')
  } else if (statusCode !== 200) {
    const body_Error =
				body && typeof body === 'object' ? body.Error : undefined
    const statusMessage =
				res && res.statusMessage ? res.statusMessage : undefined
    if (typeof body_Error !== 'undefined' && body_Error) {
      err = new Error(body_Error)
    } else if (typeof statusMessage !== 'undefined' && statusMessage) {
      err = new Error(statusMessage)
    } else {
      err = new Error('Unknown ' + statusCode + ' error')
    }
  }
  if (err) {
    console.error('❌  ' + err)
    // console.error("Body:", body)
    fn(err, null)
    return
  }
  var json
  if (typeof body === 'string') {
    try {
      json = JSON.parse(body)
    } catch (e) {
      console.error(
        '❌  HostedMoneroAPIClient Error: Unable to parse json with exception:',
        e,
        '\nbody:',
        body
      )
      fn(e, null)
    }
  } else {
    json = body
  }
  console.log('✅  ' + completeURL + ' ' + statusCode)
  fn(null, json)
}
