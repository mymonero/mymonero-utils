const axios = require("axios");
const ChangeNowIntegration = require("./CryptoAPI");
const integration = require("./CryptoAPI")

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

    // console.log('before start');
    // let response;
    // response = await initialise();
    // console.log(response);

    // response = await getMinimal();
    // console.log(response);

    // response = await validateAddresses();
    // console.log(response);

    // response = await createOrder()
    // console.log(response);
    
    // response = await getEstimatedAmount();
    // console.log(response);

    // response = await createOrder();
    // console.log(response);

    // response = await getTransactionStatus();
    // console.log(response);
    // let instance = await new ChangeNowIntegration()
    // let meh = await instance.retrieveFilteredMoneroCurrencyData().then(response => {
    //     console.log(response);
    // })

    console.log('after start');
})();

