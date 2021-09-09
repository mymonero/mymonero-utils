const axios = require("axios");
const apiKey = require("./apiKey");


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



class FiatAPI {
    constructor(settings) {
        this.apiUrl = "https://api.changenow.io";
        this.apiVersion = "v2";
        // this.currencyToExchange = "xmr2btc";
        this.apiKey = settings.apiKey;
    }

    getApiPath() {
        console.log(this);
        return `${this.apiUrl}/${this.apiVersion}/`
    }

    // Function that gets fiat status
    getFiatAPIStatus() {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            var config = {
                method: 'get',
                url: `${this.getApiPath()}fiat-status`,
                headers: { 
                    'Content-Type': 'application/json', 
                    //'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
            };

            axios(config).then(function (response) {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        })
    }


    // Presently, we're receiving a 'Endpoint not found' message when attempting to query the status. This may be because we're using a public API key
    getTransactionStatus(id) {
        // id: 5218373135, 4771173146
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            // API key headers are duplicated because the fiat exchange expects x-api-key, while the crypto exchange expects x-changenow-api-key.
            // We don't want to run into a situation where a change to the variable name breaks compatibility, so we send both headers
            var config = {
                method: 'get',
                url: `${this.getApiPath()}/fiat-transaction/`,
                headers: { 
                    'Content-Type': 'application/json', 
                    //'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
                params: { 
                    id 
                }
            };
            
            axios(config).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        })
    }

