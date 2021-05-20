const axios = require("axios");
const apiKey = require("./apiKey");

class ChangeNowIntegration {

    constructor() {
        this.apiUrl = "https://api.changenow.io";
        this.apiVersion = "v2";
        // this.currencyToExchange = "xmr2btc";
        this.apiKey = apiKey.key;
    }

    // For listing whether XMR is available via the fixed flow method

    // Requires an API key
    // Works
    retrieveFixedFlowParameters(options) {
        // Expect json string
        var axios = require('axios');

        var config = {
            method: 'get',
            url: `${this.getApiPath()}exchange/currencies?active=true&flow=fixed-rate`,
            headers: {
                'x-changenow-api-key': `${this.apiKey}`
            }
        };
        return new Promise((resolve, reject) => {
            axios(config)
                .then(function (response) {
                    console.log("then");
                    let newArr = response.data.filter(responseObj => {
                        if (responseObj.ticker == 'xmr') {
                            return true
                        }
                    })
                    resolve(newArr);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    }

    getApiPath() {
        console.log(this);
        return `${this.apiUrl}/${this.apiVersion}/`
    }

    // For listing whether XMR is available via the standard flow method
    // Works
    retrieveStandardFlowParameters(options) {
        // Expect json string
        var axios = require('axios');
        var url = `${this.getApiPath()}exchange/currencies?active=true&flow=standard`
        var config = {
            method: 'get',
            url: url,
            headers: { }
        };
        return new Promise((resolve, reject) => {
            axios(config)
                .then(function (response) {
                    //console.log("then");
                    //console.log(JSON.stringify(response.data));
                    //console.log(response.data);
                    //console.log(typeof(response.data));
                    //console.log(response.data);
                    let newArr = response.data.filter(responseObj => {
                        if (responseObj.ticker == 'xmr') {
                            return true
                        }
                    })
                    //console.log("newArr:", newArr);
                    //resolve("wtf?");
                    resolve(newArr);
                    
                    // let jsonObject = JSON.parse(response.data);
                    // console.log(jsonObject[0]);
                    // //console.log(JSON.stringify(response.data));
                    // return JSON.stringify(response.data);
                })
                .catch(function (error) {
                    console.log("error");
                    reject(error);
                });
        })
    }

    // Minimal exchange amount
    // Might require API key for fixed rates
    getMinimalExchangeAmount(fromCurrency, toCurrency, flow) {
        return new Promise((resolve, reject) => {
            var axios = require('axios');
            //url: `${this.getApiPath()}exchange/min-amount?fromCurrency=btc&toCurrency=usdt&fromNetwork=btc&toNetwork=eth&flow=standard`,
            var config = {
                method: 'get',
                url: `${this.getApiPath()}exchange/min-amount`,
                params: {
                    fromCurrency,
                    toCurrency,
                    flow
                },
                headers: { 
                    'x-changenow-api-key': ''
                }
            };
            console.log(config);
            axios(config).then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
        })
    }

    // This API endpoint returns estimated exchange amount for the exchange and some additional fields. Accepts to and from currencies, currencies' networks, exchange flow, and RateID.
    getExchangeRange(fromCurrency, toCurrency) {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            var config = {
                method: 'get',
                url: `${this.getApiPath()}exchange/range`,
                params: {
                    fromCurrency,
                    toCurrency,
                    flow
                },
                headers: { 
                    'x-changenow-api-key': 'your_api_key'
                }
            };
            
            axios(config).then(function (response) {
                console.log(JSON.stringify(response.data));
            }).catch(function (error) {
                console.log(error);
            });
        })
    }

    // This API endpoint returns estimated exchange amount for the exchange and some additional fields. Accepts to and from currencies, currencies' networks, exchange flow, and RateID.
    getEstimatedAmount(fromCurrency, toCurrency, flow, fromAmount, toAmount) {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            let params = {
                fromCurrency,
                toCurrency,
                fromAmount,
                toAmount,
                flow,
                type: "direct"
            }

            if (flow == 'fixed-rate') {
                params.useRateId = true
            }

            var config = {
                method: 'get',
                url: `${this.getApiPath()}exchange/estimated-amount`,
                params,
                headers: { 
                    'x-changenow-api-key': this.apiKey
                }
            };
            
            axios(config).then(function (response) {                
                if (response.data.result == true) {
                    resolve(response.data);
                } else {
                    reject(response.data);
                }
            })
            .catch(function (error) {
                reject(error)
            });
        })
    }

