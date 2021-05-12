const HtmlHelper = require("./HtmlHelper");
const html = require("./HtmlHelper")
//const monero_amount_format_utils = require('@mymonero/mymonero-money-format')

class ExchangeHelper {
    // We declare these in this module so that we don't tightly couple currencies to the REST API module
    supportedOutCurrencies = ["BTC", "ETH", "BCH", "XRP"]
    supportedInCurrencies = ["XMR"];
    //htmlForm = ""; // init blank string for now
    baseForm = "";

    constructor() {
        // this.apiUrl = "https://api.mymonero.com:8443/cx";
        // // this.apiVersion = "v3";
        // // this.currencyToExchange = "xmr2btc";
        // this.offer = {};
        // this.offer_type = "";
        // this.order = {};
        // this.orderRefreshTimer = {};
        // this.currentRates = {};
        // this.orderStatus = {};
        // this.exchangeConfiguration = {};
        // //this.fetch = fetch;

        // Fetch form we'll insert into the content view's innerHTML
        this.htmlHelper = new HtmlHelper();
        this.baseForm = this.htmlHelper.getBaseForm();
    }

    walletSelectorElement(walletContextObject) {

    }

    get supportedInCurrencies() {
        return this.supportedInCurrencies;
    }

    get supportedOutCurrencies() {
        return this.supportedOutCurrencies;
    }

    get inCurrencySelector() {
        let selectList = document.createElement('select');
        selectList.id = "inCurrencySelectList";
        for (var i = 0; i < this.supportedInCurrencies.length; i++) {
            var option = document.createElement("option");
            option.value = this.supportedInCurrencies[i];
            option.text = this.supportedInCurrencies[i];
            selectList.appendChild(option);
        }
        console.log(selectList);
        return selectList;
    }

    get outCurrencySelector() {
        let selectList = document.createElement('select');
        selectList.id = "outCurrencySelectList";
        for (var i = 0; i < this.supportedOutCurrencies.length; i++) {
            var option = document.createElement("option");
            option.value = this.supportedOutCurrencies[i];
            option.text = this.supportedOutCurrencies[i];
            selectList.appendChild(option);
        }
        console.log(selectList);
        return selectList;
    }


    
    _setup_walletExchangeOptions(context) {
        
    }

    UnlockedBalance_FormattedString (wallet) { // provided for convenience mainly so consumers don't have to require monero_utils
        const self = this
        const balance_JSBigInt = self.UnlockedBalance_JSBigInt(wallet)
        //return monero_amount_format_utils.formatMoney(balance_JSBigInt)
    }

    UnlockedBalance_JSBigInt (wallet) {
        const self = wallet
        // const difference = self.Balance_JSBigInt().subtract(
        //   self.locked_balance || new JSBigInt(0)
        // )
        // if (difference.compare(0) < 0) {
        //   return new JSBigInt(0)
        // }
        let difference = 5;
        return difference
    }

    walletSelectorTemplate(context) {
        console.log("walletSelectorTemplate invoked");
        let self = this;
        let walletDiv = document.getElementById('wallet-selector');
        if (walletDiv === null) {
            //return;
            
        }

        // get oldest wallet based on how wallets are inserted into wallets as a zero element, changing indexes backwards
        if (walletDiv !== null && walletDiv.dataset.walletchosen == "true") {
            let selectedWallet = document.getElementById('selected-wallet');
            let selectorOffset = selectedWallet.dataset.walletoffset;
            let selectorInt = parseInt(selectorOffset);
            let wallet = self.context.wallets[selectorInt];
            //let walletBalance = document.getElementById('selected-wallet-balance'); 
            //walletBalance.innerText = `${self.UnlockedBalance_FormattedString(context.walletsListController.records[selectorOffset])} XMR   `;
        } else {
            console.log(context.walletsListController);
            let walletOptions = ``;
            let walletRecords = context.walletsListController.records;
            walletRecords.reverse();
            for (let i = 0; i < walletRecords.length; i++) {
                
                let wallet = walletRecords[i];
                let swatch = wallet.swatch.substr(1);
                walletOptions = walletOptions + `
                <div data-walletLabel="${wallet.walletLabel}" data-walletoffset="${i}" data-swatch="${swatch}" data-walletbalance="${self.UnlockedBalance_FormattedString(wallet)}" data-walletid="${wallet._id}" data-walletpublicaddress="${wallet.public_address}" class="hoverable-cell utility optionCell" style="word-break: break-all; height: 66px; position: relative; left: 0px; top: 0px; box-sizing: border-box; width: 100%;">                    
                    <div class="walletIcon medium-32" style="background-image: url('../../../assets/img/wallet-${swatch}@3x.png');"></div>                        
                    <div class="walletLabel">${wallet.walletLabel}</div>
                    <div class="description-label" style="position: relative; box-sizing: border-box; padding: 0px 38px 4px 66px; font-size: 13px; font-family: Native-Light, input, menlo, monospace; font-weight: 100; -webkit-font-smoothing: subpixel-antialiased; max-height: 32px; color: rgb(158, 156, 158); word-break: normal; overflow: hidden; text-overflow: ellipsis; cursor: default;">${self.UnlockedBalance_FormattedString(wallet)} XMR   </div>
                </div>
                `;
            }         
            //console.log('wallet html ran options '+i)
            // get oldest wallet based on how wallets are inserted into wallets as a zero element, changing indexes backwards
            let size = context.walletsListController.records.length;
            size = size - 1;
            let defaultOffset = 0;
            let defaultWallet = context.walletsListController.records[size];
            let walletSelectOptions = `
            <div data-walletoffset="0" data-walletpublicaddress="${defaultWallet.public_address}" data-walletLabel="${defaultWallet.walletLabel}" data-swatch="${defaultWallet.swatch.substr(1)}" data-walletbalance="${self.UnlockedBalance_FormattedString(defaultWallet)}" data-walletid="${defaultWallet._id}" id="selected-wallet" class="hoverable-cell utility selectionDisplayCellView" style="">
                    <div id="selected-wallet-icon" class="walletIcon medium-32" style="background-image: url('../../../assets/img/wallet-${defaultWallet.swatch.substr(1)}@3x.png')"></div>
                    <div id="selected-wallet-label" class="walletName">${defaultWallet.walletLabel}</div>
                    <div id="selected-wallet-balance" class="description-label">${self.UnlockedBalance_FormattedString(defaultWallet)} XMR   </div>
                </div>
                <div id="wallet-options" class="options_containerView">
                    <div class="options_cellViews_containerView" style="position: relative; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 20; overflow-y: auto; max-height: 174.9px;">
                        ${walletOptions}
                    </div>
                </div>
            `;
            //walletDiv.innerHTML = walletSelectOptions;
        }
        return walletSelectOptions;
    }

    htmlFormTemplate() {
        console.log("htmlForm invoked. Let's create a template from that html, then find the currency elements and replace them dynamically")
        let template = document.createElement('template');
        let templateContents = this.baseForm.trim();
        template.innerHTML = templateContents;
        let walletSelector = template.content.getElementById('wallet-selector');
        //console.log(walletSelector);
        let inCurrencySelector = template.content.getElementById('inCurrencySelector');
        inCurrencySelector.appendChild(this.inCurrencySelector);
        let outCurrencySelector = template.content.getElementById('outCurrencySelector');
        outCurrencySelector.appendChild(this.outCurrencySelector);
        console.log(template);
        return template;
        //return this.baseForm;
        //return this.htmlForm;
    }    
}

module.exports = ExchangeHelper