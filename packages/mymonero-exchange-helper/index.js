const HtmlHelper = require("./HtmlHelper");
const WalletHelper = require("./WalletHelper")
const html = require("./HtmlHelper")
const EventListeners = require("./EventListeners")
const TimerHelper = require('./TimerHelper');
const CurrencyMetadata = require('./CurrencyMetadata')
const monero_amount_format_utils = require('@mymonero/mymonero-money-format')
const JSBigInt = require('@mymonero/mymonero-bigint')
const ErrorHelper = require("./ErrorHelper")
const InitialiseExchange = require("./initialiseExchange")
const ExchangeFunctions = require("@mymonero/mymonero-exchange")
const exchangeFunctions = new ExchangeFunctions();

class ExchangeHelper {
    // We declare these in this module so that we don't tightly couple currencies to the REST API module
    supportedOutCurrencies = ["BTC", "ETH", "LTC"]
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
        // These declarations make these functions accessible publically
        this.htmlHelper = new HtmlHelper();
        this.baseForm = this.htmlHelper.getBaseForm();
        this.eventListeners = EventListeners;
        this.timerHelper = TimerHelper;
        this.currencyMetadata = CurrencyMetadata;
        this.errorHelper = ErrorHelper;
        this.openClickableLink = this.openClickableLink;
        this.isValidKey = this.isValidKey;
        this.setSendingFee = this.setSendingFee;
        this.renderWalletSelector = this.renderWalletSelector;
        this.initialiseExchangeHelper = InitialiseExchange;
        this.doInit = this.doInit;
        this.exchangeFunctions = exchangeFunctions;
        this.handleSendFundsResponseCallback = this.handleSendFundsResponseCallback;
        this.sendFundsValidationStatusCallback = this.sendFundsValidationStatusCallback;
    }

    doInit(context) {
        const self = this;
        console.log(this);
        console.log(self);
        InitialiseExchange(context, self);
    }

    renderWalletSelector(walletRecords, elemToSet) {
        if (walletRecords.length > 0) {
          let walletHtml = this.walletSelectorTemplate(walletRecords)
          let walletSelector = elemToSet;
          walletSelector.innerHTML = walletHtml;
        }   
      }

    setSendingFee(feeString, elemToSet) {
        elemToSet.dataset.txFee = feeString;
        elemToSet.innerHTML = `<span class="field_title form-field-title" style="margin-top: 8px; color: rgb(158, 156, 158); display: inline-block;">+ ${feeString} XMR EST. FEE</span>`
    }

    walletSelectorElement(walletContextObject) {

    }

    // This function is invoked to update the order status page
    renderOrderStatus (order) {
        const idArr = [
          'in_amount_remaining',
          'out_amount',
          'status',
          'expires_at',
          'provider_order_id',
          'in_address',
          'in_amount'
        ]

        const test = document.getElementById('exchangePage')
        if (!(test == null)) {
            idArr.forEach((item, index) => {
            if (item == 'in_address') {
                document.getElementById('receiving_subaddress').innerHTML = order[item]
            } else {
                document.getElementById(item).innerHTML = order[item]
            }
            })
        }
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
        selectList.classList.add('currencySelect');
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
        selectList.classList.add('currencySelect');
        for (var i = 0; i < this.supportedOutCurrencies.length; i++) {
            var option = document.createElement("option");
            option.value = this.supportedOutCurrencies[i];
            option.text = this.supportedOutCurrencies[i];
            selectList.appendChild(option);
        }
        console.log(selectList);
        return selectList;
    }

    // Returns true / false based on key array
    isValidKey(event, allowableKeyArray) {
        if (allowableKeyArray.includes(event.which)) {
            return true
        }
        return false
    }
    
    _setup_walletExchangeOptions(context) {
        
    }
 
    UnlockedBalance_FormattedString = function(wallet) { // provided for convenience mainly so consumers don't have to require monero_utils
        const self = this
        const balance_JSBigInt = self.UnlockedBalance_JSBigInt(wallet)
        return monero_amount_format_utils.formatMoney(balance_JSBigInt)
    }

    UnlockedBalance_JSBigInt = function(wallet) {
        const self = wallet
        const difference = self.Balance_JSBigInt().subtract(
          self.locked_balance || new JSBigInt(0)
        )
        console.log("UnlockedBalance:", difference);
        if (difference.compare(0) < 0) {
          return new JSBigInt(0)
        }
        return difference
    }

    Balance_JSBigInt = function(wallet) {
        const self = this
        let total_received = wallet.total_received
        let total_sent = wallet.total_sent
        if (typeof total_received === 'undefined') {
          total_received = new JSBigInt(0) // patch up to avoid crash as this doesn't need to be fatal
        }
        if (typeof total_sent === 'undefined') {
          total_sent = new JSBigInt(0) // patch up to avoid crash as this doesn't need to be fatal
        }
        const balance_JSBigInt = total_received.subtract(total_sent)
        if (balance_JSBigInt.compare(0) < 0) {
          return new JSBigInt(0)
        }
        return balance_JSBigInt
    }

    // we should refactor this to return a template instead of HTML
    walletSelectorTemplate(walletList) {
        console.log(this);
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
            console.log("Wallet balance a: ");
            console.log(self.UnlockedBalance_FormattedString(walletList));
            walletBalance.innerText = `${self.UnlockedBalance_FormattedString(walletList[selectorOffset])} XMR   `;
        } else {
            console.log(walletList);
            let walletOptions = ``;
            let walletRecords = walletList;
            walletRecords.reverse();
            
            for (let i = 0; i < walletRecords.length; i++) {
                console.log("Wallet balance b: ");
                
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
            let size = walletList.length;
            size = size - 1;
            let defaultOffset = 0;
            let defaultWallet = walletList[size];
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
            return walletSelectOptions;
            //walletDiv.innerHTML = walletSelectOptions;
        }
        return walletDiv;
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

    sendFundsValidationStatusCallback (str) {
        const monerodUpdates = document.getElementById('monerod-updates')
        monerodUpdates.innerText = str
    }

    handleSendFundsResponseCallback(err, mockedTransaction) {
        let str
        const monerodUpdates = document.getElementById('monerod-updates')
        if (err) {
          str = typeof err === 'string' ? err : err.message
          monerodUpdates.innerText = str
          return
        }
        str = 'Sent successfully.'
        monerodUpdates.innerText = str
    }

    // TODO: Pass this function parameters, use those parameters, determine runtime context, open based on runtime context (shell.openExternal for Electron, window.location for web, etc)
    openClickableLink() {
        // We need to determine whether we're invoking this via Electron or via a browser, and adjust accordingly
        const self = this;
        let referrer_id = self.getAttribute("referrer_id");
        let url = self.getAttribute("url");
        let paramStr = self.getAttribute("param_str");
        if (referrer_id.length > 0) {
            console.log("Got a referrer -- generate custom URL");
            let urlToOpen = url + "?" + paramStr + "=" + referrer_id;
            shell.openExternal(urlToOpen);
        } else {
            console.log("No referrer");
            shell.openExternal("https://localmonero.co");
        }
    }

}

module.exports = ExchangeHelper