import { html, css, LitElement } from 'lit';

// LIVE: import ExchangeNavigationController from "@mymonero/mymonero-page-templates/src/Exchange/Controllers/ExchangeNavigationController";
// testing below
import ExchangeNavigationController from "../Controllers/ExchangeNavigationController";

import { FiatApi } from "@mymonero/changenow-exchange-integration";

let fiatApi = new FiatApi({ apiKey: "b1c7ed0a20710e005b65e304b74dce3253cd9ac16009b57f4aa099f2707d64a9" })

// Legacy imports for fixed rate exchange
const Utils = require("../Utils/ExchangeUtilityFunctions")
const ExchangeUtils = require("../Utils/ExchangeUtilityFunctions")

// **** Move out into exchange helper ****

export class MajesticBankFloatingRateView extends ExchangeNavigationController(LitElement) {
    static get styles() {
        return css`
        #orderStatusPage .textInput {
            width: auto !important;
            display: block;
        }
        .orderDetailPanel {
            right: 0px;
            left: auto;
        }
        .clock-row {
            display: block;
            
        }
        #majesticbank-buy-with-fiat {
            margin: 20px;
        }
        .submit-button-wrapper {
            position: fixed;
            top: -45px;
            right: 16px;
            width: 15%;
            min-width: 41px;
            height: 41px;
            z-index: 12;
        }
        .submit-button {
            z-index: 13;
            position: fixed;
            right: 16px;
            font-weight: bold;
            top: -40px;
            z-index: 10000;
        }
        .exchange-screen-panel {
            margin: 15px;
        }
        .submit-button, .confirmation-button {
            cursor: default;
            border-radius: 3px;
            height: 24px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            text-align: center;
            border: none;
            text-decoration: none;
            line-height: 24px;
            box-sizing: border-box;
            width: auto;
            padding: 0px 8px;
            background-color: rgb(0, 198, 255);
            box-shadow: rgb(22 20 22) 0px 0.5px 1px 0px, rgb(255 255 255 / 20%) 0px 0.5px 0px 0px inset;
            color: rgb(22, 20, 22);
            -webkit-font-smoothing: subpixel-antialiased;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.5px;
            float: right;
            margin-top: 5px;
            -webkit-app-region: no-drag;
        }
        
        .hidden {
            display: none !important;
        }
        .form-field-title {
            max-width: 100%;
            margin: 15px 0 8px 0;
            user-select: none;
            display: block;
            text-align: left;
            color: #F8F7F8;
            font-family: Native-Light, input, menlo, monospace;
            -webkit-font-smoothing: subpixel-antialiased;
            font-size: 10px;
            letter-spacing: 0.5px;
            font-weight: 300;
        }
        div#currency-table {
            padding: 0;
        }
        .full-width {
            width: 100% !important;
        }
        #getOfferLoader {
            float: left;
            // min-height: 28px;
            padding: 0px 24px 0 0;
            display: none;
        }
        #getOffer {
            font-family: Native-Light, input, menlo, monospace;
            -webkit-font-smoothing: subpixel-antialiased;
            font-size: 10px;
            letter-spacing: 0.5px;
            font-weight: 300;
            color: rgb(158, 156, 158);
            padding-left: 0px;
        }
        .activityIndicators.graphicAndLabel > div.loader {
            display: inline-block;
            position: relative;
            top: 0px;
        }
        .activityIndicators.on-normal-background .loader > .block {
            background-color: #383638;
            animation: block-animate-normal-bg .75s infinite ease-in-out;
        }
        .activityIndicators .loader > .block1 {
            animation-delay: -1.2s !important;
        }
        .activityIndicators .loader > .block2 {
            animation-delay: -1.0s !important;
        }
        .activityIndicators .loader > .block3 {
            animation-delay: -0.8s !important;
        }
        #tx-fee {
            float: right;
            padding: 0px 13px 7px 6px;
        }
        #minimum-fee-text, #tx-fee, #addressValidationLoaderText {
            font-size: 10px;
        }
        #btc-address {
            clear: both;
            padding: 0px 13px 7px 0px;
        }
        #addressValidationLoader {
            font-family: Native-Light, input, menlo, monospace;
            -webkit-font-smoothing: subpixel-antialiased;
            font-size: 10px;
            letter-spacing: 0.5px;
            font-weight: 300;
            color: rgb(158, 156, 158);
            padding-left: 0px;
            padding: 0px 24px 0 0;
            display: none;
        }
        #addressValidationLoader .loader {
            float: left;
        }
        #addressValidationLoaderText {
            float: left;
            font-size: 10px;
        }
        .activityIndicators.graphicAndLabel > span {
            display: inline-block;
        }
        #validation-messages, #address-messages, #server-messages {
            max-width: fit-content;
        }
        .currencySelect {
            right: 5px;
            left: auto;
        }
        .currencySelect {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            -webkit-font-smoothing: subpixel-antialiased;
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 0.5px;
            text-indent: 10px;
            color: rgb(223, 222, 223);
            background-color: rgba(80, 74, 80, 0.55);
            position: absolute;
            left: 117.5px;
            width: 56px;
            height: 29.5px;
            border: 0px;
            padding: 0px;
            border-radius: 0px 4px 4px 0px;
            -webkit-appearance: none;
            top: 24px;
        }
        #minimum-fee {
            float: right;
        }
        #minimum-fee-text, #tx-fee, #addressValidationLoaderText {
            font-size: 10px;
            margin-top: 8px;
            color: rgb(158, 156, 158);
            display: inline-block;
        }
        .full-width td {
            display: block;
            width: 100%;
            clear: both;
        }
        input#inCurrencyValue, input#outCurrencyValue {
            width: calc(100% - 70px);
            padding: 0px 0px;
            text-indent: 148px;
            position: relative;
            right: 40px;
            left: 0px;
            padding: 0px 3px;
            margin-right: 5px;
            text-indent: 20px;
            min-width: 104px;
        }
        span#outCurrencyValue {
            width: calc(100% - 70px);
            padding: 0px 0px;
            text-indent: 148px;
            position: relative;
            right: 40px;
            left: 0px;
            padding: 0px 3px;
            margin-right: 5px;
            text-indent: 20px;
            min-width: 104px;
        }
        .textInput {
            display: inline-block;
            height: 29px;
            width: 80px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0);
            text-align: right;
            font-size: 13px;
            font-weight: 200;
            padding: 0px 63px 0px 7px;
            font-family: Native-Light, input, menlo, monospace;
            outline: none;
            box-shadow: rgba(56, 54, 56, 0.5) 0px 0.5px 0px 0px, rgb(22, 20, 22) 0px 0.5px 0px 0px inset;
            color: rgb(223, 222, 223);
            background-color: rgb(29, 27, 29);
        }
        .currencySelect {
            right: 5px;
            left: auto;
        }
        .longTextInput {
            display: block;
            height: 29px;
            width: calc((100% - 2px) - 14px);
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0);
            text-align: left;
            font-size: 13px;
            font-weight: 200;
            padding: 0px 7px;
            font-family: Native-Light, input, menlo, monospace;
            outline: none;
            box-shadow: rgba(56, 54, 56, 0.5) 0px 0.5px 0px 0px, rgb(22, 20, 22) 0px 0.5px 0px 0px inset;
            color: rgb(223, 222, 223);
            background-color: rgb(29, 27, 29);
        }
        #inCurrencySelector {
            position: relative;
            // background: red;
            width: 48px;
            height: 22px;
            float: right;
            font-size: 1.5em;
            text-align: center;
            font-weight: bold;
            padding-top: 9px;
            border-radius: 0 5px 5px 0;
            // float: right;
            top: 0px;
        }
        #currency-loader {
            float: right;
        }
        .even-row {
            background-color: #3f3e3f !important;
        }
        .odd-row {
            background-color: rgb(56, 54, 56) !important;
        }
        /** Exchange estimate details */

        .estimate-label {
            margin: 10px 0px 0px 15px;
            font-size: 13px;
            font-family: Native-Light, input, menlo, monospace;
            font-weight: 800;
            -webkit-font-smoothing: subpixel-antialiased;
        }
        .estimate-value {
            margin: 10px 15px 0px 0px;
            font-size: 13px;
            font-family: Native-Light, input, menlo, monospace;
            font-weight: 100;
            -webkit-font-smoothing: subpixel-antialiased;
        }
        #estimate-details {
            display: block;
            outline: none;
            height: auto;
            width: 100%;
            padding: 0px;
            box-sizing: border-box;
            appearance: none;
            background: rgb(56, 54, 56);
            border-width: 0px;
            box-shadow: rgb(22 20 22) 0px 0.5px 1px 0px, rgb(73 71 73) 0px 0.5px 0px 0px inset;
            border-radius: 5px;
            text-align: left;
            font-size: 14px;
            color: rgb(252, 251, 252);
        }
        .estimate-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0px;
            width: 100%;
            padding: 10px 0px 20px;
        }
        .estimate-row:first-of-type {
            border-radius: 10px 10px 0px 0px;
        }
        .estimate-row:last-of-type {
            border-radius: 0px 0px 10px 10px;
        }
        .wallet-select-wrapper {
            position: relative;
        }
        `;
    }

