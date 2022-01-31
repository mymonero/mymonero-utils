// This file facilitates integration with the ChangeNow Fiat API
// Up-to-date documentation can be found here: https://documenter.getpostman.com/view/8180765/SVfTPnM8?version=latest

const axios = require("axios");

class FiatAPI {
    constructor(settings = {}) {
        this.apiUrl = "https://api.changenow.io";
        this.apiVersion = "v2";
        if (typeof(settings.apiKey) == "undefined") {
            this.apiKey = "b1c7ed0a20710e005b65e304b74dce3253cd9ac16009b57f4aa099f2707d64a9";
        } else {
            this.apiKey = settings.apiKey;
        }
    }

    getApiPath() {
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
            var config = {
                method: 'get',
                url: `${this.getApiPath()}/fiat-transaction/`,
                headers: { 
                    'Content-Type': 'application/json', 
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
            var config = {
                method: 'get',
                url: 'https://api.changenow.io/v2/fiat-currencies/fiat',
                headers: { 
                    'Content-Type': 'application/json', 
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
                to_currency
            }

            var config = {
                method: 'get',
                url: `${this.getApiPath()}fiat-estimate`,
                params,
                headers: { 
                    'Content-Type': 'application/json', 
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
            var axios = require('axios');
            var data = JSON.stringify({
                from_amount,
                from_currency,
                to_currency,
                payout_address,
                "from_network": null,
                "to_network": null
            });

            var config = {
                method: 'post',
                url: 'https://api.changenow.io/v2//fiat-transaction',
                headers: { 
                    'Content-Type': 'application/json', 
                    'x-api-key': `${this.apiKey}`
                },
                data : data
            };

            axios(config).then(function (response) {

                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        })
    }

    createExchangeTransaction(from_amount, from_currency, to_currency, payout_address) {
        return new Promise((resolve, reject) => {
            var axios = require('axios');
            var data = JSON.stringify({
                from_amount,
                from_currency,
                to_currency,
                payout_address,
                "from_network": null,
                "to_network": null,
            });

            var config = {
                method: 'post',
                url: 'https://api.changenow.io/v2//fiat-transaction',
                headers: { 
                    'Content-Type': 'application/json', 
                    'x-api-key': `${this.apiKey}`
                },
                data : data
            };

            axios(config)
            .then(function (response) {
                resolve(response.data);
            })
            .catch((error) => {                
                reject(error);
            });
        })
    }
}

module.exports = FiatAPI;

