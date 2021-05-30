'use strict'

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

function HTTPRequest (
  request_conformant_module, // such as 'request' or 'xhr' .. TODO: consider switching to 'fetch'
  apiAddress_authority, // authority means [subdomain.]host.…[:…] with no trailing slash
  endpointPath,
  final_parameters,
  fn
) {
  // fn: (err?, data?) -> new Request
  if (typeof final_parameters === 'undefined' || final_parameters == null) {
    throw 'final_parameters must not be nil'
    // return null
  }
  const completeURL =
		_new_APIAddress_baseURLString(apiAddress_authority) + endpointPath
  console.log('📡  ' + completeURL)
  //
  const request_options = _new_requestOptions_base(
    'POST',
    completeURL,
    final_parameters
  )
  const requestHandle = request_conformant_module(
    request_options,
    function (err_orProgressEvent, res, body) {
      _new_HTTPRequestHandlerFunctionCallingFn(fn)(
        // <- called manually instead of directly passed to request_conformant_module call to enable passing completeURL
        completeURL,
        err_orProgressEvent,
        res,
        body
      )
    }
  )
  //
  return requestHandle
}
exports.HTTPRequest = HTTPRequest

function _new_APIAddress_baseURLString (
  apiAddress_authority // authority means [subdomain.]host.…[:…]
) {
  return 'https' + '://' + apiAddress_authority + '/'
}

function _new_requestOptions_base (methodName, completeURL, json_parameters) {
  return {
    method: methodName,
    url: completeURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    json: json_parameters,
    useXDR: true, // CORS
    withCredentials: true // CORS
  }
}

function _new_HTTPRequestHandlerFunctionCallingFn (fn) {
  return function (completeURL, err_orProgressEvent, res, body) {
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
}