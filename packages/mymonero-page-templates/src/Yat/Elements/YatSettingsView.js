import {html, css, LitElement } from 'lit';
import Swal from 'sweetalert2';

export class YatSettingsView extends LitElement {
    static get styles() {
        return css`
            .clickable-link {
                color: rgb(17, 187, 236); 
                cursor: pointer; 
                user-select: none; 
                font-family: Native-Light, input, menlo, monospace; 
                -webkit-font-smoothing: subpixel-antialiased; 
                font-size: 10px; 
                letter-spacing: 0.5px; 
                font-weight: 300; 
                width: auto; 
                display: inline; 
                clear: none; 
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0); 
                float: none;
                text-transform: uppercase;
            }
            .field-title {
                text-transform: uppercase;
                user-select: none;
                display: block;
                text-align: left;
                color: rgb(248, 247, 248);
                font-family: Native-Regular, input, menlo, monospace;
                font-size: 11px;
                font-weight: lighter;
            }
            div {
                padding: 12px 0px 12px 33px;
            }
        `;
    }

  
    connectedCallback() {
        super.connectedCallback();
        this.wallets = this.context.walletsListController.records;
        // this.partnerPath = "https://y.at/partner/mymonero"
        this.partnerPath = "https://yat.fyi/partner/mymonero"
    }
        
    constructor() {
        super();
        // this.clickHandler = this.clickHandler;
        // this.inputRef = createRef();
    }
        
    static get properties() {
        return {
            context: Object,
            partnerPath: String,
            wallets: Array
        }
    }
    
    openExternal(url) {
        // Check whether we're on desktop, or web and Android
        if (typeof(this.context.shell) !== "undefined") { // Electron passes the shell variable as part of context            
            this.context.shell.openExternal(url);            
        } else { // Web (and Capacitor?) codebase            
            window.open(url, "_blank");
        }
    }

    handleBuyAYatClickEvent() {
        // Params:
        // addresses:
        // eid: 
        // refresh_token:  User's refresh token that was received in the response body of redirection to Yat web or as a deep link query parameter in redirection from Yat web in Get a Yat (Flow 1A).
        let partnerPath = this.partnerPath;
        
        // 1. Get refresh token
        // 2. Create URL
        // 3. openExternal(url)
        // Uncomment the next line once we have proper Yat management functionality in the core wallet experience
        // let addressString = `0x1001=${this.context.walletsListController.records[0]}`
        this.openExternal(partnerPath);
    }