    getEstimatedFee() {
        // This function should return the estimated fee for the exchange
        // For now, we will return a static value
        return "0.01 XMR"; // Example static fee
    }

    static get properties() {
        return {
            /* Display values */
            displayLoadingScreen: { type: Boolean },
            displayEstimateRetrieval: { type: Boolean },
            displayOrderScreen: { type: Boolean },
            displayPurchaseButton: { type: Boolean },
            displayPurchaseRedirectIndicator: { type: Boolean },
            displayErrorString: { type: Boolean },
            displayEnterCurrencyPrompt: { type: Boolean },
            errorString: { type: String },
            fiatCurrencies: { 
                type: Array,
                reflect: true
            },
            estimatedFiatRange: {
                type: Object
            }, 
            estimatedCryptoRange: {
                type: Object
            },
            estimateDetails: {
                type: Object
            },
            estimatedFiatRangeString: { type: String },
            estimatedCryptoRangeString: { type: String },
            currencyInfo: { type: Array },
            inCurrencyCode: { type: String },
            inCurrencyName: { type: String },
            inCurrencyValue: { type: String },
            outCurrencyCode: { type: String },
            outCurrencyName: { type: String },
            outCurrencyValue: { type: String },
            estimateUsingFiat: { type: Boolean },
            context: { type: Object },
            redirectUrl: { type: String },
            selectedWallet: { type: Object}
        }
    }
    

    // This function listens for a custom event dispatched from the select box. 
    // It uses the details to update the desired currency
    // async oldUpdateSelectedCurrency(event) {
    //     //this.clearEstimate();
    //     let prepopulatedCurrencyValueExists = false;
    //     // Handle case where the user has input the amount already
    //     if ((this.inCurrencyCode !== "---") && (this.inCurrencyValue.length > 0)) {
    //         prepopulatedCurrencyValueExists = true;
    //     }
    //     this.fiatMinMaxString = "";
    //     this.inCurrencyCode = event.detail.selectValue;
    //     this.inCurrencyName = event.detail.selectText;
    //     this.displayMinMaxLoadingIndicator = true;
    //     if (prepopulatedCurrencyValueExists) {
    //         this.handleCurrencyInputResponse();
    //     }
    //     let rangeQueryArray = await this.getMinMaxRange; // https://majesticbank.sc/api/v1/limits?from_currency=XMR
    //     let [estimatedFiatRange] = await Promise.all(rangeQueryArray)
    //         .catch(error => {
    //             // console.error(error);
    //             // console.error(error.message);
    //             this.fiatMinMaxString = "There was an error retrieving the minimum and maximum values for the specified currency";
    //         });
    //     this.displayMinMaxLoadingIndicator = false;
    //     this.estimatedFiatRange = estimatedFiatRange;
    //     //this.estimatedCryptoRange = estimatedCryptoRange;
    //     //this.estimatedCryptoRangeString = `${estimatedCryptoRange.min} - ${estimatedCryptoRange.max}`
    //     let formatOptions = {
    //         style: 'currency',
    //         currency: this.inCurrencyCode
    //     }
    //     let currencyFormatter = new Intl.NumberFormat(undefined, formatOptions)
    //     // this.estimatedFiatRange.min = currencyFormatter.format(estimatedFiatRange.min);
    //     // this.estimatedFiatRange.max = currencyFormatter.format(estimatedFiatRange.max);
    //     this.estimatedFiatRangeString = `${this.estimatedFiatRange.min} - ${this.esimatedFiatRange.max}`
    //     this.fiatMinMaxString = `You can exchange between ${estimatedFiatRange.min} XMR and ${estimatedFiatRange.max} XMR`
    // }

    async getMinMaxRange(inCurrencyCode = "XMR") {
        let minMaxRange;
        minMaxRange = { "min": 0.03796988, "max": 791.03910897 }
        return minMaxRange;
        // Testing
        // { "min": 0.03796988, "max": 791.03910897 }
        this.displayMinMaxLoadingIndicator = true;
        
        // TESTING: 
        minMaxRange = { "min": 0.03796988, "max": 791.03910897 }
        //const minMaxRange = await fetch(`https://majesticbank.sc/api/v1/limits?from_currency=${inCurrencyCode}`);

        console.log(minMaxRange);
        this.MinMaxString = `You can trade ${minMaxRange.min} - ${minMaxRange.max} XMR`;
        if (!minMaxRange.ok) {
            this.minMaxString = `Unable to load minimum and maximum values from Majestic Bank API`;
            return "Failed to retrieve minimum and maximum values for the specified currency"
        }
        return minMaxRange
    }

    async initDefaultCurrencyInfo() {
        this.MinMaxString = "Busy loading minimum and maximum values for XMR";
        this.displayMinMaxLoadingIndicator = true;
        
        // const coinData = coins.map(coin => {
        //     console.log("Fire for coinData");
        //     fetch(`https://majesticbank.sc/api/v1/limits?from_currency=${coin}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log("Data: ", data);
        //             return data;
        //         })
        // });
    

        // Getting rate limited, let's park this for now
        return await this.getMinMaxRange("XMR");
        let coinObj;
        let mapCnt = 0;

        const coins = ["XMR", "BTC"];

        fetch.headers = {
            "Content-Type": "application/json",
            "User-Agent": "MyMonero Majestic Bank Exchange Integration v0.1",
            "Accept": "application/json",

        };

        const promises = coins.map((coin) => {
            return fetch(`https://majesticbank.sc/api/v1/limits?from_currency=${coin}`)
                .then((response) => response.json())
                .then((jsonData) => ({ [coin]: jsonData }));
        });

        const coinsArray = await Promise.all(promises);
        console.log("Coins array: ", coinsArray);
        const coinsData = Object.assign({}, ...coinsArray);
        return coinsData;
        // let currencies = await Promise.all(coinData);
        // print_r(currencies);
        // console.log("Currencies: ", currencies);
        
        // let rangeQueryArray = await this.getMinMaxRange("XMR");
        // console.log("Range query array: ", rangeQueryArray);
        // let [estimatedFiatRange] = await Promise.all(rangeQueryArray)
        //     .catch(error => {
        //         // console.error(error);
        //         // console.error(error.message);
        //         this.MinMaxString = "There was an error retrieving the minimum and maximum values for the specified currency";
        //     });
        // this.displayMinMaxLoadingIndicator = false;
        // this.estimatedFiatRange = estimatedFiatRange;
        // this.estimatedCryptoRange = estimatedCryptoRange;
        // this.estimatedCryptoRangeString = `${estimatedCryptoRange.min} - ${estimatedCryptoRange.max}`
        
        let formatOptions = {
            style: 'crypocurrency',
            currency: this.inCurrencyCode
        }        
    }



