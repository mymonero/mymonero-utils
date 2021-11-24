// import CryptoAPI from "./CryptoAPI";
// import FiatAPI from "./FiatAPI";

class ChangenowAPI {
    constructor() {
        this.FiatAPI = new FiatAPI();
        this.CryptoAPI = new CryptoAPI();
    }
}

export { default as FiatApi } from "./FiatAPI";
export { default as CryptoApi } from "./CryptoAPI";
export default ChangenowAPI