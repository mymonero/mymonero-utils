
const { it } = require('mocha');
const CryptoAPI = require('../../CryptoAPI');
const expect = require("chai").expect;
var instance = new CryptoAPI();

/**
 * 
 * Fiat operations
 * POST - https://api.changenow.io/v2/fiat-transaction
 * 
POST
Create exchange transaction with fiat
https://api.changenow.io/v2/fiat-transaction
BODY PARAMETERS:
  "from_amount": 1200.24,
  "from_currency": "EUR",
  "to_currency": "BTC",
  "from_network": null,
  "to_network": "BNB",
  "payout_address": "mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy",
  "payout_extra_id": "1",
  "deposit_type": "SEPA_1",
  "payout_type": "SEPA_1",
  "external_partner_link_id": ""


RESPONSE PARAMETERS: 
{
  "id": "4496229738",
  "status": "new",
  "email": null,
  "errors": [],
  "status_details": null,
  "from_currency": "EUR",
  "from_network": null,
  "from_currency_with_network": null,
  "from_amount": "0",
  "deposit_type": "SEPA_1",
  "payout_type": "CRYPTO_THROUGH_CN",
  "expected_from_amount": "1200.24",
  "to_currency": "TRX",
  "to_network": null,
  "to_currency_with_network": null,
  "to_amount": null,
  "output_hash": null,
  "expected_to_amount": "23445.66041",
  "location": "DE",
  "created_at": "2021-07-14T10:36:40.273Z",
  "updated_at": "2021-07-14T10:36:40.273Z",
  "partner_id": "6437862205",
  "external_partner_link_id": null,
  "estimate_breakdown": {
    "toAmount": "23445.66041",
    "fromAmount": 1200.24,
    "serviceFees": [
      {
        "name": "Service fee",
        "amount": "2.49",
        "currency": "EUR"
      }
    ],
    "convertedAmount": {
      "amount": "1197.75",
      "currency": "EUR"
    },
    "estimatedExchangeRate": "19.57475300",
    "networkFee": {
      "amount": "0.1",
      "currency": "TRX"
    }
  },
  "payout": {
    "address": "0x7cC3BD073c6d9564bb67ffCb86f76D36e48ce3F1",
    "extra_id": "1"
  },
  "redirect_url": "https://payments.guardarian.com/checkout?tid=4496229738"
}
GET
Transaction status
https://api.changenow.io/v2//fiat-transaction/?id=id
GET
Estimate
https://api.changenow.io/v2/fiat-estimate?from_currency=&from_network=&from_amount=&to_currency=&to_network=&deposit_type=&payout_type=
GET
MarketInfo
https://api.changenow.io/v2/fiat-market-info/min-max-range/{fromto}
GET
Fiat helthcheck service
https://api.changenow.io/v2/fiat-status
GET
Fiat currencies
https://api.changenow.io/v2/fiat-currencies/fiat
GET
Crypto currencies
https://api.changenow.io/v2/fiat-currencies/crypto
 */

describe('ChangeNow cryptocurrency API integration', async function() {
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
            this.timeout(5000)
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
                expect(response).to.include.keys(
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
                expect(response).to.include.keys(
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
                expect(response).to.include.keys(
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
    

    describe('get minimal exchange amount using standard rate', function(done) {
        this.timeout(5000)
        it('should return a JSON object describing the minimum exchange amount between a specified fromCurrency and a toCurrency', () => {
            return instance.getExchangeRange('xmr', 'btc', 'standard').then(response => {

                expect(response).to.include.keys(
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

    describe('get minimal exchange amount using fixed rate', function(done) {
        this.timeout(5000)
        it('should return a JSON object describing the minimum exchange amount between a specified fromCurrency and a toCurrency', () => {
            return instance.getExchangeRange('xmr', 'btc', 'fixed-rate').then(response => {

                expect(response).to.include.keys(
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

    describe('get current exchange range for currency using standard rate', function(done) {
        this.timeout(5000)
        it('should return a JSON object describing the current exchange rate between a specified fromCurrency and a toCurrency', () => {
            return instance.getExchangeRange('xmr', 'btc', 'standard').then(response => {
                expect(response).to.include.keys(
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

    describe('get current exchange range for currency using fixed rate', function(done) {
        this.timeout(5000)
        it('should return a JSON object describing the current exchange rate between a specified fromCurrency and a toCurrency', () => {
            return instance.getExchangeRange('xmr', 'btc', 'fixed-rate').then(response => {
                expect(response).to.include.keys(
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