    /**
     * This function initialises the selected currency and the input value
     */
    async initSelectedCurrency(currencyCode = "XMR") {
        this.MinMaxString = "Busy loading minimum and maximum values for XMR";
        this.inCurrencyCode = "XMR"
        this.inCurrencyName = "Monero"
        this.displayMinMaxLoadingIndicator = false;
        let rangeQueryArray = await this.getMinMaxRange("XMR");
        console.log("Range query array: ", rangeQueryArray);
        // let [estimatedFiatRange] = await Promise.all(rangeQueryArray)
        //     .catch(error => {
        //         // console.error(error);
        //         // console.error(error.message);
        //         this.MinMaxString = "There was an error retrieving the minimum and maximum values for the specified currency";
        //     });
        // this.displayMinMaxLoadingIndicator = false;
        // this.estimatedFiatRange = estimatedFiatRange;
        // this.estimatedCryptoRange = estimatedCryptoRange;
        // this.estimatedCryptoRangeString = `${estimatedCryptoRange.min} - ${estimatedCryptoRange.max}`
        
        //const currenciesInfo = 
        
        let formatOptions = {
            style: 'crypocurrency',
            currency: this.inCurrencyCode
        }        
    }

    async fireEstimateEvent(event) {
        let options = {
            detail: { 
                
            },
            bubbles: true,
            composed: true
        };
        let estimatePostEvent = new CustomEvent("fire-estimate-event", options)
        this.dispatchEvent(estimatePostEvent, options)
        let estimateResponse = await this.fiatApi.createExchangeTransaction(this.inCurrencyValue, this.inCurrencyCode, "XMR", this.selectedWallet.public_address);
        // todo -- service fee can be array of multiple fees -- bank fee not always charged
        const estimateDetails = {
            convertedAmount: estimateResponse.convertedAmount,
            expected_to_amount: estimateResponse.expected_to_amount,
            estimatedExchangeRate: estimateResponse.estimate_breakdown.estimatedExchangeRate,
            estimatedExchangeRateString: estimateResponse.estimate_breakdown.estimatedExchangeRate + " " + estimateResponse.to_currency,
            id: estimateResponse.id,
            initial_from_currency: estimateResponse.initial_from_currency,
            initial_expected_from_amount: estimateResponse.expected_from_amount,
            networkFee: estimateResponse.estimate_breakdown.networkFee,
            redirected_amount: estimateResponse.redirected_amount,
            serviceFees: estimateResponse.estimate_breakdown.serviceFees,
            serviceFeeString: "N/A",
            bankFeeString: "N/A",
            to_currency: estimateResponse.to_currency,
            networkFeeString: estimateResponse.estimate_breakdown.networkFee.amount + " " + estimateResponse.estimate_breakdown.networkFee.currency
        }
        const serviceFees = estimateResponse.serviceFees;
        estimateResponse.estimate_breakdown.serviceFees.forEach((fee) => {
            if (fee.name.toUpperCase() === "BANK FEE") {
                estimateDetails.bankFeeString = fee.amount + " " + fee.currency
            } else if (fee.name.toUpperCase() == "SERVICE FEE") {
                estimateDetails.serviceFeeString = fee.amount + " " + fee.currency
            }
        })
        this.redirectUrl = estimateResponse.redirect_url;
        this.estimateDetails = estimateDetails;
    }
    
    async redirectToURL() {
        this.displayPurchaseButton = false;
        this.displayPurchaseRedirectIndicator = true;
        try {
            let estimateResponse = await this.fiatApi.createExchangeTransaction(this.inCurrencyValue, this.inCurrencyCode, "XMR", this.selectedWallet.public_address);
            this.openExternal(estimateResponse.redirect_url)
            this.displayPurchaseRedirectIndicator = false;
        } catch (error) {
            console.error("Failure with redirect");
            // Error communicating with server to retrieve response -- show error
            this.errorString = error.message;
        }
    }

    async openExternal(url) {
        // Check whether we're on desktop, or web and Android
        if (typeof(this.context.shell) !== "undefined") { // Electron passes the shell variable as part of context            
            this.context.shell.openExternal(url);            
        } else if (typeof(this.context.deviceInfo) !== "undefined" && this.context.deviceInfo.platform == "ios") {
            await this.context.capacitorBrowser.open({ url: url });
        } else { // Web and Android Capacitor codebase            
            window.open(url, "_blank");
        }
    }

    renderStyles() {
        // These styles are necessary in instances where we have a top-right action button
        let styleElement = document.getElementById("lit-styles");
        if (styleElement === null) {
            let styles = document.createElement("style");
            styles.innerHTML = `
                #stack-view-stage-view {
                    z-index: 21 !important;
                }
                #leftBarButtonHolderView {
                    z-index: 10;
                }
                #rightBarButtonHolderView {
                    display: none;
                }
                #navigation-bar-view-sub-wrapper {
                    display: none;
                } 
                
            `
            styles.id = "lit-styles";
            let navigationView = document.getElementById("NavigationBarView");
            navigationView.appendChild(styles);
        }
    }

    updateSelectedWallet(event) {
        // Updates wallet on primary form 
        this.selectedWallet = event.detail.wallet;
        this.displayEnterCurrencyPrompt = false;

    }
    
