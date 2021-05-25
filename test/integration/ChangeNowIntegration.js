
const { it } = require('mocha');
const ChangeNowIntegration = require('../../ChangeNowIntegration');
const expect = require("chai").expect;
var instance = new ChangeNowIntegration();
// get transaction status
//estimated exchange amount
// List of available currencies
//  -- fixed-rate
//  -- standard
// minimal exchange amount
// exchange range
// estimated exchange amount
// create transaction
// transaction status
// address validation
//const request = require("supertest")(instance.getApiPath());

describe('ChangeNow API integration', async function() {
    describe('Validate cryptocurrency addresses', function() {
        
        describe('Test valid XMR address is reported as valid by ChangeNow', () => {
            it('should return a JSON object in form { result: true, message: null }', () => {
                return instance.validateAddress('xmr', '47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9').then(response => {
                    expect(response.result).to.equal(true)
                    expect(response.message).to.equal(null)
                })
            })
        })

        describe('Test invalid XMR address is reported as invalid by ChangeNow', () => {
            it('should return a JSON object in form { result: true, message: null }', () => {
                return instance.validateAddress('xmr', 'sadfwasdfasf').then(response => {
                    
                    expect(response.result).to.equal(false)
                    expect(response.message).to.not.equal(null)
                })
            })
        })

        describe('Test valid BTC address is reported as valid by ChangeNow', () => {
            it('should return a JSON object in form { result: true, message: null }', () => {
                return instance.validateAddress('btc', '3E6iM3nAY2sAyTqx5gF6nnCvqAUtMyRGEm').then(response => {
                    expect(response.result).to.equal(true)
                    expect(response.message).to.equal(null)
                })
            })
        })
    }) 

    describe('list available currencies -- standard and fixed flow mechanisms', function() {
        
        describe('using fixed-rate flow', function(done) {
            it('should return a JSON array with an object for each currency', () => {
                return instance.getFixedFlowCurrencies().then(response => {
                    //console.log(response);
                    expect(response).to.be.an('array');
                })
            });
        })

        describe('using standard rate flow', function(done) {
            it('should return a JSON array with an object for each currency', () => {
                return instance.getStandardFlowCurrencies().then(response => {
                    //console.log(response);
                    expect(response).to.be.an('array');
                })
            });
        })

    });

    describe('Return filtered Monero data', function() {
        it('should return a JSON object containing Monero-specific data', () => {
            //this.timeout(5000)
            console.log("try retrieve");
            return instance.retrieveFilteredMoneroCurrencyData().then(response => {
                console.log(response);
                expect(response).to.be.an('object');
                expect(response, 'ChangeNow may have disabled fixed-rate XMR support temporarily').to.have.property('fixedRateParameters');
                expect(response, 'ChangeNow may have disabled standard-rate XMR support temporarily').to.have.property('standardRateParameters');
                //done();
            });
            
            
            // return instance.retrieveFilteredMoneroCurrencyData().then(response => {
            //     console.log(response);
            // })
        })
    })

    describe('get transaction status', function(done) {
        it('should return a JSON array describing the transaction that has the specified transaction id', () => {
            return instance.getTransactionStatus('659fc992aa5bfd').then(response => {
                expect(response).to.be.an('object');
                expect(response).to.have.all.keys(
                    "actionsAvailable",
                    "amountFrom",
                    "amountTo",
                    "createdAt",
                    "depositReceivedAt",
                    "expectedAmountFrom",
                    "expectedAmountTo",
                    "fromCurrency",
                    "fromLegacyTicker",
                    "fromNetwork",
                    "id",
                    "payinAddress",
                    "payinExtraId",
                    "payinHash",
                    "payoutAddress",
                    "payoutExtraId",
                    "payoutHash",
                    "refundAddress",
                    "refundExtraId",
                    "status",
                    "toCurrency",
                    "toLegacyTicker",
                    "toNetwork",
                    "updatedAt",
                    "validUntil",
                );

            })
        })
    })

    describe('get estimated exchange amount', function(done) {
        it('should return a JSON object estimating the exchange amount between a specified fromCurrency and a toCurrency given a from amount', () => {
            let fromCurrency = 'xmr';
            let toCurrency = 'btc';
            let flow = "standard";
            let fromAmount = "0.5";
            let toAmount = "";
            return instance.getEstimatedAmount(fromCurrency, toCurrency, flow, fromAmount, toAmount).then(response => {
                expect(response).to.have.all.keys(
                    "fromCurrency",
                    "fromNetwork",
                    "toCurrency",
                    "toNetwork",
                    "flow",
                    "type",
                    "rateId",
                    "validUntil",
                    "transactionSpeedForecast",
                    "warningMessage",
                    "fromAmount",
                    "toAmount"
                );
            })
        });
    })


    describe('create order', function(done) {
        it('should return a JSON object describing the created order', () => {
            this.timeout(5000)
            let fromCurrency = "xmr"
            let toCurrency = "btc"
            let flow = "standard"
            let fromAmount = "0.5"
            let toAmount = ""
            let type = "direct"
            let refundAddress = "47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9"
            let destinationAddress = "3E6iM3nAY2sAyTqx5gF6nnCvqAUtMyRGEm";
            return instance.createTransaction(fromCurrency, toCurrency, flow, fromAmount, toAmount, destinationAddress, refundAddress).then(response => {
                expect(response).to.be.an('object');
                // note -- while the official docs specify payoutExtraId and refundExtraId return, they don't
                expect(response).to.have.all.keys(
                    "fromAmount",
                    "toAmount",
                    "flow",
                    "type",
                    "payinAddress",
                    "payoutAddress",
                    "fromCurrency",
                    "toCurrency",
                    "refundAddress",
                    "id",
                    "fromNetwork",
                    "toNetwork" /** "payoutExtraId", "refundExtraId"  */
                );
            })
        })
    })
    

    describe('get minimal exchange amount', function(done) {
        it('should return a JSON object describing the minimum exchange amount between a specified fromCurrency and a toCurrency', () => {
            return instance.getExchangeRange('xmr', 'btc', 'standard').then(response => {
                this.timeout(5000)
                expect(response).to.have.all.keys(
                    "fromCurrency",
                    "fromNetwork",
                    "toCurrency",
                    "toNetwork",
                    "flow",
                    "minAmount"
                );
            })    
        })
    })

    describe('get current exchange range for currency', function(done) {
        it('should return a JSON object describing the current exchange rate between a specified fromCurrency and a toCurrency', () => {
            return instance.getExchangeRange('xmr', 'btc', 'standard').then(response => {
                this.timeout(5000)
                expect(response).to.have.all.keys(
                    "fromCurrency",
                    "fromNetwork",
                    "toCurrency",
                    "toNetwork",
                    "flow",
                    "maxAmount",
                    "minAmount",
                );
            })
        })
    })


});