    getAvailableFiatCurrencies() {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            // API key headers are duplicated because the fiat exchange expects x-api-key, while the crypto exchange expects x-changenow-api-key.
            // We don't want to run into a situation where a change to the variable name breaks compatibility, so we send both headers
            var config = {
                method: 'get',
                url: 'https://api.changenow.io/v2/fiat-currencies/fiat',
                headers: { 
                    'Content-Type': 'application/json', 
                    //'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
            };
            
            axios(config).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        })
    }

    getAvailableCryptocurrencies() {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            var config = {
                method: 'get',
                url: `${this.getApiPath()}fiat-currencies/crypto`,
                headers: { 
                    'Content-Type': 'application/json', 
                    //'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
            };

            axios(config).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        })
    }

 
    getMinMaxRange(fromCurrency, toCurrency) {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            let fromTo = `${fromCurrency}_${toCurrency}`

            var config = {
                method: 'get',
                url: `${this.getApiPath()}fiat-market-info/min-max-range/${fromTo}`,
                headers: { 
                    'Content-Type': 'application/json', 
                    //'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
            };
            
            axios(config).then(function (response) {                
                resolve(response.data);
            })
            .catch((error) => {
                reject(error)
            });
        })
    }

    getTransactionEstimate(from_amount, from_currency, to_currency, deposit_type = "VISA_MC1") {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            let params = {
                from_amount,
                from_currency,
                to_currency,
                deposit_type
            }

            var config = {
                method: 'get',
                url: `${this.getApiPath()}fiat-estimate`,
                params,
                headers: { 
                    'Content-Type': 'application/json', 
                    //'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
            };
            
            axios(config).then(function (response) {                
                resolve(response.data);
            })
            .catch((error) => {
                reject(error)
            });
        })
    }

    getEstimateAmount(from_amount, from_currency, to_currency, payout_address, ) {
        return new Promise((resolve, reject) => {

            /* Works --------------------------------
                        curl --location --request POST 'https://api.changenow.io/v2/fiat-transaction' \
            --header 'Content-Type: application/json' \
            --header 'x-api-key: b1c7ed0a20710e005b65e304b74dce3253cd9ac16009b57f4aa099f2707d64a9' \
            --data-raw '{
            "from_amount": 1200.24,
            "from_currency": "EUR",
            "to_currency": "XMR",
            "from_network": null,
            "to_network": null,
            "payout_address": "b1c7ed0a20710e005b65e304b74dce3253cd9ac16009b57f4aa099f2707d64a9",
            "payout_extra_id": "1",
            "deposit_type": "SEPA_1",
            "payout_type": "SEPA_1",
            "external_partner_link_id": ""
            }'

            */
            var axios = require('axios');
            var data = JSON.stringify({
                // "from_amount": 1200.24,
                // "from_currency": "EUR",
                // "to_currency": "XMR",
                // "from_network": null,
                // "to_network": null,
                // "payout_address": "47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9",
                // "payout_extra_id": "1",
                // "deposit_type": "SEPA_1",
                // "payout_type": "SEPA_1",
                // "external_partner_link_id": ""
                from_amount,
                from_currency,
                to_currency,
                payout_address,
                "from_network": null,
                "to_network": null,
                "payout_extra_id": "1",
                //"deposit_type": "SEPA_1",
                //"payout_type": "SEPA_1",
                "external_partner_link_id": ""
            });

            var config = {
                method: 'post',
                url: 'https://api.changenow.io/v2//fiat-transaction',
                headers: { 
                    'Content-Type': 'application/json', 
                    //'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
                data : data
            };

            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
            // const data = {
            //         "from_amount": 1200.24,
            //         "from_currency": "EUR",
            //         "to_currency": "BTC",
            //         "from_network": null,
            //         "to_network": null,
            //         "payout_address": "mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy",
            //         "payout_extra_id": "1",
            //         "deposit_type": "VISA_MC1",
            //         "payout_type": "",
            //         "external_partner_link_id": ""
            // }

            // let config = {
            //     method: 'post',
            //     url: `${this.getApiPath()}fiat-transaction`,
            //     headers: {
            //         'x-changenow-api-key': `${this.apiKey}`
            //     },
            //     data
            // };

            // axios(config)
            //     .then(function (response) {
            //         console.log(response);
            //         console.log(response.data);
            //         resolve(response.data);
            //     })
            //     .catch((error) => {
            //         console.log(data);
            //         console.log(error);
            //         //reject(error);
            //     });
            // })
        })
    }

    createExchangeTransaction(from_amount, from_currency, to_currency, payout_address) {
        return new Promise((resolve, reject) => {

            /* Works --------------------------------
                        curl --location --request POST 'https://api.changenow.io/v2/fiat-transaction' \
            --header 'Content-Type: application/json' \
            --header 'x-api-key: b1c7ed0a20710e005b65e304b74dce3253cd9ac16009b57f4aa099f2707d64a9' \
            --data-raw '{
            "from_amount": 1200.24,
            "from_currency": "EUR",
            "to_currency": "XMR",
            "from_network": null,
            "to_network": null,
            "payout_address": "b1c7ed0a20710e005b65e304b74dce3253cd9ac16009b57f4aa099f2707d64a9",
            "payout_extra_id": "1",
            "deposit_type": "SEPA_1",
            "payout_type": "SEPA_1",
            "external_partner_link_id": ""
            }'

            */
            var axios = require('axios');
            var data = JSON.stringify({
                // "from_amount": 1200.24,
                // "from_currency": "EUR",
                // "to_currency": "XMR",
                // "from_network": null,
                // "to_network": null,
                // "payout_address": "47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9",
                // "payout_extra_id": "1",
                // "deposit_type": "SEPA_1",
                // "payout_type": "SEPA_1",
                // "external_partner_link_id": ""
                from_amount,
                from_currency,
                to_currency,
                payout_address,
                "from_network": null,
                "to_network": null,
                "payout_extra_id": "1",
                //"deposit_type": "SEPA_1",
                //"payout_type": "SEPA_1",
                "external_partner_link_id": ""
            });

            var config = {
                method: 'post',
                url: 'https://api.changenow.io/v2//fiat-transaction',
                headers: { 
                    'Content-Type': 'application/json', 
                    //'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
                data : data
            };

            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
            // const data = {
            //         "from_amount": 1200.24,
            //         "from_currency": "EUR",
            //         "to_currency": "BTC",
            //         "from_network": null,
            //         "to_network": null,
            //         "payout_address": "mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy",
            //         "payout_extra_id": "1",
            //         "deposit_type": "VISA_MC1",
            //         "payout_type": "",
            //         "external_partner_link_id": ""
            // }

            // let config = {
            //     method: 'post',
            //     url: `${this.getApiPath()}fiat-transaction`,
            //     headers: {
            //         'x-changenow-api-key': `${this.apiKey}`
            //     },
            //     data
            // };

            // axios(config)
            //     .then(function (response) {
            //         console.log(response);
            //         console.log(response.data);
            //         resolve(response.data);
            //     })
            //     .catch((error) => {
            //         console.log(data);
            //         console.log(error);
            //         //reject(error);
            //     });
            // })
        })
    }
}

module.exports = FiatAPI;