    async connectedCallback() {
        super.connectedCallback();
        this.renderStyles();
        console.log("Connected callback for MajesticBankFloatingRateView");
        //this.fiatApi = fiatApi;
        this.wallets = this.context.walletsListController.records;
        // Possibly left over, and we double call getMinMaxRange
        //let selectedCurrency = await this.initSelectedCurrency.bind(this);
        //this.updateSelectedCurrency.bind(this);
        // this.handleCurrencyInputResponse();
        this.addEventListener('searchable-select-update', this.updateSelectedCurrency);
        this.addEventListener('wallet-selector-update', this.updateSelectedWallet);
        
        this.estimatedFee = 0;
        let fee = this.getEstimatedFee();
        this.estimatedFee = fee;

        this.displayLoadingScreen = true;
        this.displayLoadingScreen = false;
        this.displayOrderScreen = true;
        this.displayMinMaxLoadingIndicator = true;
        let apiIsAvailable = await this.checkAPIIsAvailable();
        this.initDefaultCurrencyInfo();
        //let enabledCurrencies = [];
        let enabledCurrencies = {
            "BTC": "Bitcoin",
            "LTC": "Litecoin",
            "WOW": "Wownero",
        }
        let minMaxResponse = await this.getMinMaxRange("XMR");
        //let data = await minMaxResponse.json();
        let data = { 
            "min": minMaxResponse.min,
            "max": minMaxResponse.max
        }
        this.minMaxString = `You can pretend trade between ${data.min} - ${data.max} XMR`;

        if (apiIsAvailable) {
            this.displayLoadingScreen = false;
            this.displayOrderScreen = true;
            try {
                //let fiatCurrencies = await this.fiatApi.getAvailableFiatCurrencies();
                this.availableTargetCurrencyTickerCodes = {
                    "BTC": "Bitcoin",
                    "LTC": "Litecoin",
                    "WOW": "Wownero",
                }
                

                // for (let i = 0; i < fiatCurrencies.length; i++) {
                //     var hasValidPaymentMethod = false;
                //     let paymentMethodArray = fiatCurrencies[i].networks[0].payment_methods;
                //     for (let j = 0; j < paymentMethodArray.length; j++) {
                //         if (paymentMethodArray[j].deposit_enabled === true) {
                //             hasValidPaymentMethod = true;
                //         }
                //     }
                //     if (hasValidPaymentMethod) {
                //         enabledCurrencies.push(fiatCurrencies[i]);
                //     }
                // }
                this.fiatCurrencies = enabledCurrencies;
                this.requestUpdate(); // TODO: Check if this is necessary
                //this.displayLoadingScreen = false;
                this.displayCurrencyLoadingIndicator = false;
                this.displayOrderScreen = true;
            } catch (error) {
                this.displayErrorResponse = true;
                this.displayErrorString = error.message;
            }
        } else {
            console.error("Our exchange partner is temporarily unavailable. Please try again later.");
        }

        // 1. checkAPIIsAvailable
        // -- If available, go to step 2
        // -- If unavailable, show 'Unavailaility' message (Maybe we should grey out the panel on the previous page)
        // 2. Get a list of available fiat Currencies
        // 3. Populate select box with available currencies
        // 4. Re-order select options to prioritise popular currencies eg. USD, GBP, JPY
        // 5. Select dropdown should support typing (search against ticker code and against currency's full name)
        // 6. Once currency is selected:
        // -- Show loader 
        // -- Async (keep reference): Get Fiat range estimate (getMinMaxRange(fiat_currency, cryptocurrency))
        // -- Once returned:
        // --- Update UI to display minimum and maximum amounts
        // --- Enable desired amount fields
        // -- If keypress before return
        // --- Cancel previous axios request
        // --- Send new async request (while storing a reference)
        // -- Hide loader 
        // 8. Handle input events
        // -- Check number is valid float
        // -- If float, start async request and keep reference
        // --- When request returns, update currency fields as appropriate
        // -- If async query sent and keypress occurs, cancel async request

    }

    // Returns true when API is available.
    // Returns false when API is unavailable
    // Throws errors in any other scenario
    // Probably not needed
    async checkAPIIsAvailable() {
        return true
        try {
            let response = await this.fiatApi.getFiatAPIStatus();
            if (response.message == "OK") {
                return true;
            } else {
                return false;
            }
        } catch(error) {
            // TODO: build out better error handling
            console.error("API not available -- network error or unexpected error or ChangeNow response object's format changed")
        }
    }
    
