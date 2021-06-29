const monero_amount_format_utils = require('@mymonero/mymonero-money-format')
class HtmlHelper {
    // This class is designed to return a uniform HTML structure that we can leverage in all JS codebases
    constructor() {
        this.baseForm = this.getBaseForm();
        this.baseWalletSelector = this.getBaseWalletSelector();
        this.newEstimatedNetworkFeeString = this.newEstimatedNetworkFeeString;
    }

    getBaseWalletSelector() {
        return `
        
        <div data-walletoffset="0" data-walletpublicaddress="47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9" data-walletlabel="1" data-swatch="6B696B" data-walletbalance="0.00011111" data-walletid="849b2200-991e-11eb-a54c-51789ea8a399" id="selected-wallet" class="hoverable-cell utility selectionDisplayCellView" style="">
                <div id="selected-wallet-icon" class="walletIcon medium-32" style="background-image: url('../../../assets/img/wallet-6B696B@3x.png')"></div>
                <div id="selected-wallet-label" class="walletName">1</div>
                <div id="selected-wallet-balance" class="description-label">0.00011111 XMR   </div>
            </div>
            <div id="wallet-options" class="options_containerView">
                <div class="options_cellViews_containerView" style="position: relative; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 20; overflow-y: auto; max-height: 174.9px;">
                    
            <div data-walletlabel="1" data-walletoffset="0" data-swatch="6B696B" data-walletbalance="0.00060291" data-walletid="849b2200-991e-11eb-a54c-51789ea8a399" data-walletpublicaddress="47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9" class="hoverable-cell utility optionCell" style="word-break: break-all; height: 66px; position: relative; left: 0px; top: 0px; box-sizing: border-box; width: 100%;">                    
                <div class="walletIcon medium-32" style="background-image: url('../../../assets/img/wallet-6B696B@3x.png');"></div>                        
                <div class="walletLabel">1</div>
                <div class="description-label" style="position: relative; box-sizing: border-box; padding: 0px 38px 4px 66px; font-size: 13px; font-family: Native-Light, input, menlo, monospace; font-weight: 100; -webkit-font-smoothing: subpixel-antialiased; max-height: 32px; color: rgb(158, 156, 158); word-break: normal; overflow: hidden; text-overflow: ellipsis; cursor: default;">0.00060291 XMR   </div>
            </div>
            
                </div>
            </div>
        `
    }

    getActivityLoader() {
        return `
        <style>
            #getOfferLoader {
                float: left;
                // min-height: 28px;
            }
            #getOfferLoader div { 
                // display: none; 
            }
            #getOfferLoader {
                padding: 0px 24px 0 0;
                display: none;
            }
            #tx-fee {
                float: right;
            }
            #btc-address {
                clear: both;
            }
        </style>
        <div id="getOffer" class="graphicAndLabel activityIndicators on-normal-background" style="font-family: Native-Light, input, menlo, monospace; -webkit-font-smoothing: subpixel-antialiased; font-size: 10px; letter-spacing: 0.5px; font-weight: 300; color: rgb(158, 156, 158); padding-left: 0px;">
            <div class="loader">
                <div class="block block1"></div>
                <div class="block block2"></div>
                <div class="block block3"></div>
            </div>&nbsp;
            <span id="activityLoaderText">Fetching offer</span>
        </div>`
    }

    getAddressValidationLoader() {
        return `
        <style>
        #addressValidationLoader {
            float: left;
            // min-height: 28px;

        }
        #addressValidationLoader .loader {
            float: left;
        }
        #addressValidationLoaderText {
            float: left;
        }
        .exchange-cross {
            color: #d80000;
            font-size: 18px;
            position: relative;
            top: 2px;
        }
        .exchange-tick {
            color: #00CD00;
            font-size: 18px;
            position: relative;
            top: 2px;
        }
        #addressValidationLoader div { 
            // display: none; 
        }
        #addressValidationLoader {
            padding: 0px 24px 0 0;
            display: none;
        }
        
        </style>
        <div id="addressValidationLoader" class="graphicAndLabel activityIndicators on-normal-background" style="font-family: Native-Light, input, menlo, monospace; -webkit-font-smoothing: subpixel-antialiased; font-size: 10px; letter-spacing: 0.5px; font-weight: 300; color: rgb(158, 156, 158); padding-left: 0px;">
            <div class="loader" id="addressValidationLoaderContainer">
                <div class="block block1"></div>
                <div class="block block2"></div>
                <div class="block block3"></div>
            </div>&nbsp;
            <span id="addressValidationLoaderText">Validating Address</span>
        </div>`
    }

    // TODO: fix imports so that we can leverage this function
    newEstimatedNetworkFeeString(fee_JSBigInt = 0) {
        const self = this
        const estimatedTotalFee_JSBigInt = fee_JSBigInt;
        const estimatedTotalFee_str = monero_amount_format_utils.formatMoney(estimatedTotalFee_JSBigInt)
        const estimatedTotalFee_moneroAmountDouble = parseFloat(estimatedTotalFee_str)
      
        // const estimatedTotalFee_moneroAmountDouble = 0.028
        // Just hard-coding this to a reasonable estimate for now as the fee estimator algo uses the median blocksize which results in an estimate about twice what it should be
        //const displayCcySymbol = self.context.settingsController.displayCcySymbol
        //const finalizable_ccySymbol = displayCcySymbol
        const finalizable_formattedAmountString = estimatedTotalFee_str// `${estimatedTotalFee_moneroAmountDouble}`
        const final_formattedAmountString = finalizable_formattedAmountString
        const final_ccySymbol = 'XMR'
        const displayString = `${final_formattedAmountString}`
        //
        return displayString
      }
      

