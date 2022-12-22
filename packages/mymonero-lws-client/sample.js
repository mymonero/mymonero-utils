'use strict'

const axios = require('axios')
const LWSClient = require('./src/index')


async function init() {
    const options = {
        httpClient: axios,
        url: 'https://<subdomain>.mymonero.com',
        appName: 'MyMonero',
        appVersion: '1.1.25',
        api_key: 'redacted' // can be null for certain queries
    }
    // console.log(options);
    const lwsClient = await new LWSClient(options);
    return lwsClient
} // working

async function test_unspent_outs() {
    let lwsClient = await init();
    
    const privateViewKey = '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104'
    const address = '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
    const result = await lwsClient.unspentOutputs(
      privateViewKey,
      address
    )
    console.log(result);
}

async function test_import_wallet() {
    let lwsClient = await init();
    const view_key = '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104'
    const address = '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
    const start_block_height = 0 
    const result = await lwsClient.import_wallet_auth(
        address,
        view_key, 
        start_block_height
    )
    console.log(result)
}


async function test_resync_wallet() {
    let lwsClient = await init();
    const view_key = '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104'
    const address = '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
    const start_block_height = 0 
    const result = await lwsClient.sync_wallet_with_address(
        address,
        view_key
    )
    console.log(result)
}

// try {
//     test_unspent_outs()
// } catch (err) {
//     console.log("Error with test_unspent_outs:" + err)
// }

try {
    test_import_wallet()
} catch (err) {
    console.log("Error with test_import_wallet():" + err)
}

try {
    test_resync_wallet()
} catch (err) {
    console.log("Error with test_resync_wallet():" + err)
}

/** Karl's notes 

1. /get_unspent_outs: works as intended, except for a possible authorization bug
    
    End-point works correctly for a request body when invoking lwsClient.unspentOutputs(view_key, address):

    Potential bug: 

    Expected behaviour: 
    Server should return an error when omitting the API key

    Actual behaviour: 
    Server returns unspent outs when api key omitted
    
-----------------------------------------------------------------------------

2. /import_wallet_auth: not able to successfully retrieve a response

    Test import wallet returns a 403 error if api_key is omitted. Request body to reproduce:

    Request sent to atomic.mymonero.com

    Request body: 
    
    {
        address: '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
        view_key: '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
        api_key: 'karlredactedthis',
        start_block_height: 0,
        start_tx_height: null,
        start_date: null
    }

    Potential bugs:
    1. 
        Expected behaviour: 
        Server returns { account_updated: true } response for this endpoint using the values above

        Actual behaviour: 
        Server returns a 403 for the request body above

    2. 
        Expected behaviour: 
        When omitting optional parameters, a successful response should be returned

        Actual behaviour:
        Omitting the optional `start_tx_height` and `start_date` from the request body throws a "Error: missing or invalid parameters" error
    

--------------------------------------------------
3. /sync_wallet_with_address: works as expected
    
    Sync wallet with address returns a successful response with the JSON body { account_updated: true } when api key included

    Request sent to atomic.mymonero.com

    Request body: 
    {
        address: '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
        api_key: 'karlredactedthis'
    }

    Response body:

    { account_updated: true }

    Authorization works as expected
-----------------------------------------------------------------------------

*/