    // Needed
    async getOrder(amount, from_currency, receive_currency) {
        console.log("getTXestimate");

        const body = {
            from_amount,
            from_currency,
            receive_currency
        };

        console.log("Body: ", body);
        try {
            const calculateResponse = await fetch('https://majesticbank.sc/api/v1/calculate', {
                method: 'POST',
                headers: {
                    'User-Agent': 'MyMonero Majestic Bank Exchange Integration v0.1',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            
            const data = await calculateResponse.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error fetching transaction estimate:", error);
        }
        //const transactionEstimate = await fetch('https://majesticbank.sc/api/v1/calculate?from_currency=XMR&to_currency=BTC&amount=100');
        // try {
        //     let response = await this.fiatApi.getTransactionEstimate();
        //     if (response.message == "OK") {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // } catch(error) {
        //     // TODO: build out better error handling
        //     console.error("API not available -- network error or unexpected error or ChangeNow response object's format changed")
        // }
    }

    constructor() {
        super();
        this.context = {};
        this.displayLoadingScreen = false;
        this.displayEstimateRetrieval = false;
        this.displayOrderScreen = false;
        this.displayOrderStatusScreen = false;
        this.displayConfirmationScreen = false;
        this.displayCurrencyLoadingIndicator = true;
        this.displayPurchaseButton = true;
        this.errorString = false;
        this.clickHandler = this.clickHandler;
        this.estimateDetails = {
            convertedAmount: "",
            expected_to_amount: "",
            estimatedExchangeRate: "",
            estimatedExchangeRateString: "",
            id: "",
            initial_from_currency: "",
            initial_expected_from_amount: "",
            networkFee: "",
            redirected_amount: "",
            serviceFees: "",
            serviceFeeString: "",
            bankFeeString: "",
            to_currency: "",
            networkFeeString: ""
        };
        this.estimatedFiatRange = {};
        this.estimatedFiatRangeString = "";
        this.estimatedCryptoRangeString = "";
        this.estimatedCryptoRange = {};
        this.minMaxString = "Loading ...";
        this.inCurrencyCode = "EUR";
        this.inCurrencyName = "Euro";
        // this.inCurrencyValue = "200";
        // this.outCurrencyCode = "XMR";
        this.outCurrencyName = "Monero";
        this.outCurrencyValue = "";
        this.estimatedFee = "";
        this.outCurrencyValue = "";
        this.redirectUrl = "";
        this.fiatCurrencies = [{
            "block_explorer_url_mask": null,
            "currency_type": "FIAT",
            "default_exchange_value": "300",
            "enabled": true,
            "has_external_id": false,
            "id": "4881817401",
            "is_available": null,
            "is_featured": null,
            "is_stable": null,
            "logo_url": "",
            "name": "",
            "networks": [],
            "ticker": "",
        }
    ];
        this.wallets = [
            {}
        ];
    }
    
    // Do we need this if we already update values in our click handler?
    clearEstimate() {
        // We cannot unset the keys on this object because rendering depends on it
        // this.displayPurchaseButton = true;
        // this.estimateDetails = {
        //     convertedAmount: "",
        //     expected_to_amount: "",
        //     estimatedExchangeRate: "",
        //     estimatedExchangeRateString: "",
        //     id: "",
        //     initial_from_currency: "",
        //     initial_expected_from_amount: "",
        //     networkFee: "",
        //     redirected_amount: "",
        //     serviceFees: "",
        //     serviceFeeString: "",
        //     bankFeeString: "",
        //     to_currency: "",
        //     networkFeeString: ""
        // };
    }

    // We'll need to do the following:
    // 1. Bind this function to an input event when a user specifies the value of currency they want to exchange / receive
    // 2. When in or out inputs are changed, reset our estimates to empty, with placeholder "Loading..."
    // 3. Start a timer to wait for 2 seconds before sending the request to the API"
    // 4. If the user changes the input before the timer is up, cancel the previous request and start a new one
    // 5. If the user changes the input after the request is sent, cancel the previous request and start a new one
    // 6. If the user changes the input after the request is sent, but before the response is received, cancel the previous request and start a new
    // 7. If left unchanged, request data and populate the values into the 
    handleCurrencyInput(event) {
        console.log("handleCurrencyInput called");
        console.log(event);
        // If timer is already running, clear it and start a new one
        if (typeof this.estimateRequestTimer !== 'undefined' && this.estimateRequestTimer !== null) {
            console.log("Timer already exists, clearing and restarting...");
            clearInterval(this.estimateRequestTimer);
            this.estimateRequestTimer = null;
            this.timerCounter = null;
        }

        
        // Start a new 20-second timer
        this.timerCounter = 5;
        console.log("Starting timer with 5 seconds");
        this.calculationType = event.target.id === "inCurrencyValue" ? "in" : "out";
        this.orderCurrencyValue = event.target.value;
        this.outCurrencyCode = document.getElementById("outCurrencySelector").value;

        this.estimateRequestTimer = setInterval(async () => {
            console.log("Timer tick");
            if (this.timerCounter > 0) {
                // Decrement the timer counter
                this.timerCounter--;
                console.log(`Timer: ${this.timerCounter} seconds remaining`);
            } else {
                // Timer reached zero
                console.log("Time to phone home (call the calculation endpoint with valid data)");

                clearInterval(this.estimateRequestTimer);
                this.estimateRequestTimer = null;
                this.timerCounter = null;
                let orderResponse = await sendOrderCalculationRequest(this.calculationType, this.orderCurrencyValue, this.outCurrencyCode);
                console.log("Order response: ", orderResponse);
            }
        }, 1000); // Run every 1 second

        // this.clearEstimate();
        // var eventPath = event.path || (event.composedPath && event.composedPath());
        // if (eventPath[0].id == "inCurrencyValue") {
        //     this.inCurrencyValue = eventPath[0].value;
        // } else if (eventPath[0].id == "outCurrencyValue") {
        //     this.outCurrencyValue = eventPath[0].value;
        // }

        // if (this.estimateRequestTimer !== 'undefined') {
        //     clearTimeout(this.estimateRequestTimer);
        // }

        // this.estimateRequestTimer = setTimeout(() => {
        //     if (this.inCurrencyCode.length > 0) {
        //         // TODO: Put this into standalone function 
        //         this.handleCurrencyInputResponse();
        //     } else {
        //         this.displayEnterCurrencyPrompt = true;
        //     }
        // }, 2000);
    }

    // async oldhandleCurrencyInputResponse() {
    //     this.displayEstimateRetrieval = true;
    //     this.displayErrorResponse = false;
    //     try {
    //         let response = await this.fiatApi.getTransactionEstimate(this.inCurrencyValue, this.inCurrencyCode, "XMR");
    //         let estimateDetails = {};
    //         estimateDetails.convertedAmount = response.converted_amount.amount;
    //         //estimateDetails.expected_to_amount = response.expected_to_amount;
    //         estimateDetails.estimatedExchangeRate = response.estimated_exchange_rate;
    //         estimateDetails.estimatedExchangeRateString = response.estimated_exchange_rate + " " + response.to_currency;
    //         //estimateDetails.id = response.id;
    //         estimateDetails.initial_from_currency = response.from_currency;
    //         estimateDetails.initial_expected_from_amount = this.inCurrencyValue;
    //         estimateDetails.networkFee = response.network_fee.amount;
    //         //estimateDetails.redirected_amount = response.redirected_amount;
    //         estimateDetails.serviceFees = response.service_fees;
    //         estimateDetails.to_currency = response.to_currency;
    //         //this.outCurrencyValue = response.value;
    //         estimateDetails.expected_to_amount = response.value;
    //         estimateDetails.networkFeeString = response.network_fee.amount + " " + response.network_fee.currency            
    //         estimateDetails.serviceFeeString = "N/A"
    //         estimateDetails.bankFeeString = "N/A"
    //         response.service_fees.forEach((fee) => {
    //             if (fee.name.toUpperCase() === "BANK FEE") {
    //                 estimateDetails.bankFeeString = fee.amount + " " + fee.currency
    //             } else if (fee.name.toUpperCase() == "SERVICE FEE") {
    //                 estimateDetails.serviceFeeString = fee.amount + " " + fee.currency
    //             }
    //         })
    //         this.estimateDetails = estimateDetails;
    //     } catch (error) {
    //         console.error(error, error.message);
    //         if (error.isAxiosError && typeof(error.response.data) === "object" && typeof(error.response.data.message) === "string") {
    //             this.errorString = error.response.data.message;
    //         } else {
    //             this.errorString = error.message;
    //         }
    //         this.displayErrorResponse = true;
    //     }
    //     this.displayEstimateRetrieval = false;
    // }

    async sendOrderCalculationRequest(calculationType, orderCurrencyValue, outCurrencyCode) {
        console.log("sendOrderCalculationRequest called");
        console.log(this);
        console.log(calculationType, orderCurrencyValue, outCurrencyCode);

        // from_amount or receive_amount
        let requestBody = {};
        if (calculationType === "in") {
            requestBody = {
                from_amount: orderCurrencyValue,
                from_currency: "XMR",
                receive_currency: outCurrencyCode
            };
        } else if (calculationType === "out") {
            requestBody = {
                receive_amount: orderCurrencyValue,
                from_currency: "XMR",
                receive_currency: outCurrencyCode
            };
        } else {
            throw new Error("Invalid calculation type specified. Must be 'in' or 'out'.");
        }
        
        try {
            const headers = {
                "Content-Type": "application/json",
                "User-Agent": "MyMonero Majestic Bank Exchange Integration v0.1",
                "Accept": "application/json"
            };

            

            const body = {
                from_amount: requestBody.from_amount || null,
                receive_amount: requestBody.receive_amount || null,
                from_currency: requestBody.from_currency,
                receive_currency: requestBody.receive_currency,                
            }
            console.log(requestBody);
            console.log(body);


            return;
            const calculateResponse = await fetch('https://majesticbank.sc/api/v1/calculate', {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
            });

            return calculateResponse;
        } catch (error) {
            console.error("Error fetching transaction estimate:", error);
            throw error; // Re-throw the error to be handled by the caller
        }

            // const response = await this.getTransactionEstimate(this.inCurrencyValue, this.inCurrencyCode, "XMR");
            // let estimateDetails = {};
            // estimateDetails.convertedAmount = response.converted_amount.amount;
            // //estimateDetails.expected_to_amount = response.expected_to_amount;
            // estimateDetails.estimatedExchangeRate = response.estimated_exchange_rate;
            // estimateDetails.estimatedExchangeRateString = response.estimated_exchange_rate + " " + response.to_currency;
            // //estimateDetails.id = response.id;
            // estimateDetails.initial_from_currency = response.from_currency;
            // estimateDetails.initial_expected_from_amount = this.inCurrencyValue;
            // estimateDetails.networkFee = response.network_fee.amount;
            // //estimateDetails.redirected_amount = response.redirected_amount;
            // estimateDetails.serviceFees = response.service_fees;
            // estimateDetails.to_currency = response.to_currency;
            // //this.outCurrencyValue = response.value;
            // estimateDetails.expected_to_amount = response.value;
            // estimateDetails.networkFeeString = response.network_fee.amount + " " + response.network_fee.currency            
            // estimateDetails.serviceFeeString = "N/A"
            // estimateDetails.bankFeeString = "N/A"
            // response.service_fees.forEach((fee) => {
            //     if (fee.name.toUpperCase() === "BANK FEE") {
            //         estimateDetails.bankFeeString = fee.amount + " " + fee.currency
            //     } else if (fee.name.toUpperCase() == "SERVICE FEE") {
            //         estimateDetails.serviceFeeString = fee.amount + " " + fee.currency
            //     }
            // })
            // this.estimateDetails = estimateDetails;
        //this.displayEstimateRetrieval = false;
    }

    // NB: Thoroughly test this code on Android
    createRenderRoot() {
        const root = super.createRenderRoot();
        
        root.addEventListener('click', (event) => { 
            if (event.target.localName == "input") {
                event.target.focus();
            } else {
                let inputs = this.querySelectorAll("input");
                inputs.forEach((input) => {
                    input.blur();
                })
            }
            
            // OLD
            // if (event.target.id == "confirmation-button") {
            //     this.redirectToURL();
            // }
        });
        
        root.addEventListener('touchend', (event) => { 
            if (event.target.localName == "input") {
                event.target.focus();
            } else {
                let inputs = this.querySelectorAll("input");
                inputs.forEach((input) => {
                    input.blur();
                })
            }
            
            // OLD
            // if (event.target.id == "confirmation-button") {
            //     this.redirectToURL();
            // }
        });
        return root;
    }

    async createOrder(event) {
        console.log("Create order button clicked");
        console.log(event);
        this.displayOrderStatusScreen = true;
        this.displayOrderScreen = false;
    }

    
    // handleCurrencyInput is what fires when the user types in the input field
    // It sets a timer to wait for 2 seconds before sending the request to the API (for avoiding unnecessary requests)
    render() {
        return html`
        <div id="rootOrderDiv">

        <style>
            #rootOrderDiv {
                margin: 1em;
            }
            #wallet-selector {
                margin: 0px;
            }
            input#inCurrencyValue, input#outCurrencyValue {
                width: calc(100% - 58px);
                text-indent: 148px;
                position: relative;
                right: 40px;
                left: 0px;
                padding: 0px 3px;
                margin-right: 0px;
                text-indent: 20px;
                min-width: 105px;
            }
            .form-field-title {

            }
            #orderStatusPage {
                
            }
            
            .currencySelect {
                right: 5px;
                left: auto;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                -webkit-font-smoothing: subpixel-antialiased;
                font-size: 11px;
                font-weight: 400;
                letter-spacing: 0.5px;
                text-indent: 10px;
                color: rgb(223, 222, 223);
                background-color: rgba(80, 74, 80, 0.55);
                position: absolute;
                left: 117.5px;
                width: 56px;
                height: 29.5px;
                border: 0px;
                padding: 0px;
                border-radius: 0px 4px 4px 0px;
                -webkit-appearance: none;
                top: 24px;
            }

            span.currencySelect {
                top: 0px;
            }

            .textInput {
                display: inline-block;
                height: 29px;
                width: 80px;
                border-radius: 4px;
                border: 1px solid rgba(0, 0, 0, 0);
                text-align: right;
                font-size: 13px;
                font-weight: 200;
                padding: 0px 63px 0px 7px;
                font-family: Native-Light, input, menlo, monospace;
                outline: none;
                box-shadow: rgba(56, 54, 56, 0.5) 0px 0.5px 0px 0px, rgb(22, 20, 22) 0px 0.5px 0px 0px inset;
                color: rgb(223, 222, 223);
                background-color: rgb(29, 27, 29);
            }
            .orderDetailPanel {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                -webkit-font-smoothing: subpixel-antialiased;
                font-size: 11px;
                font-weight: 400;
                letter-spacing: 0.5px;
                text-indent: 10px;
                color: rgb(223, 222, 223);
                background-color: rgba(80, 74, 80, 0.55);
                position: absolute;
                left: 117.5px;
                width: 56px;
                height: 29.5px;
                border: 0px;
                padding: 0px;
                border-radius: 0px 4px 4px 0px;
                appearance: none;
                top: 24px;
            }
            #validation-text { 
                margin-top: "15px !important"; 
                color: rgb(158, 156, 158);
                display: inline-block;
            }
            
            .submit-button-wrapper {
                // position: fixed;
                // top: -45px;
                // right: 16px;
                // width: 15%;
                // min-width: 41px;
                // height: 41px;
                // z-index: 12;
                // position: relative;
                // display: block;

            }

            .submit-button-view {
                display: block;
            }

            #order-button, #exchange-xmr {
                cursor: default;
                border-radius: 3px;
                height: 24px;
                min-height: 24px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                text-align: center;
                border: none;
                text-decoration: none;
                line-height: 24px;
                box-sizing: border-box;
                width: auto;
                min-width: 110px;
                padding: 0px 8px;
                background-color: rgb(0, 198, 255);
                box-shadow: rgb(22 20 22) 0px 0.5px 1px 0px, rgb(255 255 255 / 20%) 0px 0.5px 0px 0px inset;
                color: rgb(22, 20, 22);
                -webkit-font-smoothing: subpixel-antialiased;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.5px;
                float: right;
                margin-top: 5px;
                -webkit-app-region: no-drag;
                right: 16px;
                position: absolute;
                bottom: 10px;
            }

            #create-order-wrapper {
                display: block;
                float: right;
                min-width: 110px;
                width: 110px;
                text-align: center;
                height: 30px;
                border-radius: 5px;
            }

            #create-order-button {
                display: block;
                min-width: 100%;
                text-align: center;            
                line-height: 24px;
                box-sizing: border-box;
                width: auto;
                padding: 0px 8px;
                background-color: rgb(0, 198, 255);
                box-shadow: rgb(22 20 22) 0px 0.5px 1px 0px, rgb(255 255 255 / 20%) 0px 0.5px 0px 0px inset;
                color: rgb(22, 20, 22);
                -webkit-font-smoothing: subpixel-antialiased;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.5px;
                float: right;
                margin-top: 5px;
            }
            
            .selectIndicator {
                pointer-events: none;
                border: none;
                position: absolute;
                width: 8px;
                height: 13px;
                z-index: 9;
                background-image: url(http://127.0.0.1:9110/8ce00f9cb3449957b431.png)
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 8px 13px;
            }
            
        </style>
            <div class="content-container empty-page-content-container">
                <div ?hidden=${!this.displayOrderScreen}>
                    <div class="exchangeScreen exchange-page-panel">
                        <div class="content-container exchange-page-content-container" id="orderForm">
                            <div class="form_field wallet-select-wrapper">
                                <wallet-selector .wallets=${this.wallets}></wallet-selector>
                            </div>
                        <div class="form_field" id="currency-table">
                            <table class="full-width">
                                <tr>
                                    <td>   
                                        <div class="field_title form-field-title">XMR to send
                                            <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
                                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                                <input id="inCurrencyValue" @input=${this.handleCurrencyInput}
                                                    class="textInput currencyInput"
                                                    type="text" 
                                                    placeholder="00.00" 
                                                    value="" autocomplete="off">
                                                <div id="outCurrencySelector">
                                                    <select id="inCurrencySelectList" class="currencySelect">
                                                        <option value="XMR">XMR</option>
                                                    </select>
                                                </div>
                                                <div id="minimum-fee">
                                                    <span id="minimum-fee-text" class="field_title form-field-title validation-text">${this.minMaxString}</span>
                                                </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div id="inInputDiv" class="field_title form-field-title"><span id="outCurrencyTickerCode">BTC</span> you will receive
                                            <div class="" style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0">
                                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                                <input id="outCurrencyValue" 
                                                    @input=${this.handleCurrencyInput}
                                                    class="textInput currencyInput"
                                                    type="text"
                                                    placeholder="00.00"
                                                    value=""
                                                    autocomplete="off">
                                                <div id="outCurrencySelector">
                                                    <select id="outCurrencySelectList" class="currencySelect">
                                                        <option value="BTC">BTC</option>
                                                        <option value="LTC">LTC</option>
                                                        <option value="WOW">WOW</option>
                                                        <option value="FIRO">FIRO</option>
                                                    </select>
                                                </div>
                                                <div class="selectIndicator" style="right: 12px; top: 33px;">
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <!-- <div id="inInputDiv" class="field_title form-field-title"><span id="outCurrencyTickerCode">XMR</span> you will receive
                                            <div class="" style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0">
                                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                                <span id="outCurrencyValue">${this.outCurrencyValue}</span>
                                                <!-- CN API doesn't support getting a fiat value to pay from a crypto amount yet
                                                    <input id="outCurrencyValue" 
                                                    @input=${this.handleCurrencyInput} 
                                                    class="textInput currencyInput" 
                                                    type="text" 
                                                    .placeholder=${this.estimatedCryptoRangeString.length > 0 ? this.estimatedCryptoRangeString : "00.00" } 
                                                    .value=${this.outCurrencyValue}> 
                                                <div id="outCurrencySelector">
                                                    <select id="outCurrencySelectList" class="currencySelect">
                                                        <option value="XMR">XMR</option>
                                                    </select>
                                                </div>
                                                <div class="selectIndicator" style="right: 12px; top: 33px;">
                                            </div>
                                        </div>
                                    </div> -->
                                </td>
                            </tr>
                            <input id="in_address" type="hidden" value="">
                        </table>
                    </div>            
            <div class="form_field" id="getOfferLoader">
                this.getActivityLoader()
            </div>
            
            <div class="form_field" id="tx-fee">
                <span id="estimated-fee" class="field_title form-field-title" style="margin-top: 8px; color: rgb(158, 156, 158); display: inline-block;">Loading ...</span>
            </div>

            <div class="form_field" id="btc-address">
                <span class="field_title form-field-title" style="margin-top: 17px;">DESTINATION <span id="outCurrencyCoinName">BITCOIN</span> ADDRESS
                </span>
                <div class="contactPicker" style="position: relative; width: 100%; user-select: none;">
                    <input id="outAddress" class="full-width longTextInput" type="text" placeholder="Destination BTC Address" autocomplete="off" autocapitalize="none" spellcheck="false" value="">
                </div>
            </div>
            <div id="getAddressValidationLoader">
                this.getAddressValidationLoader()}
            </div>
            <div id="validation-messages"></div>
            <div id="address-messages"></div>
            <div id="server-messages"></div>
            <div id="create-order-wrapper">
                <button @click=${this.createOrder} id="create-order-button" class="button">Create Order</button>
            </div>
        </div>
                
        </div>
        <div id="order-status">

        </div>
    </div>
    <div id="orderStatusPage" ?hidden=${!this.displayOrderStatusScreen}>
        <div class="field_title form-field-title">
            
            <table class="full-width">
                <tr>
                <td colspan="2" style="word-wrap: normal; word-break: normal;">Please note an exchange may take a few minutes to process. <span class="provider-name"></span> are able to provide support for any exchanges. For all issues, please contact <span class="provider-name"></span> with your UUID for assistance.</td>
                </tr>
                <tr>
                    <td>
                        <div class="field_title form-field-title uppercase">
                            <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
                                <span class="field_title form-field-title label-spacing uppercase" style="margin-top: 0px;">
                                    UUID
                                </span>
                                <div id="provider_order_id" class="textInput currencyOutput" type="text" placeholder="0.00" style="text-transform: none !important"></div>
                                <div class="orderDetailPanel">&nbsp;&nbsp;&nbsp;&nbsp;</div> 
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="field_title form-field-title uppercase">
                            <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
                                <span class="field_title form-field-title label-spacing uppercase" style="margin-top: 0px;">
                                    Time Remaining
                                </span>
                                <div id="provider_order_id" class="textInput currencyOutput" type="text" placeholder="0.00" style="text-transform: none !important">    
                                <div id="clock" class="orderDetailPanel">
                                    <span id="minutesRemaining"></span>
                                    <span>Loading</span>
                                    <span id="secondsRemaining"></span>
                                </div>
                            </div>
                            <div class="orderDetailPanel">&nbsp;&nbsp;&nbsp;&nbsp;</div> 
                            </div>
                        </div>
                    </td>
                </tr>
                <!--<tr>
                    <td class="clock-row">
                        <div class="field_title form-field-title uppercase">Time Remaining
                            <div id="clock" class="orderDetailPanel">
                                <span id="minutesRemaining"></span>
                                <span>Loading</span>
                                <span id="secondsRemaining"></span>
                            </div>
                        </div>
                    </td>
                </tr>-->
                <tr>
                    <td>
                        <div class="field_title form-field-title">Remaining XMR payable
                            <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                <div id="in_amount_remaining" class="textInput currencyOutput" type="text" placeholder="0.00">Loading</div>
                                <div class="orderDetailPanel">&nbsp;&nbsp;&nbsp;&nbsp;</option>    
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="field_title form-field-title"><span class="outCurrencyTickerCode" id="orderStatusPageCurrencyTicker">BTC</span> to be paid out
                            <div class="" style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0">
                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                <div id="out_amount" class="textInput currencyOutput" type="text">Loading</div>
                                <div class="orderDetailPanel">&nbsp;</div>    
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="field_title form-field-title uppercase label-spacing">
                            <div class="" style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0">
                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">Order Status</span>
                                <div class="textInput currencyOutput" id="order-status">Loading</div>
                                <div class="orderDetailPanel">&nbsp;</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div class="field_title form-field-title hidden">
                <table class="full-width" style="display: none;">
                    <tr>
                        <td>
                            <div class="field_title form-field-title">Receiving subaddress
                                <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
                                    <div id="receiving_subaddress" class="textInput currencyOutput" type="text">Loading</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
        </div>
        <div id="monerod-updates" class="validationWindow">

        </div>
            <table class="hidden">
                <tr>
                    <td>btc_amount_partial</td>
                    <td id="btc_amount_partial"> "0"</td>
                </tr>
                <tr>
                    <td>btc_dest_address</td>
                    <td id="in_address"> "2NBaUzuYqJvbThw77QVqq8NEXmkmDmSooy9"</td>
                </tr>

                <tr>
                    <td>expires_at</td>
                    <td id="expires_at"> "2020-08-07T13:54:30Z"</td>
                </tr>
                <tr>
                    <td>incoming_amount_total</td>
                    <td id="in_amount"> "1"</td>
                </tr>

                <tr>
                    <td>incoming_price_btc</td>
                    <td id="incoming_price_btc"> "0.00789659"</td>
                </tr>
                <tr>
                    <td>receiving_subaddress</td>
                    <td id="receiving_subaddress"> "72FsJzvGG4x97vvjwu9V6e8hBBfB3bhrqVEEoPsxrkjAVgQUnbA22cbgMmu5b4Lx6cQ75vnjPVs9HUB1L32yBMhaNsi7KrD"</td>
                </tr>
                <tr>
                    <td>remaining_amount_incoming</td>
                    <td id="remaining_amount_incoming"> "1"</td>
                </tr>
                <tr>
                    <td>uuid</td>
                    <td id="uuid"> "xmrto-NCXzGE"</td>
                </tr>
            </table>            
        </div>
    </div>
</div>
                
        `
    }

    // oldUntouchedrender() {
    //     // We're going to use conditionals and classes to determine which elements to hide
    //     console.log("This is real legit stuff");
    //     return html`
        
        
    //     <div>
    //         <div class="submit-button-wrapper">
    //             &nbsp;
    //         </div>
    //         <div class="content-container empty-page-content-container">
    //             <buy-with-fiat-loading-screen-changenow ?hidden=${!this.displayLoadingScreen}></buy-with-fiat-loading-screen-changenow>
    //             <div ?hidden=${!this.displayOrderScreen}>
    //                 <div class="exchangeScreen exchange-page-panel">
    //                     <div class="content-container exchange-page-content-container" id="orderForm">
    //                     <div class="form_field wallet-select-wrapper">
    //                         <wallet-selector .wallets=${this.wallets}></wallet-selector>
    //                     </div>
                        
    //                     <div class="form_field" id="currency-table">
    //                         <table class="full-width">
    //                             <tbody><tr>
    //                                 <td>   
    //                                     <div class="field_title form-field-title">${this.inCurrencyName.length == 0 ? "Please select a currency" : this.inCurrencyName + " you will pay" } 
    //                                         <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
    //                                             <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
    //                                             <input id="inCurrencyValue" 
    //                                                 @input=${this.handleCurrencyInput} 
    //                                                 class="textInput currencyInput" 
    //                                                 type="text" 
    //                                                 .placeholder=${this.estimatedFiatRangeString.length > 0 ? this.estimatedFiatRangeString : "00.00" } 
    //                                                 .value=${this.inCurrencyValue}>
    //                                             <div id="inCurrencySelector">
    //                                                 <searchable-select .values=${this.fiatCurrencies}></searchable-select>
    //                                                 <!-- <select id="inCurrencySelectList" class="currencySelect">
    //                                                     <option value="XMR">XMR</option>
    //                                                 </select> -->
    //                                             </div>
    //                                         </div>
    //                                         <div id="transaction-range">
    //                                             <span id="transaction-range" class="field_title form-field-title">${this.fiatMinMaxString}</span>
    //                                             <div id="currency-loader">
    //                                                 <!-- <activity-indicator .loadingText=${"Loading supported currencies"} ?hidden=${!this.displayCurrencyLoadingIndicator}></activity-indicator> -->
    //                                                 <activity-indicator .loadingText=${"Retrieving minimum and maximum transaction amount limits"} ?hidden=${!this.displayMinMaxLoadingIndicator}></activity-indicator>
    //                                                 <activity-indicator .loadingText=${"Busy retrieving estimate"} ?hidden=${!this.displayEstimateRetrieval}></activity-indicator>
    //                                                 <div id="errorResponse" ?hidden=${!this.displayErrorResponse}>
    //                                                     <span id="errorResponseText" class="form-field-title">
    //                                                         ${this.errorString}
    //                                                     </span>
    //                                                 </div>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </td>
    //                                 <td>
    //                                     <!--
    //                                     <div id="inInputDiv" class="field_title form-field-title"><span id="outCurrencyTickerCode">XMR</span> you will receive
    //                                         <div class="" style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0">
    //                                             <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
    //                                             <span id="outCurrencyValue">${this.outCurrencyValue}</span>
    //                                             <!-- CN API doesn't support getting a fiat value to pay from a crypto amount yet
    //                                                 <input id="outCurrencyValue" 
    //                                                 @input=${this.handleCurrencyInput} 
    //                                                 class="textInput currencyInput" 
    //                                                 type="text" 
    //                                                 .placeholder=${this.estimatedCryptoRangeString.length > 0 ? this.estimatedCryptoRangeString : "00.00" } 
    //                                                 .value=${this.outCurrencyValue}> 
    //                                             <div id="outCurrencySelector">
    //                                                 <select id="outCurrencySelectList" class="currencySelect">
    //                                                     <option value="XMR">XMR</option>
    //                                                 </select>
    //                                             </div>
    //                                             <div class="selectIndicator" style="right: 12px; top: 33px;"></div>
    //                                         </div>
    //                                     </div>
    //                                     -->
    //                                 </td>
    // </tr>
    //                         </tbody></table>
    //                     </div>

            
    //                     <div class="form_field" id="getOfferLoader">
    //         </div>
    //         <div class="form_field" id="estimate-details">
    //             <!-- {"id":"4900188772","status":"new","email":null,"errors":[],"status_details":null,"from_currency":"GBP","initial_from_currency":"GBP","from_network":null,"from_currency_with_network":null,"from_amount":"0","deposit_type":"VISA_MC1","payout_type":"CRYPTO_THROUGH_CN","expected_from_amount":"75.5555","initial_expected_from_amount":"75.5555","to_currency":"XMR","to_network":null,"to_currency_with_network":null,"to_amount":null,"output_hash":null,"expected_to_amount":"0.3075642","location":"ZA","created_at":"2021-09-03T09:13:04.822Z","updated_at":"2021-09-03T09:13:04.822Z","partner_id":"5833338174","external_partner_link_id":null,"estimate_breakdown":{"toAmount":"0.3075642","fromAmount":75.5555,"serviceFees":[{"name":"Bank fee","amount":"3.02222","currency":"GBP"},{"name":"Service fee","amount":"2.25","currency":"GBP"}],"convertedAmount":{"amount":"70.28328","currency":"GBP"},"estimatedExchangeRate":"0.00437606","networkFee":{"amount":"0.001","currency":"XMR"}},"payout":{"address":"47joJKcNWs66f6ein9qTTVFyzeGnmBEGWKomSuMmqwaBYGj7gv2RvFRRUy1xtzpn6qE8BBpDnuFbp44qe9X1XmK78vqXaij","extra_id":"1"},"redirect_url":"https://payments.guardarian.com/checkout?tid=4900188772"} -->
    //             <div class="estimate-wrapper" ?hidden=${ (Object.keys(this.estimateDetails).length > 0) && (Object.keys(this.estimateDetails.expected_to_amount).length == 0) }>
    //                 <div class="estimate-row even-row">
    //                     <div class="estimate-label">You send</div>
    //                     <div class="estimate-value">
    //                         ${this.estimateDetails.initial_expected_from_amount} ${this.estimateDetails.initial_from_currency}
    //                     </div>
    //                 </div>
    //                 <div class="estimate-row odd-row">
    //                     <div class="estimate-label">Bank Fee</div>
    //                     <div class="estimate-value">${this.estimateDetails.bankFeeString}</div>
    //                 </div>
    //                 <div class="estimate-row even-row">
    //                     <div class="estimate-label">Service Fee</div>
    //                     <div class="estimate-value">${this.estimateDetails.serviceFeeString}</div>
    //                 </div>
    //                 <div class="estimate-row odd-row">
    //                     <div class="estimate-label">Network Fee</div>
    //                     <div class="estimate-value">${this.estimateDetails.networkFeeString}</div>
    //                 </div>
    //                 <div class="estimate-row even-row">
    //                     <div class="estimate-label">Estimated Rate</div>
    //                     <div class="estimate-value">${this.estimateDetails.estimatedExchangeRateString}</div>
    //                 </div>
    //                 <div class="estimate-row odd-row">
    //                     <div class="estimate-label">You receive </div>
    //                     <div class="estimate-value">~ ${this.estimateDetails.expected_to_amount} XMR</div>    
    //                 </div>
    //                 <div class="estimate-row even-row">
    //                     <div class="estimate-label"></div>
    //                     <div class="estimate-value">
    //                         <a @click=${this.redirectToURL} ?hidden=${!this.displayPurchaseButton} class="confirmation-button" id="confirmation-button">Buy XMR</a>
    //                         <activity-indicator .loadingText=${"Busy finalising estimate and redirecting you to our partner"} ?hidden=${!this.displayPurchaseRedirectIndicator}></activity-indicator>
    //                     </div>    
    //                 </div>
    //                 <div class="estimate-row odd-row">
    //                     <div class="estimate-label"></div>
    //                     <div class="estimate-value">* Please note that this is an estimate, and that your final rate may differ. The exchange and the quoted rate are controlled by our third-party partner.</div>    
    //                 </div>
    //             </div>
    //         </div>
                
    //     <style>
    //     #addressValidationLoader {
    //         float: left;
    //         // min-height: 28px;

    //     }
    //     #addressValidationLoader .loader {
    //         float: left;
    //     }
    //     #addressValidationLoaderText {
    //         float: left;
    //     }
    //     .exchange-cross {
    //         color: #d80000;
    //         font-size: 18px;
    //         position: relative;
    //         top: 2px;
    //     }
    //     .exchange-tick {
    //         color: #00CD00;
    //         font-size: 18px;
    //         position: relative;
    //         top: 2px;
    //     }
    //     #addressValidationLoader div { 
    //         // display: none; 
    //     }
    //     #addressValidationLoader {
    //         padding: 0px 24px 0 0;
    //         display: none;
    //     }
        
    //     </style>

    //         </div>
    //     </div>
                
    //     </div>
    // </div>
    //             </div></div></div>
    //         </div>
    //     </div>
    //     `;
    // }

}

try {
    console.log("define mbjrv")
    customElements.define('majesticbank-floating-rate-view', MajesticBankFloatingRateView);
} catch (error) {
    // already defined
    console.log("already defined mbjrv")
}