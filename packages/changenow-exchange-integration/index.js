import CryptoAPI from "./CryptoAPI";
import FiatAPI from "./FiatAPI";

class ChangenowAPI {
    constructor() {
        this.FiatAPI = new FiatAPI();
        this.CryptoAPI = new CryptoAPI();
    }
}

module.exports = ChangenowAPI