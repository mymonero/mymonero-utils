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
    constructor() {
        this.apiUrl = "https://api.changenow.io";
        this.apiVersion = "v2";
        // this.currencyToExchange = "xmr2btc";
        this.apiKey = apiKey;
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
                    'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
            };

            axios(config).then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
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
                    'x-changenow-api-key': `${this.apiKey}`,
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
                    'x-changenow-api-key': `${this.apiKey}`,
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
                    'x-changenow-api-key': `${this.apiKey}`,
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
                    'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
            };
            
            axios(config).then(function (response) {                
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error)
            });
        })
    }

    getTransactionEstimate(from_amount, from_currency, to_currency) {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            let params = {
                from_amount,
                from_currency,
                to_currency
            }

            var config = {
                method: 'get',
                url: `${this.getApiPath()}fiat-estimate`,
                params,
                headers: { 
                    'Content-Type': 'application/json', 
                    'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
            };
            
            axios(config).then(function (response) {                
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error)
            });
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
                "deposit_type": "SEPA_1",
                "payout_type": "SEPA_1",
                "external_partner_link_id": ""
            });

            var config = {
                method: 'post',
                url: 'https://api.changenow.io/v2//fiat-transaction',
                headers: { 
                    'Content-Type': 'application/json', 
                    'x-changenow-api-key': `${this.apiKey}`,
                    'x-api-key': `${this.apiKey}`
                },
                data : data
            };

            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
            .catch(function (error) {
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
            //     .catch(function (error) {
            //         console.log(data);
            //         console.log(error);
            //         //reject(error);
            //     });
            // })
        })
    }
}
// class CryptoAPI {

//     constructor() {
//         this.apiUrl = "https://api.changenow.io";
//         this.apiVersion = "v2";
//         // this.currencyToExchange = "xmr2btc";
//         this.apiKey = apiKey;
//     }

//     /* 
//     For listing whether XMR is available via the fixed flow method
//     While it may seem counter-intuitive, we have two different methods because though each will return an "XMR" object that will always have supportsFixedRate == true, 
//     fixed-rate may be disabled in cases where ChangeNow has server issues
//     */
//     getFixedFlowCurrencies() {
//         return new Promise((resolve, reject) => {
//             var config = {
//                 method: 'get',
//                 url: `${this.getApiPath()}exchange/currencies?active=true&flow=fixed-rate`,
//                 headers: {
//                     'x-changenow-api-key': `${this.apiKey}`
//                 }
//             };

//             axios(config)
//                 .then(function (response) {
//                     resolve(response.data);
//                 })
//                 .catch(function (error) {
//                     reject(error);
//                 });
//         })
//     }

//     getStandardFlowCurrencies() {
//         return new Promise((resolve, reject) => {
//             var config = {
//                 method: 'get',
//                 url: `${this.getApiPath()}exchange/currencies?active=true&flow=standard`,
//                 headers: {
//                     'x-changenow-api-key': `${this.apiKey}`
//                 }
//             };

//             axios(config)
//                 .then(function (response) {
//                     resolve(response.data);
//                 })
//                 .catch(function (error) {
//                     reject(error);
//                 });
//         })
//     }

//     // returns a single Monero-specific currency object when passed input from retrieveFixedFlowParameters or retrieveStandardFlowParameters
//     filterMoneroCurrencyData(arrayToFilter) {
//         try {
//             let newArr = arrayToFilter.filter(arrayToFilter => {
//                 if (arrayToFilter.ticker == 'xmr') {
//                     return true
//                 }
//             })
//             return newArr;
//         } catch (Error) {
//             throw Error;
//         }
//     }

