const { it } = require('mocha');
const FiatAPI = require('../../FiatAPI');
const expect = require("chai").expect;
var instance = new FiatAPI();

describe('ChangeNow fiat API integration', async function() {

    describe('Create a transaction to purchase Monero using fiat', () => {
        it('fiat-api: should return a JSON object containing a successful response', () => {
            let from_amount = "300";
            let from_currency = "EUR";
            let to_currency = "XMR";
            let address = "488ti8HzaWE9gyCS94YGqeJ735acPErGCWxBid5osQhJRe9pipvzrBRV4oBEVxJuLvfVZyW2J9qt1T2dB14XLejB14Kaq3o";
            return instance.createExchangeTransaction(from_amount, from_currency, to_currency, address).then(response => {
                //expect(response.result).to.equal(true)
                //expect(response.message).to.equal(null)

                console.log(response);
            })
        })
    })

    describe('Check ChangeNow API status', () => {
        it('fiat-api: should return the following JSON response: { "message": "OK" }', () => {
            this.timeout(20000);
            return instance.getFiatAPIStatus().then(response => {
                console.log(response);
                expect(response.message).to.equal("OK")
            })
        })
    })

    describe('Get a minimum-maximum range for USD -> XMR', () => {
        it('fiat-api: should return a JSON object containing an object with min, max, to and from parameters', () => {
            return instance.getMinMaxRange("USD", "XMR").then(response => {
                //expect(response.message).to.equal("OK")
                expect(response).to.include.keys(
                    "from","to","min","max"
                )
            })
        })
    })

    describe('Get an estimate for a specified exchange transaction', () => {
        this.timeout(20000);
        it('fiat-api: should return a JSON object ', () => {
            let from_amount = "100";
            let from_currency = "USD";
            let to_currency = "XMR";
            return instance.getTransactionEstimate(from_amount, from_currency, to_currency).then(response => {
                //expect(response.message).to.equal("OK")
                expect(response.to.include.keys(
                    "to_currency",
                    "from_currency",
                    "value",
                    "service_fees",
                    "estimated_exchange_rate",
                    "converted_amount",
                    "network_fee"
                ))
                              
            }).catch(error => {
                console.log(error);
                console.log(error.message);
            })
        })
    })

    describe('Get a list of supported cryptocurrencies', () => {
        it('fiat-api: should return a list of supported cryptocurrencies', () => {
            this.timeout(20000)
            return instance.getAvailableCryptocurrencies().then(response => {
                expect(response).to.be.an('array');
                expect(response[0]).to.be.an('object');
                expect(response[0]).to.include.keys("id", "ticker", "enabled")
            })
        })
    })

    describe('Get a list of supported fiat currencies', () => {
        it('fiat-api: should return a list of supported fiat currencies', () => {
            this.timeout(10000)
            return instance.getAvailableFiatCurrencies().then(response => {
                expect(response).to.be.an('array');
                expect(response[0]).to.be.an('object');
                expect(response[0]).to.include.keys("id", "ticker", "enabled")
            })
        })
    })
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
    // response = await instance.getTransactionStatus("4771173146");
    
    

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



});

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




