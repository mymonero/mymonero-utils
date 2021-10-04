'use strict';

const CryptoAPI = require("./CryptoAPI");
const FiatApi = require("./FiatAPI");

class ChangenowAPI {
    static get CryptoAPI() {
        return CryptoAPI;
    }
    static get FiatAPI() {
        return FiatAPI;
    }
}

module.exports = { ChangenowAPI, FiatApi, CryptoAPI };
