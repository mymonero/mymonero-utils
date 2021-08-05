const axios = require("axios");
const FiatAPI = require("./FiatAPI");
const integration = require("./FiatAPI")

async function createExchangeTransaction(from_amount, from_currency, to_currency, address) {
    
}

async function initialise() {
    try {
        let instance = new integration();
        let workflowsEnabled = []
        const parameters = await Promise.allSettled([instance.retrieveFixedFlowParameters(), instance.retrieveStandardFlowParameters()])
        console.log(parameters);
        console.log(parameters[1].value);
        let parameterObj = {
            
        }
        if (parameters[0].status == "fulfilled") {
            parameterObj.fixedRateParameters = parameters[0].value
        }
        if (parameters[1].status == "fulfilled") {
            parameterObj.standardRateParameters = parameters[1].value
        }
        return parameterObj
    } catch {
        throw new Error("Unexpected error occurred when initializing")
    }
}

async function getMinimal() {
    let instance = new integration();
    // try {
    //     response = await instance.getMinimalExchangeAmount('xmr', 'btc', 'fixed-rate')
    //     console.log(response)
    // } catch (error) {
    //     console.log(error);
    // }

    let response = await instance.getMinimalExchangeAmount('xmr', 'btc', 'standard')
    console.log(response)

    return response
}

async function validateAddresses() {
    let instance = new integration();
    let response
    // valid BTC address
    response = await instance.validateAddress('btc', '3E6iM3nAY2sAyTqx5gF6nnCvqAUtMyRGEm')
    console.log(response)
    console.log("1 worked")
    // valid XMR address
    response = await instance.validateAddress('xmr', '47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9')
    console.log(response)
    console.log("2 worked")
    // invalid XMR address
    response = await instance.validateAddress('xmr', '3E6iM3nAY2sAyTqx5gF6nnCvqAUtMyRGEm')
    console.log(response)
    console.log("3 worked")
    return true
}

async function getEstimatedAmount() {
    let instance = new integration();
    let response

    let fromCurrency = 'xmr';
    let toCurrency = 'btc';
    let flow = "standard";
    let fromAmount = "0.5";
    let toAmount = "";
    // try {
    //     response = await instance.getEstimatedAmount(fromCurrency, toCurrency, flow, fromAmount, toAmount);
    // } catch (error) {
    //     console.log(error);
    // }
    // console.log(response);
    //https://api.changenow.io/v2/exchange/estimated-amount?fromCurrency=btc&toCurrency=usdt&fromAmount=0.1&toAmount=&fromNetwork=btc&toNetwork=eth&flow=fixed-rate&type=&useRateId=true

    // fromCurrency = "btc";
    // toCurrency = "usdt";
    // fromAmount = "0.1";
    // toAmount = "";
    // flow = "fixed-rate";
    
    try {
        response = await instance.getEstimatedAmount(fromCurrency, toCurrency, flow, fromAmount, toAmount);
    } catch (error) {
        console.log(error);
    }
    console.log(response)
}

async function createOrder() {
    let instance = new integration();
    let response

    let fromCurrency = "xmr"
    let toCurrency = "btc"
    let flow = "standard"
    let fromAmount = "0.5"
    let toAmount = ""
    let type = "direct"
    let refundAddress = "47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9"
    let destinationAddress = "3E6iM3nAY2sAyTqx5gF6nnCvqAUtMyRGEm";
    try {
        // createTransaction(fromCurrency, toCurrency, flow, fromAmount, toAmount, refundAddress, type = "direct") {
        response = await instance.createTransaction(fromCurrency, toCurrency, flow, fromAmount, toAmount, destinationAddress, refundAddress, type);
        
    } catch (error) {
        console.log(error);
    }
    console.log(response)
}

async function getTransactionStatus() {
    let instance = new integration();
    let response

    let id = "ca20f5056d502b";
    try {
        // createTransaction(fromCurrency, toCurrency, flow, fromAmount, toAmount, refundAddress, type = "direct") {
        response = await instance.getTransactionStatus(id)
        
    } catch (error) {
        console.log(error);
    }
    console.log(response)
}

(async() => {
    let response;
    
    let instance = new FiatAPI();

    // GET
    // Fiat currencies
    // https://api.changenow.io/v2/fiat-currencies/fiat

    // response = await instance.getAvailableFiatCurrencies();


    // GET
    // Crypto currencies
    // https://api.changenow.io/v2/fiat-currencies/crypto

    // response = await instance.getAvailableCryptocurrencies();
    
    
    // GET
    // Estimate
    // https://api.changenow.io/v2/fiat-estimate?from_currency=&from_network=&from_amount=&to_currency=&to_network=&deposit_type=&payout_type=    
    // response = await instance.getTransactionEstimate(200, "USD", "XMR");

    // GET
    // Transaction status
    // https://api.changenow.io/v2//fiat-transaction/?id=id
    response = await instance.getTransactionStatus("4771173146");
    
    

    // GET
    // MarketInfo
    // https://api.changenow.io/v2/fiat-market-info/min-max-range/{fromto}

    //response = await instance.getMinMaxRange("USD", "XMR");
    //response = await instance.getMinMaxRange("USD", "BTC");

    // GET
    // Fiat helthcheck service
    // https://api.changenow.io/v2/fiat-status

    //response = await instance.getFiatAPIStatus();

    // POST
    // Create fiat transaction
    // https://api.changenow.io/v2/fiat-transaction

    //response = await instance.createExchangeTransaction(500, "EUR", "XMR", "488ti8HzaWE9gyCS94YGqeJ735acPErGCWxBid5osQhJRe9pipvzrBRV4oBEVxJuLvfVZyW2J9qt1T2dB14XLejB14Kaq3o");

    console.log(response);

})();