//     // Requires an API key
//     // Works
//     async retrieveFilteredMoneroCurrencyData(arrayToFilter) {
//         // Expect json string
//         var axios = require('axios');
//         console.log(this);
//         try {
//             console.log("Attempting to retrieve parameters");
//             const parameters = await Promise.allSettled([this.getFixedFlowCurrencies(), this.getStandardFlowParameters()])
//             let parameterObj = {}
//             if (parameters[0].status == "fulfilled") {
//                 parameterObj.fixedRateParameters = this.filterMoneroCurrencyData(parameters[0].value);
//             }
//             if (parameters[1].status == "fulfilled") {
//                 parameterObj.standardRateParameters = this.filterMoneroCurrencyData(parameters[1].value);
//             }
//             console.log(parameterObj);
//             //let arrayToFilter = await this.getFixedFlowCurrencies();
//             return parameterObj;
//         } catch (error) {
//             throw error;
//         }

//         // return new Promise((resolve, reject) => {
//         //     let arrayToFilter = await this.getFixedFlowCurrencies();

//         //     let newArr = arrayToFilter.filter(responseObj => {
//         //         if (responseObj.ticker == 'xmr') {
//         //             return true
//         //         }
//         //     })

//         //     resolve(newArr);

//         //     // axios(config)
//         //     //     .then(function (response) {
//         //     //         console.log("then");
//         //     //         let newArr = response.data.filter(responseObj => {
//         //     //             if (responseObj.ticker == 'xmr') {
//         //     //                 return true
//         //     //             }
//         //     //         })
//         //     //         resolve(newArr);
//         //     //     })
//         //     //     .catch(function (error) {
//         //     //         reject(error);
//         //     //     });
//         // })
//     }

//     getApiPath() {
//         console.log(this);
//         return `${this.apiUrl}/${this.apiVersion}/`
//     }

//     // For listing whether XMR is available via the standard flow method
//     // Works
//     getStandardFlowParameters() {
//         // Expect json string
//         var axios = require('axios');
//         var url = `${this.getApiPath()}exchange/currencies?active=true&flow=standard`
//         var config = {
//             method: 'get',
//             url: url,
//             headers: { }
//         };
//         return new Promise((resolve, reject) => {
//             axios(config)
//                 .then(function (response) {
//                     //console.log("then");
//                     //console.log(JSON.stringify(response.data));
//                     //console.log(response.data);
//                     //console.log(typeof(response.data));
//                     //console.log(response.data);
//                     let newArr = response.data.filter(responseObj => {
//                         if (responseObj.ticker == 'xmr') {
//                             return true
//                         }
//                     })
//                     //console.log("newArr:", newArr);
//                     //resolve("wtf?");
//                     resolve(newArr);
                    
//                     // let jsonObject = JSON.parse(response.data);
//                     // console.log(jsonObject[0]);
//                     // //console.log(JSON.stringify(response.data));
//                     // return JSON.stringify(response.data);
//                 })
//                 .catch(function (error) {
//                     console.log("error");
//                     reject(error);
//                 });
//         })
//     }

//     // Minimal exchange amount
//     // Might require API key for fixed rates
//     getMinimalExchangeAmount(fromCurrency, toCurrency, flow) {
//         return new Promise((resolve, reject) => {
//             var axios = require('axios');
//             //url: `${this.getApiPath()}exchange/min-amount?fromCurrency=btc&toCurrency=usdt&fromNetwork=btc&toNetwork=eth&flow=standard`,
//             var config = {
//                 method: 'get',
//                 url: `${this.getApiPath()}exchange/min-amount`,
//                 params: {
//                     fromCurrency,
//                     fromNetwork: "",
//                     toCurrency,
//                     toNetwork: "",
//                     flow
//                 },
//                 headers: { 
//                     'x-changenow-api-key': `${this.apiKey}`
//                 }
//             };
//             console.log(config);
//             axios(config).then(function (response) {
//                 resolve(response.data);
//             })
//             .catch(function (error) {
//                 console.log(error);
//                 reject(error)
//             });
//         })
//     }

