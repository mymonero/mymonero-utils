const axios = require("axios");
const FormData = require("form-data");
//const fetch = require("fetch");
class ExchangeFunctionsMajesticBank {

    constructor() {
        this.apiUrl = "https://majesticbank.sc/api";
        this.apiVersion = "v1";
        this.referral_code = "mgzySX";

        this.offer = {}
        this.offer_type = "";
        this.order = {};
        this.orderRefreshTimer = {};
        this.currentRates = {};
        this.orderStatus = {};
        this.exchangeConfiguration = {};
    }

    getApiPath() {
        return `${this.apiUrl}/${this.apiVersion}`
    }

    initialiseExchangeConfiguration() {

        // not needed for MB
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    getOfferWithOutAmount(in_currency, out_currency, out_amount) {

        // Response
        // from_currency -> string
        // from_amount -> number
        // receive_currency -> string
        // receive_amount -> number

        const self = this;
        let endpoint = `${self.getApiPath()}/calculate`;
        let data = new FormData();
        data.append('from_currency', in_currency);
        data.append('receive_currency', out_currency);
        data.append('receive_amount', out_amount);
        self.offer_type = "out_amount";

        return new Promise((resolve, reject) => {
            axios.post(endpoint, data)
                .then(function (response) {
                    console.log('response from MajesticBank getOfferWithOutAmount', response);

                    // changenow has offer_id but majesticbank does not
                    self.offer = {
                        "in_amount": parseFloat(response.data.from_amount),
                        "out_amount": parseFloat(response.data.receive_amount),
                        "expires_at": new Date(new Date().getTime() + 10 * 60000),
                    }

                    resolve(self.offer);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    }

    getOfferWithInAmount(in_currency, out_currency, in_amount) {

        // Response
        // from_currency -> string
        // from_amount -> number
        // receive_currency -> string
        // receive_amount -> number

        const self = this;
        let endpoint = `${self.getApiPath()}/calculate`;
        let data = new FormData();
        data.append('from_currency', in_currency);
        data.append('receive_currency', out_currency);
        data.append('from_amount', in_amount);
        self.offer_type = "in_amount";

        return new Promise((resolve, reject) => {
            axios.post(endpoint, data)
                .then(function (response) {
                    console.log('response from MajesticBank getOfferWithInAmount', response);

                    // changenow has offer_id but majesticbank does not
                    self.offer = {
                        "in_amount": response.data.from_amount,
                        "out_amount": response.data.receive_amount,
                        "expires_at": new Date(new Date().getTime() + 600 * 60000),
                    }

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
                // TODO (from original ChangeNow code): Handle error a bit more elegantly
                let error = new Error("Please ensure you have specified an amount to exchange");
                console.log(error);
                reject(error);
            }
        })
    }



    getOrderStatus() {

        const self = this;

        let endpoint = `${self.getApiPath()}/track`;
        return new Promise((resolve, reject) => {
            let data = new FormData();
            data.append('trx', self.order.order_id);

            axios.post(endpoint, data)
                .then(function (response) {

                    // Response:
                    // trx -> string
                    // status -> string
                    // from_currency -> string
                    // from_amount -> number
                    // receive_currency -> string
                    // receive_amount -> number
                    // address -> string
                    // received -> number
                    // confirmed -> number

                    let resolve_data = {
                        "order_id": response.data.trx,
                        "expires_at": self.order.expires_at,
                        "in_address": response.data.address,
                        "in_amount": parseFloat(response.data.from_amount),
                        "out_currency": response.data.receive_currency,
                        "out_amount": parseFloat(response.data.receive_amount),
                        "status": response.data.status,
                        "in_amount_remaining": parseFloat(response.data.from_amount) - parseFloat(response.data.received),
                        "out_address": self.order.out_address,
                        "provider_name": "MajesticBank",
                        "provider_url": "https://majesticbank.sc/track",
                        "provider_order_id": response.data.trx,
                    }

                    self.orderStatus = resolve_data
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
        let endpoint = `${self.getApiPath()}/exchange`;

        let data = new FormData()
        data.append('from_currency', in_currency);
        data.append('receive_currency', out_currency);

        data.append('receive_address', out_address);
        data.append('referral_code', self.referral_code);

        if (self.offer_type === "in_amount") {
            data.append('from_amount', self.offer.in_amount);
        }
        else if (self.offer_type === "out_amount") {
            return this.pay(out_address, refund_address, in_currency, out_currency);
        }

        return new Promise((resolve, reject) => {
            try {
                axios.post(endpoint, data)
                    .then(function (response) {
                        self.order = response;
                        // Response:
                        // trx -> string
                        // from_currency -> string
                        // from_amount -> number
                        // receive_currency -> string
                        // receive_amount -> number
                        // address -> string
                        // expiration -> number (minutes) - 600


                        self.order = {
                            "order_id": response.data.trx,
                            "in_currency": response.data.from_currency,
                            "in_amount": parseFloat(response.data.from_amount),
                            "out_currency": response.data.receive_currency,
                            "out_amount": parseFloat(response.data.receive_amount),
                            "out_address": response.data.address,
                            "expires_at": new Date(new Date().getTime() + response.data.expiration * 60000),
                            "seconds_till_timeout": parseInt(response.data.expiration) * 60
                        }

                        // expires_at
                        // seconds_till_timeout
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

    pay(out_address, refund_address, in_currency = "XMR", out_currency = "BTC"){
        // creates a fixed / pay order
        // only called from createOrder
        let self = this;
        let endpoint = `${self.getApiPath()}/pay`;

        let data = new FormData()
        data.append('from_currency', in_currency);
        data.append('receive_currency', out_currency);

        data.append('receive_address', out_address);
        data.append('referral_code', self.referral_code);

        if (self.offer_type === "out_amount") {
            data.append('receive_amount', self.offer.out_amount);
        }
        else if (self.offer_type === "in_amount") {
            // This should never happen, but in case it does we can handle it
            return this.createOrder(out_address, refund_address, in_currency, out_currency);
        }

        return new Promise((resolve, reject) => {
            try {
                axios.post(endpoint, data)
                    .then(function (response) {
                        self.order = response;
                        // Response: (identical to createOrder, except for expiration time)
                        // trx -> string
                        // from_currency -> string
                        // from_amount -> number
                        // receive_currency -> string
                        // receive_amount -> number
                        // address -> string
                        // expiration -> number (minutes) - 10


                        self.order = {
                            "order_id": response.data.trx,
                            "in_currency": response.data.from_currency,
                            "in_amount": parseFloat(response.data.from_amount),
                            "out_currency": response.data.receive_currency,
                            "out_amount": parseFloat(response.data.receive_amount),
                            "out_address": response.data.address,
                            "expires_at": new Date(new Date().getTime() + response.data.expiration * 60000),
                            "seconds_till_timeout": parseInt(response.data.expiration) * 60
                        }

                        // expires_at
                        // seconds_till_timeout
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
            axios.get(`${this.getApiPath()}/rates`)
                .then(response => {
                    // sample data
                    // { "BTC-USD": 95873.25, "BTC-XMR": 587.27871363, "BTC-LTC": 1000.43427567, "BTC-WOW": 907408.37140125, "BTC-FIRO": 66530.88804593, "BTC-BCH": 188.6681292, "XMR-USD": 159.985, "XMR-BTC": 0.00163534, "XMR-LTC": 1.66943832, "XMR-WOW": 1514.20472654, "XMR-FIRO": 111.02100037, "XMR-BCH": 0.31483308, "LTC-USD": 93.915, "LTC-BTC": 0.00095998, "LTC-XMR": 0.57528331, "LTC-WOW": 888.87418754, "LTC-FIRO": 65.17196768, "LTC-BCH": 0.18481451, "WOW-USD": 0.103543, "WOW-BTC": 1.06e-6, "WOW-XMR": 0.00063426, "WOW-LTC": 0.00108047, "WOW-FIRO": 0.07185328, "WOW-BCH": 0.00020376, "FIRO-USD": 1.412213, "FIRO-BTC": 1.444e-5, "FIRO-XMR": 0.00865062, "FIRO-LTC": 0.0147364, "FIRO-WOW": 13.36612557, "FIRO-BCH": 0.00277908, "BCH-USD": 497.995, "BCH-BTC": 0.00509042, "BCH-XMR": 3.05050536, "BCH-LTC": 5.19656178, "BCH-WOW": 4713.35676965, "BCH-FIRO": 345.58179255, "limits": { "BTC": { "min": 0.00104304, "max": 2.60760953 }, "XMR": { "min": 0.07500703, "max": 1562.64649811 }, "LTC": { "min": 0.12777512, "max": 2661.98157909 }, "WOW": { "min": 115.89387984, "max": 2414455.82994505 }, "FIRO": { "min": 8.49730175, "max": 177027.11984665 }, "BCH": { "min": 0.02409663, "max": 502.01307242 } } }
                    self.in_currency = in_currency;
                    self.out_currency = out_currency;
                    self.currentRates = response.data;
                    // access the limits in the data
                    self.currentRates.minimum_xmr = response.data["limits"][in_currency].min;
                    self.currentRates.maximum_xmr = response.data["limits"][in_currency].max;

                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getCurrencyPairs(in_currency = "XMR") {

        let self = this;
        return new Promise((resolve, reject) => {

            let currencies = [
                {
                    "name": "Bitcoin",
                    "symbol": "BTC",
                    "precision": 8
                },
                {
                    "name": "Monero",
                    "symbol": "XMR",
                    "precision": 12
                },
                {
                    "name": "Litecoin",
                    "symbol": "LTC",
                    "precision": 8
                },
                {
                    "name": "Bitcoin Cash",
                    "symbol": "BCH",
                    "precision": 8
                },
                {
                    "name": "Wownero",
                    "symbol": "WOW",
                    "precision": 12
                },
                {
                    "name": "Firo",
                    "symbol": "FIRO",
                    "precision": 8
                }
            ]

            // throw out the in_currency
            currencies = currencies.filter(currency => currency.symbol !== in_currency);

            self.enabledCurrencies = currencies;
            let out_currencies = {
                "out_currencies": currencies
            }
            resolve(out_currencies);

        });
    }

}

module.exports = ExchangeFunctionsMajesticBank;