    async handleConnectAYatClickEvent() {
        // params:
        // eid
        // refresh_token:  User's refresh token that was received in the response body of redirection to Yat web or as a deep link query parameter in redirection from Yat web in Get a Yat (Flow 1A).
        // addresses: 
        
        if (this.context.walletsListController.records.length > 0) {
            let refresh_token = "placeholder";
        let walletsString;
        let inputObj = {};
        this.wallets.forEach((wallet) => {
            console.log(wallet);
            inputObj[wallet.public_address] = wallet.walletLabel;
            walletsString += `<option value='${wallet.public_address}'>${wallet.walletLabel}</option>`
        })

        let html = `
            <select>
                ${walletsString}
            </select>
        `;

        const { value: address } = await Swal.fire({
            input: 'select',
            inputOptions: inputObj,
            inputPlaceholder: 'Select a wallet to link to your Yat handle',
            showCancelButton: true,
            title: 'Please select a wallet to connect to',
            background: "#272527",
            titleColor: "#FFFFFF",
            color: "#FFFFFF",
            confirmButtonColor: "#11bbec",
            confirmButtonText: 'Connect a Yat',
            cancelButtonText: 'Close',
            showCloseButton: true,
            showCancelButton: true,
            inputOptions: inputObj,
            inputPlaceholder: 'Select a wallet',
            showCancelButton: true,
            inputValidator: (value) => {
                console.log(value);
            return new Promise((resolve) => {
                console.log(value);
                if (value !== '') {
                resolve()
                } else {
                resolve('You need to select a wallet')
                }
            })
            },
            customClass: {
                confirmButton: 'base-button hoverable-cell navigation-blue-button-enabled action right-save-button',
                cancelButton: 'base-button hoverable-cell navigation-blue-button-enabled action right-save-button disabled navigation-blue-button-disabled'
            }
        })
            
            if (address) {
                let addressString = encodeURIComponent(`0x1001=${address}`);
                let refreshToken = "todolol"
                let partnerPath = `https://y.a.bblat/partner/{partner_path}/link-email?addresses=${addressString}&refresh_token=${refreshToken}`
                this.openExternal(partnerPath);
            }
            
            // const { value: wallet_address } = await Swal.fire({
			// 	title: 'Please select a wallet to connect to',
			// 	html: html,
			// 	background: "#272527",
			// 	titleColor: "#FFFFFF",
			// 	color: "#FFFFFF",
			// 	confirmButtonColor: "#11bbec",
			// 	confirmButtonText: 'Connect a Yat',
			// 	cancelButtonText: 'Close',
			// 	showCloseButton: true,
            //     showCancelButton: true,
            //     inputOptions: inputObj,
            //     inputPlaceholder: 'Select a fruit',
            //     showCancelButton: true,
            //     inputValidator: (value) => {
            //         console.log(value);
            //         return new Promise((resolve) => {
            //             if (typeof(value) !== "undefined") {
            //                 resolve()
            //             } else {
            //                 resolve('Broken')
            //             }
            //         })
            //     },
			// 	customClass: {
			// 		confirmButton: 'base-button hoverable-cell navigation-blue-button-enabled action right-save-button',
			// 		cancelButton: 'base-button hoverable-cell navigation-blue-button-enabled action right-save-button disabled navigation-blue-button-disabled'
            //     },
            // });

            // if (wallet_address) {

            //     console.log(wallet_address);
            //     Swal.fire(`You selected: ${wallet_address}`)
            // }
        } else if (this.context.walletsListController.records.length === 1) {
            // immediate redirect
            let addressString = `0x1001=${this.wallets.records[0]}`
            let partnerPath = `https://y.at/partner/{partner_path}/link-email`
            this.openExternal(partnerPath);    
        } else {
            // please log into wallet
        }
    }

    handleManageAYatClickEvent() {
        // refresh_token:  User's refresh token that was received in the response body of redirection to Yat web or as a deep link query parameter in redirection from Yat web in Get a Yat (Flow 1A).
        // addresses: YAT_TAG_1=ADDRESS_1|YAT_TAG_2=ADDRESS_2|...|YAT_TAG_N=ADDRESS_N
        let partnerPath = "https://y.at/partner/{partner_path}/manage"
        this.openExternal(partnerPath);
    }

    render() {
        return html`
            <!-- <div style="">
                <a class="clickableLinkButton">ABOUT MYMONERO</a>
            </div> -->
            <div class="form-field">
                <span class="field-title">
                    <!-- Yat<mym-tooltip allowHTML="true" tooltipContent="Yat lets you use emojis as your universal username and identity on the internet.">?</mym-tooltip> -->
                    Yat
                </span>
            </div>
            <div>
                <a id="buy-a-yat" class="clickable-link" @click=${this.handleBuyAYatClickEvent}>Buy a Yat</a>            
            </div>
            <!-- <div>
                <a id="connect-a-yat" class="clickable-link" @click=${this.handleConnectAYatClickEvent}>Connect a Yat</a>
            </div>
            <div>
                <a id="manage-a-yat" class="clickable-link" @click=${this.handleManageAYatClickEvent}>Manage Yats</a>
            </div> -->
        `
    }  
}

try {
    customElements.define('mym-yat-settings-view', YatSettingsView);
} catch (error) {
    // already defined
}