//     // This API endpoint returns estimated exchange amount for the exchange and some additional fields. Accepts to and from currencies, currencies' networks, exchange flow, and RateID.
//     getExchangeRange(fromCurrency, toCurrency, flow) {
//         return new Promise((resolve, reject) => {
//             var axios = require('axios');

//             var config = {
//                 method: 'get',
//                 url: `${this.getApiPath()}exchange/range`,
//                 params: {
//                     fromCurrency,
//                     toCurrency,
//                     flow
//                 },
//                 headers: { 
//                     'x-changenow-api-key': `${this.apiKey}`
//                 }
//             };
            
//             axios(config).then(function (response) {
//                 console.log(response);
//                 resolve(response.data);
//             })
//             .catch(function (error) {
//                 reject(error)
//             });
//         })
//     }

//     // This API endpoint returns estimated exchange amount for the exchange and some additional fields. Accepts to and from currencies, currencies' networks, exchange flow, and RateID.
//     // While this works for xmr -> btc, I've seen that in certain cases, the request would fail for something like usdt if a network isn't specified for usdt
//     getEstimatedAmount(fromCurrency, toCurrency, flow, fromAmount, toAmount) {
//         return new Promise((resolve, reject) => {
//             var axios = require('axios');

//             let params = {
//                 fromCurrency,
//                 toCurrency,
//                 fromAmount,
//                 toAmount,
//                 flow,
//                 type: "direct"
//             }

//             if (flow == 'fixed-rate') {
//                 params.useRateId = true
//             }

//             var config = {
//                 method: 'get',
//                 url: `${this.getApiPath()}exchange/estimated-amount`,
//                 params,
//                 headers: { 
//                     'x-changenow-api-key': this.apiKey
//                 }
//             };
            
//             axios(config).then(function (response) {                
//                 resolve(response.data);
//             })
//             .catch(function (error) {
//                 reject(error)
//             });
//         })
//     }

//     // 
//     // Create offer
//     // type should be 'reverse' for a fixed toAmount -- say we want 0.3 BTC, we'd set the toAmount to 0.3, and the type to "reverse"
//     createTransaction(fromCurrency, toCurrency, flow, fromAmount, toAmount, address, refundAddress, type = "direct") {
//         return new Promise((resolve, reject) => {
//             var axios = require('axios');
//             /*
            
//                 "toAmount": "",
//                 "address": "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
//                 "extraId": "",
//                 "refundAddress": "",
//                 "refundExtraId": "",
//                 "userId": "",
//                 "payload": "",
//                 "contactEmail": "",
//                 "source": "",
//                 "type": "direct",
//                 "rateId": ""
            
//             */
//             var data = JSON.stringify({
//                 fromCurrency,
//                 toCurrency,
//                 flow,
//                 fromAmount,
//                 toAmount,
//                 type,
//                 address,
//                 refundAddress
//             });
    
//             var config = {
//                 method: 'post',
//                 url: `${this.getApiPath()}exchange`,
//                 headers: { 
//                     'Content-Type': 'application/json', 
//                     'x-changenow-api-key': `${this.apiKey}`
//                 },
//                 data : data
//             };

//             console.log("Payload for creating offer");
//             console.log(data)

//             axios(config).then(function (response) {                
//                 resolve(response.data);
//             })
//             .catch(function (error) {
//                 reject(error)
//             });

//             /* Returned data
            
//                 "fromAmount": 0.1,
//                 "toAmount": 1506.8727381,
//                 "flow": "standard",
//                 "type": "direct",
//                 "payinAddress": "3A1bd7a4y6gpjpxSVGgmHFmVwngouKDfeL",
//                 "payoutAddress": "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
//                 "payoutExtraId": "",
//                 "fromCurrency": "btc",
//                 "toCurrency": "usdt",
//                 "refundAddress": "",
//                 "refundExtraId": "",
//                 "id": "a88c9de3e1b0bd",
//                 "fromNetwork": "btc",
//                 "toNetwork": "eth"
            