    // 
    // Create offer
    createOfferWithFromAmount(fromCurrency, toCurrency, flow, fromAmount, refundAddress) {
        return new Promise((resolve, reject) => {
            var axios = require('axios');
            /*
            
                "toAmount": "",
                "address": "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
                "extraId": "",
                "refundAddress": "",
                "refundExtraId": "",
                "userId": "",
                "payload": "",
                "contactEmail": "",
                "source": "",
                "type": "direct",
                "rateId": ""
            
            */
            var data = JSON.stringify({
                fromCurrency,
                toCurrency,
                flow,
                fromAmount,
                type: "direct"
            });
    
            var config = {
                method: 'post',
                url: `${this.getApiPath()}exchange`,
                headers: { 
                    'Content-Type': 'application/json', 
                    'x-changenow-api-key': `${this.apiKey}`
                },
                data : data
            };

            console.log("Payload for creating offer");
            console.log(data)

            /* Returned data
            
                "fromAmount": 0.1,
                "toAmount": 1506.8727381,
                "flow": "standard",
                "type": "direct",
                "payinAddress": "3A1bd7a4y6gpjpxSVGgmHFmVwngouKDfeL",
                "payoutAddress": "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
                "payoutExtraId": "",
                "fromCurrency": "btc",
                "toCurrency": "usdt",
                "refundAddress": "",
                "refundExtraId": "",
                "id": "a88c9de3e1b0bd",
                "fromNetwork": "btc",
                "toNetwork": "eth"
            
            */
            // axios(config)
            // .then(function (response) {
            //     console.log(JSON.stringify(response.data));
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });
        })
    }

    // get transaction status
    getTransactionStatus(txId) {
        return new Promise((resolve, reject) => {
            var axios = require('axios');

            var config = {
                method: 'get',
                url: `${this.getApiPath()}exchange/by-id?id=716bcd0e10728c`,
                headers: { 
                    'x-changenow-api-key': `${this.apiKey}`
                }
            };

            axios(config).then(function (response) {
                console.log(JSON.stringify(response.data));
            }).catch(function (error) {
                console.log(error);
            });
        })
    }

    // Tested, working
    validateAddress(currencyTickerCode, address) {
        return new Promise((resolve, reject) => {
            console.log("Running validate address");
            var axios = require('axios');
            var config = {
                method: 'get',
                url: `${this.getApiPath()}validate/address`,
                params: {
                    currency: currencyTickerCode,
                    address
                },
                headers: { }
            };

            axios(config).then(function (response) {                
                if (response.data.result == true) {
                    resolve(response.data);
                } else {
                    reject(response.data);
                }
            })
            .catch(function (error) {
                reject(error)
            });
        })
    }

    // {
    //     "ticker": "xmr",
    //     "name": "Monero",
    //     "image": "https://changenow.io/images/sprite/currencies/xmr.svg",
    //     "hasExternalId": false,
    //     "isFiat": false,
    //     "featured": true,
    //     "isStable": false,
    //     "supportsFixedRate": true,
    //     "network": "xmr",
    //     "tokenContract": null,
    //     "buy": true,
    //     "sell": true
    // },

    // getMinAmount(fromCurrency, toCurrency, flow = standard) {

    // }

    // initialiseExchangeConfiguration() {
    //     let self = this;
    //     // When the new endpoint goes live, we'll uncomment the flow below
    //     return new Promise((resolve, reject) => {
    //          let endpoint = `${self.apiUrl}/get_exchange_configuration`;
    //          axios.get(endpoint)
    //             .then((response) => {
    //                 self.exchangeConfiguration = response;
    //                 resolve(response);
    //             }).catch((error) => {
    //                 console.log("Unable to retrieve exchange configuration -- assume defaults");
    //                 let data = {
    //                     "referrer_info": {
    //                         "indacoin": {
    //                             "referrer_id": "MYM12314",
    //                             "enabled": false
    //                         }, 
    //                         "localmonero": {
    //                             "referrer_id": "h2t1",
    //                             "enabled": true
    //                         }
    //                     },
    //                     "btc": {
    //                         "changenow": {
    //                             "exchange_workflow": "prepopulates_limits"
    //                         },
    //                         "xmrto": {
    //                             "exchange_workflow": "prepopulate_limits",
    //                         },
    //                         "coinswitch": {
    //                             "exchange_workflow": "returns_limits_on_offer"
    //                         }
    //                     },
    //                     "eth": {
    //                         "changenow": {
    //                             "exchange_workflow": "prepopulates_limits",
    //                         },
    //                         "coinswitch": {
    //                             "exchange_workflow": "returns_limits_on_offer"
    //                         }
    //                     },
    //             }
    //             resolve(data);
    //                 reject(error);
    //             })
        

    //         // For now, here's our dummy data
            
    //     });
    // }

    // getOfferWithOutAmount(in_currency, out_currency, out_amount) {
    //     let data = {
    //         in_currency,
    //         out_currency,
    //         out_amount
    //     }
            
    //     const self = this;
    //     self.offer_type = "out_amount";
    //     let endpoint = `${self.apiUrl}/get_offer`;
    //     return new Promise((resolve, reject) => {
    //         axios.post(endpoint, data)
    //             .then(function (response) {
    //                 console.log('outAmount', response);
    //                 self.offer = response.data;
    //                 self.offer.out_amount = out_amount;
    //                 resolve(self.offer);
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //                 reject(error);
    //             });
    //     });
    // }

    // getOfferWithInAmount(in_currency, out_currency, in_amount) {
    //     let data = {
    //         in_amount,
    //         in_currency,
    //         out_currency
    //     }

    //     const self = this;
    //     self.offer_type = "in_amount";
    //     let endpoint = `${self.apiUrl}/get_offer`;
    //     return new Promise((resolve, reject) => {
    //         axios.post(endpoint, data)
    //             .then(function (response) {
    //                 console.log('resp from getOfferwithtinamount', response);
    //                 self.offer = response.data;
    //                 resolve(self.offer);
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //                 reject(error);
    //             });
    //     });
    // }
    

    
    // getOrderStatus() {
    //     const self = this;

    //     let endpoint = `${self.apiUrl}/order_status`;
    //     return new Promise((resolve, reject) => {
    //         let data = {
    //             "order_id": self.order.data.order_id
    //         }
    //         axios.post(endpoint, data)
    //             .then(function (response) {
    //                 self.orderStatus = response.data;
    //                 resolve(self.orderStatus);
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //                 reject(error);
    //             });
    //     });
    // }

    // getOrderExpiry() {
    //     return this.orderStatus.expires_at;
    // }

    // getTimeRemaining() {
    //     return this.orderStatus.seconds_till_timeout;
    // }

    // createOrder(out_address, refund_address) {

    //     let self = this;
    //     let endpoint = `${self.apiUrl}/create_order`;
    //     let data = {
    //         out_address,
    //         refund_address,
    //         in_currency: "XMR",
    //         out_currency: "BTC",
    //         ...self.offer
    //     }

    //     delete data.expires_at;
    //     if (self.offer_type == "out_amount") {
    //         delete data.in_amount;
    //     } else if (self.offer_type == "in_amount") {
    //         delete data.out_amount;
    //     }
    //     console.log(data);
    //     return new Promise((resolve, reject) => {
    //         try {
    //             axios.post(endpoint, data)
    //                 .then(function (response) {
    //                     self.order = response;
    //                     resolve(response);
    //                 })
    //                 .catch(function (error) {
    //                     reject(error);
    //                 });
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // }


    // getRatesAndLimits(in_currency, out_currency) {
    //     let self = this;
    //     return new Promise((resolve, reject) => {
    //         let data = {
    //             "in_currency": "XMR",
    //             "out_currency": "BTC"
    //         }
    //         let endpoint = `${self.apiUrl}/get_info`;
    //         axios.post(endpoint, data)
    //             .then((response) => {
    //                 self.currentRates = response.data;
    //                 self.in_currency = "XMR";
    //                 self.out_currency = "BTC";
    //                 self.currentRates.minimum_xmr = self.currentRates.in_min;
    //                 self.currentRates.maximum_xmr = self.currentRates.in_max;
    //                 resolve(response);
    //             }).catch((error) => {
    //                 reject(error);
    //             })
    //     });
    // }

}

module.exports = ChangeNowIntegration;

