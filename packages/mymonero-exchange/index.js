const axios = require("axios");
//const fetch = require("fetch");
class ExchangeFunctions {

    constructor() {
        this.apiUrl = "https://api.mymonero.com:443/cx";
        // this.apiVersion = "v3";
        // this.currencyToExchange = "xmr2btc";
        this.offer = {};
        this.offer_type = "";
        this.order = {};
        this.orderRefreshTimer = {};
        this.currentRates = {};
        this.orderStatus = {};
        this.exchangeConfiguration = {};
        //this.fetch = fetch;
    }

    initialiseExchangeConfiguration() {
        let self = this;
        // When the new endpoint goes live, we'll uncomment the flow below
        return new Promise((resolve, reject) => {
             let endpoint = `${self.apiUrl}/get_exchange_configuration`;
             axios.get(endpoint)
                .then((response) => {
                    self.exchangeConfiguration = response;
                    resolve(response);
                }).catch((error) => {
                    console.log("Unable to retrieve exchange configuration -- assume defaults");
                    let data = {
                        "referrer_info": {
                            "indacoin": {
                                "referrer_id": "MYM12314",
                                "enabled": false
                            }, 
                            "localmonero": {
                                "referrer_id": "h2t1",
                                "enabled": true
                            }
                        },
                        "btc": {
                            "changenow": {
                                "exchange_workflow": "prepopulates_limits"
                            },
                            "xmrto": {
                                "exchange_workflow": "prepopulate_limits",
                            },
                            "coinswitch": {
                                "exchange_workflow": "returns_limits_on_offer"
                            }
                        },
                        "eth": {
                            "changenow": {
                                "exchange_workflow": "prepopulates_limits",
                            },
                            "coinswitch": {
                                "exchange_workflow": "returns_limits_on_offer"
                            }
                        },
                }
                resolve(data);
                    reject(error);
                })
        

            // For now, here's our dummy data
            
        });
    }