//             */
//             // axios(config)
//             // .then(function (response) {
//             //     console.log(JSON.stringify(response.data));
//             // })
//             // .catch(function (error) {
//             //     console.log(error);
//             // });
//         })
//     }

//     // get transaction status
//     getTransactionStatus(txId) {
//         return new Promise((resolve, reject) => {
//             var axios = require('axios');

//             var config = {
//                 method: 'get',
//                 url: `${this.getApiPath()}exchange/by-id`,
//                 params: {
//                     id: txId
//                 },
//                 headers: { 
//                     'x-changenow-api-key': `${this.apiKey}`
//                 }
//             };

//             axios(config).then(function (response) {
//                 console.log(JSON.stringify(response.data));
//                 resolve(response.data);
//             }).catch(function (error) {
//                 reject(error);
//             });
//         })
//     }

//     // Tested, working
//     validateAddress(currencyTickerCode, address) {
//         return new Promise((resolve, reject) => {
//             console.log("Running validate address");
//             var axios = require('axios');
//             var config = {
//                 method: 'get',
//                 url: `${this.getApiPath()}validate/address`,
//                 params: {
//                     currency: currencyTickerCode,
//                     address
//                 },
//                 headers: { }
//             };

//             axios(config).then(function (response) {                
//                 resolve(response.data);
//             })
//             .catch(function (error) {
//                 reject(error)
//             });
//         })
//     }

//     // {
//     //     "ticker": "xmr",
//     //     "name": "Monero",
//     //     "image": "https://changenow.io/images/sprite/currencies/xmr.svg",
//     //     "hasExternalId": false,
//     //     "isFiat": false,
//     //     "featured": true,
//     //     "isStable": false,
//     //     "supportsFixedRate": true,
//     //     "network": "xmr",
//     //     "tokenContract": null,
//     //     "buy": true,
//     //     "sell": true
//     // },

//     // getMinAmount(fromCurrency, toCurrency, flow = standard) {

//     // }

//     // initialiseExchangeConfiguration() {
//     //     let self = this;
//     //     // When the new endpoint goes live, we'll uncomment the flow below
//     //     return new Promise((resolve, reject) => {
//     //          let endpoint = `${self.apiUrl}/get_exchange_configuration`;
//     //          axios.get(endpoint)
//     //             .then((response) => {
//     //                 self.exchangeConfiguration = response;
//     //                 resolve(response);
//     //             }).catch((error) => {
//     //                 console.log("Unable to retrieve exchange configuration -- assume defaults");
//     //                 let data = {
//     //                     "referrer_info": {
//     //                         "indacoin": {
//     //                             "referrer_id": "MYM12314",
//     //                             "enabled": false
//     //                         }, 
//     //                         "localmonero": {
//     //                             "referrer_id": "h2t1",
//     //                             "enabled": true
//     //                         }
//     //                     },
//     //                     "btc": {
//     //                         "changenow": {
//     //                             "exchange_workflow": "prepopulates_limits"
//     //                         },
//     //                         "xmrto": {
//     //                             "exchange_workflow": "prepopulate_limits",
//     //                         },
//     //                         "coinswitch": {
//     //                             "exchange_workflow": "returns_limits_on_offer"
//     //                         }
//     //                     },
//     //                     "eth": {
//     //                         "changenow": {
//     //                             "exchange_workflow": "prepopulates_limits",
//     //                         },
//     //                         "coinswitch": {
//     //                             "exchange_workflow": "returns_limits_on_offer"
//     //                         }
//     //                     },
//     //             }
//     //             resolve(data);
//     //                 reject(error);
//     //             })
        

//     //         // For now, here's our dummy data
            
//     //     });
//     // }

//     // getOfferWithOutAmount(in_currency, out_currency, out_amount) {
//     //     let data = {
//     //         in_currency,
//     //         out_currency,
//     //         out_amount
//     //     }
            