    getBaseForm() {
        return `
        <div class="exchangeScreen exchange-page-panel">
        <div class="content-container exchange-page-content-container" id="orderForm">
            <div id="server-rates-messages"></div>
            <div id="loader" class="active">
                <!-- gets replaced by loader -->
            </div>
        <div>
            <div id="orderStatusPage">
                <div id="wallet-selector" class="WalletSelectView ListCustomSelectView form_field">
                    <!-- This HTML gets generated by getBaseWalletSelector at generation, and updated by a listener in ECV when the exchange gets rendered (we don't know wallet values before logging in) -->
                    ${this.baseWalletSelector}
                </div>
            <div class="form_field" id="currency-table">
                <table class="full-width">
                    <tr>
                        <td>   
                            <div class="field_title form-field-title">XMR to send
                                <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
                                    <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                    <input id="inCurrencyValue" class="textInput currencyInput" type="text" placeholder="00.00" value="">
                                    <div id="inCurrencySelector"></div>
                                </div>
                                <div id="minimum-fee">
                                    <span id="minimum-fee-text" class="field_title form-field-title" style="margin-top: 8px; color: rgb(158, 156, 158); display: inline-block;">Loading ...</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div id="inInputDiv" class="field_title form-field-title"><span id="outCurrencyTickerCode">BTC</span> you will receive
                                <div class="" style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0">
                                    <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                    <input id="outCurrencyValue" class="textInput currencyInput" type="text" placeholder="00.00" value="">
                                    <div id="outCurrencySelector"></div><div class="selectIndicator" style="right: 12px; top: 33px;"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <input id="in_address" type="hidden" value="">
                </table>
            </div>

            
            <div class="form_field" id="getOfferLoader">
                ${this.getActivityLoader()}
            </div>
            
            <div class="form_field" id="tx-fee">
                <span class="field_title form-field-title" style="margin-top: 8px; color: rgb(158, 156, 158); display: inline-block;">Loading ...</span>
            </div>

            <div class="form_field" id="btc-address">
                <span class="field_title form-field-title" style="margin-top: 17px;">DESTINATION <span id="outCurrencyCoinName">BITCOIN</span> ADDRESS
                </span>
                <div class="contactPicker" style="position: relative; width: 100%; user-select: none;">
                    <input id="outAddress" class="full-width longTextInput" type="text" placeholder="Destination BTC Address" autocomplete="off" autocapitalize="none" spellcheck="false" value="">
                </div>
            </div>
            <div id="localmonero" style="margin-bottom: 6px"><a href="#" id="localmonero-anchor" class="clickableLinkButton">Buy Monero using LocalMonero</a></div>
            <div id="indacoin"><a href="#" id="indacoin-anchor" class="clickableLinkButton">Buy Monero using Indacoin</a></div>
            <div id="getAddressValidationLoader">
                ${this.getAddressValidationLoader()}
            </div>
            <div id="validation-messages"></div>
            <div id="address-messages"></div>
            <div id="server-messages"></div>
        </div>
                
        </div>
        <div id="order-status">

        </div>
    </div>
    <div id="exchangePage">
        <div class="field_title form-field-title">
            <table class="full-width">
                <tr>
                <td colspan="2" style="word-wrap: normal; word-break: normal;">Please note an exchange may take a few minutes to process. <span class="provider-name"></span> are able to provide support for any exchanges. For all issues, please contact <span class="provider-name"></span> with your UUID for assistance.</td>
                </tr>
                <tr>
                    <td>
                        <div class="field_title form-field-title uppercase">
                            <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
                                <span class="field_title form-field-title label-spacing uppercase" style="margin-top: 0px;"><span class="provider-name"></span> UUID</span>
                                <div id="provider_order_id" class="textInput currencyOutput" type="text" placeholder="0.00" style="text-transform: none !important"></div>
                                <div class="currencySelect"><option value="XMR" style="text-align: center;">&nbsp;&nbsp;&nbsp;&nbsp;</option></select> 
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="field_title form-field-title uppercase">Time Remaining
                            <div id="clock">
                                <span id="minutesRemaining"></span>
                                <span>:</span>
                                <span id="secondsRemaining"></span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="field_title form-field-title">Remaining XMR payable
                            <div style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0;">
                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                <div id="in_amount_remaining" class="textInput currencyOutput" type="text" placeholder="0.00">Loading</div>
                                <div class="currencySelect"><option value="XMR" style="text-align: center;">XMR</option>    
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="field_title form-field-title"><span class="outCurrencyTickerCode" id="orderStatusPageCurrencyTicker">BTC</span> to be paid out
                            <div class="" style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0">
                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">AMOUNT</span>
                                <div id="out_amount" class="textInput currencyOutput" type="text">Loading</div>
                                <div class="currencySelect outCurrencyTickerCode">&nbsp;</div>    
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="field_title form-field-title uppercase label-spacing">
                            <div class="" style="position: relative; left: 0px; top: 0px; padding: 2px 0 0 0">
                                <span class="field_title form-field-title label-spacing" style="margin-top: 0px;">Order Status</span>
                                <div class="order-status textInput currencyOutput" id="status"></div>
                                <div class="currencySelect">
                                    <option value="XMR" style="text-align: center;">&nbsp;&nbsp;&nbsp;</option>
                                </div>
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
</div>`
    }

    get supportedOutCurrencies() {
        return this.supportedOutCurrencies;
    }

    get htmlForm() {
        return this.htmlForm;
    }   
}

module.exports = HtmlHelper