    getOfferWithOutAmount(in_currency, out_currency, out_amount) {
        let data = {
            in_currency,
            out_currency,
            out_amount
        }
            
        const self = this;
        self.offer_type = "out_amount";
        let endpoint = `${self.apiUrl}/get_offer`;
        return new Promise((resolve, reject) => {

            //sample response
            // {
            // 	"offer_id": "d604-2-101",
            // 	"expires_at": "2024-11-24T20:37:46.328Z",
            // 	"in_amount": "60.75456303",
            // 	"out_amount": "0.1"
            // }

            axios.post(endpoint, data)
                .then(function (response) {
                    console.log('response from MyMonero for getOfferWithOutAmount', response);
                    self.offer = response.data;
                    self.offer.out_amount = out_amount;
                    resolve(self.offer);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    }

    getOfferWithInAmount(in_currency, out_currency, in_amount) {
        let data = {
            in_amount,
            in_currency,
            out_currency
        }

        const self = this;
        self.offer_type = "in_amount";
        let endpoint = `${self.apiUrl}/get_offer`;
        return new Promise((resolve, reject) => {

            //sample response
            // {
            // 	"offer_id": "d604-1-lZDUeP+JpbSTxZ8gOCHLwR7WL8ETr1Jbkji7NqVlFVXusF4oQ+e/3uL8/2jL2dfoCqjTf2X9NIrBg4QrrB2XHh9XmlLEL6i1IR9B72qDnZ0Dzamr9AlMJDcm4cxfxDA8BzYN8x2n7BjT+dZgUJszBVivKZwpHMaPWAVUso11QIda/0I/o2NsjjRGoolJ/46tVncCOJGi6PhO9H4qPwSHkg==",
            // 	"expires_at": "2024-11-24T20:35:43.541Z",
            // 	"in_amount": "1",
            // 	"out_amount": "0.00162612"
            // }

            axios.post(endpoint, data)
                .then(function (response) {
                    console.log('response from MyMonero for getOfferwithtinamount', response);
                    self.offer = response.data;
                    resolve(self.offer);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    }
    
    getOffer(in_currency, out_currency, amount, offerType) {
        return new Promise((resolve, reject) => {
            if (offerType == "in") {
                this.getOfferWithInAmount(in_currency, out_currency, amount).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            } else if (offerType == "out") {
                this.getOfferWithOutAmount(in_currency, out_currency, amount).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            } else {
                // TODO: Handle error a bit more elegantly
                let error = new Error("Please ensure you have specified an amount to exchange");
                console.log(error);
                reject(error);
            }
        })
        // let data = {
        //     in_amount,
        //     in_currency,
        //     out_currency
        // }

        // const self = this;
        // self.offer_type = "in_amount";
        // let endpoint = `${self.apiUrl}/get_offer`;
        //     axios.post(endpoint, data)
        //         .then(function (response) {
        //             console.log('resp from getOfferwithtinamount', response);
        //             self.offer = response.data;
        //             resolve(self.offer);
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //             reject(error);
        //         });
        // });
    }
    

    
    getOrderStatus() {
        const self = this;

        let endpoint = `${self.apiUrl}/order_status`;
        return new Promise((resolve, reject) => {

            // sample response
            // {
            // 	"order_id": "d604-662e2c5f78f8b2",
            // 	"expires_at": "2024-11-24T21:52:15.460Z",
            // 	"in_address": "8B96tmezmMhWVwUdaYe87oY9y7SP3YXND3HmGYZKACyYFJYh9wG4LaVKCzWrpQmUvHYQZxmsUERJaidhtRSRFKMmUQVQ7zm",
            // 	"in_currency": "XMR",
            // 	"in_amount": "0.5",
            // 	"out_currency": "BTC",
            // 	"out_amount": "0.00079765",
            // 	"status": "NEW",
            // 	"in_amount_remaining": "0.5",
            // 	"out_address": "bc1pp83964w2q3nun33gd79gg54n3zfudmfzn6ar4spk8g9dc86mtv3s6me7lq",
            // 	"provider_name": "ChangeNOW",
            // 	"provider_url": "https://support.changenow.io",
            // 	"provider_order_id": "662e2c5f78f8b2"
            // }

            let data = {
                "order_id": self.order.data.order_id
            }
            axios.post(endpoint, data)
                .then(function (response) {
                    self.orderStatus = response.data;
                    resolve(self.orderStatus);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    }

    getOrderExpiry() {
        return this.orderStatus.expires_at;
    }

    getTimeRemaining() {
        return this.orderStatus.seconds_till_timeout;
    }

    createOrder(out_address, refund_address, in_currency = "XMR", out_currency = "BTC") {

        let self = this;
        let endpoint = `${self.apiUrl}/create_order`;
        let data = {
            out_address,
            refund_address,
            in_currency,
            out_currency,
            ...self.offer
        }

        delete data.expires_at;
        if (self.offer_type == "out_amount") {
            delete data.in_amount;
        } else if (self.offer_type == "in_amount") {
            delete data.out_amount;
        }
        return new Promise((resolve, reject) => {

            // sample response
            // {
            // 	"order_id": "d604-662e2c5f78f8b2",
            // 	"expires_at": "2024-11-24T21:52:15.460Z",
            // 	"in_address": "8B96tmezmMhWVwUdaYe87oY9y7SP3YXND3HmGYZKACyYFJYh9wG4LaVKCzWrpQmUvHYQZxmsUERJaidhtRSRFKMmUQVQ7zm",
            // 	"in_currency": "XMR",
            // 	"in_amount": "0.1",
            // 	"out_currency": "BTC",
            // 	"out_amount": "0.00079765"
            // }

            try {
                axios.post(endpoint, data)
                    .then(function (response) {
                        self.order = response;
                        resolve(response);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    }


    getRatesAndLimits(in_currency, out_currency) {
        let self = this;
        return new Promise((resolve, reject) => {
            let data = {
                "in_currency": "XMR",
                "out_currency": "BTC"
            }
            let endpoint = `${self.apiUrl}/get_info`;
            axios.post(endpoint, data)
                .then((response) => {
                    self.currentRates = response.data;
                    self.in_currency = "XMR";
                    self.out_currency = "BTC";
                    self.currentRates.minimum_xmr = self.currentRates.in_min;
                    self.currentRates.maximum_xmr = self.currentRates.in_max;
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        });
    }

    getCurrencyPairs(in_currency = "XMR") {
        let self = this;
        return new Promise((resolve, reject) => {
            let data = {
                "in_currency": in_currency
            }
            let endpoint = `${self.apiUrl}/get_pairs`;
            axios.post(endpoint, data)
                .then((response) => {
                    self.enabledCurrencies = response.data.out_currencies;
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }

}

module.exports = ExchangeFunctions;