//     //     const self = this;
//     //     self.offer_type = "out_amount";
//     //     let endpoint = `${self.apiUrl}/get_offer`;
//     //     return new Promise((resolve, reject) => {
//     //         axios.post(endpoint, data)
//     //             .then(function (response) {
//     //                 console.log('outAmount', response);
//     //                 self.offer = response.data;
//     //                 self.offer.out_amount = out_amount;
//     //                 resolve(self.offer);
//     //             })
//     //             .catch(function (error) {
//     //                 console.log(error);
//     //                 reject(error);
//     //             });
//     //     });
//     // }

//     // getOfferWithInAmount(in_currency, out_currency, in_amount) {
//     //     let data = {
//     //         in_amount,
//     //         in_currency,
//     //         out_currency
//     //     }

//     //     const self = this;
//     //     self.offer_type = "in_amount";
//     //     let endpoint = `${self.apiUrl}/get_offer`;
//     //     return new Promise((resolve, reject) => {
//     //         axios.post(endpoint, data)
//     //             .then(function (response) {
//     //                 console.log('resp from getOfferwithtinamount', response);
//     //                 self.offer = response.data;
//     //                 resolve(self.offer);
//     //             })
//     //             .catch(function (error) {
//     //                 console.log(error);
//     //                 reject(error);
//     //             });
//     //     });
//     // }
    

    
//     // getOrderStatus() {
//     //     const self = this;

//     //     let endpoint = `${self.apiUrl}/order_status`;
//     //     return new Promise((resolve, reject) => {
//     //         let data = {
//     //             "order_id": self.order.data.order_id
//     //         }
//     //         axios.post(endpoint, data)
//     //             .then(function (response) {
//     //                 self.orderStatus = response.data;
//     //                 resolve(self.orderStatus);
//     //             })
//     //             .catch(function (error) {
//     //                 console.log(error);
//     //                 reject(error);
//     //             });
//     //     });
//     // }

//     // getOrderExpiry() {
//     //     return this.orderStatus.expires_at;
//     // }

//     // getTimeRemaining() {
//     //     return this.orderStatus.seconds_till_timeout;
//     // }

//     // createOrder(out_address, refund_address) {

//     //     let self = this;
//     //     let endpoint = `${self.apiUrl}/create_order`;
//     //     let data = {
//     //         out_address,
//     //         refund_address,
//     //         in_currency: "XMR",
//     //         out_currency: "BTC",
//     //         ...self.offer
//     //     }

//     //     delete data.expires_at;
//     //     if (self.offer_type == "out_amount") {
//     //         delete data.in_amount;
//     //     } else if (self.offer_type == "in_amount") {
//     //         delete data.out_amount;
//     //     }
//     //     console.log(data);
//     //     return new Promise((resolve, reject) => {
//     //         try {
//     //             axios.post(endpoint, data)
//     //                 .then(function (response) {
//     //                     self.order = response;
//     //                     resolve(response);
//     //                 })
//     //                 .catch(function (error) {
//     //                     reject(error);
//     //                 });
//     //         } catch (error) {
//     //             reject(error);
//     //         }
//     //     });
//     // }


//     // getRatesAndLimits(in_currency, out_currency) {
//     //     let self = this;
//     //     return new Promise((resolve, reject) => {
//     //         let data = {
//     //             "in_currency": "XMR",
//     //             "out_currency": "BTC"
//     //         }
//     //         let endpoint = `${self.apiUrl}/get_info`;
//     //         axios.post(endpoint, data)
//     //             .then((response) => {
//     //                 self.currentRates = response.data;
//     //                 self.in_currency = "XMR";
//     //                 self.out_currency = "BTC";
//     //                 self.currentRates.minimum_xmr = self.currentRates.in_min;
//     //                 self.currentRates.maximum_xmr = self.currentRates.in_max;
//     //                 resolve(response);
//     //             }).catch((error) => {
//     //                 reject(error);
//     //             })
//     //     });
//     // }

// }

module.exports = FiatAPI;

