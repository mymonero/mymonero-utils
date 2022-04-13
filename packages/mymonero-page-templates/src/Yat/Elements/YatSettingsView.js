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
        this.partnerPath = "https://y.at/partner/mymonero" // Live url
        // this.partnerPath = "https://yat.fyi/partner/mymonero" // debug url
    }
        
    constructor() {
        super();
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
        
        // Uncomment the next line once we have proper Yat management functionality in the core wallet experience
        let addressString = `0x1001=${this.context.walletsListController.records[0].public_address}`
        partnerPath += `?${addressString}`
        if (this.context.refresh_token !== undefined) {
            partnerPath += "&refresh_token=" + this.context.refresh_token
        }
        this.openExternal(partnerPath);
    }

    async handleConnectAYatClickEvent() {
        // params:
        // eid
        // refresh_token:  User's refresh token that was received in the response body of redirection to Yat web or as a deep link query parameter in redirection from Yat web in Get a Yat (Flow 1A).
        // addresses: 
        if (this.context.walletsListController.records.length > 0) {
            let walletsString;
            let inputObj = {};
            this.wallets.forEach((wallet) => {
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
                this.context.walletsListController.addressToLink = address;
                let addressString = encodeURIComponent(`0x1001=${address}`);
                let partnerPath = this.partnerPath + "/manage?addresses=" + addressString;
                if (this.context.refresh_token !== undefined) {
                    let refresh_token = this.context.refresh_token;
                    partnerPath += "&refresh_token=" + refresh_token;
                }
                this.openExternal(partnerPath);
            }
        } else if (this.context.walletsListController.records.length === 1) {
            // immediate redirect
            this.context.walletsListController.addressToLink = this.wallets.records[0];
            let addressString = `0x1001=${this.wallets.records[0]}`
            let partnerPath = this.partnerPath + "/manage?addresses=" + addressString;
            if (this.context.refresh_token !== undefined) {
                let refresh_token = this.context.refresh_token;
                partnerPath += "&refresh_token=" + refresh_token;
            }
            this.openExternal(partnerPath);    
        } else {
            throw new Error("Cannot link a Yat when zero wallets exist");
        }
    }

    createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this;
        root.addEventListener('click', (e) => { 
            if (e.target.id == "buy-a-yat") {
                this.handleBuyAYatClickEvent()
            }
            if (e.target.id == "connect-a-yat") {
                this.handleConnectAYatClickEvent();
            }
        });

        root.addEventListener('touchend', async (e) => { 
            if (e.target.id == "buy-a-yat") {
                this.handleBuyAYatClickEvent(e)
            }
            if (e.target.id == "connect-a-yat") {
                console.log(this.handleConnectAYatClickEvent)
                let test = await this.handleConnectAYatClickEvent();
            }
        });
        return root;
    }

    render() {
        return html`
            <!-- <div style="">
                <a class="clickableLinkButton">ABOUT MYMONERO</a>
            </div> -->
            <div class="form-field">
                <span class="field-title">
                    Yat
                </span>
            </div>
            <div id="buy-a-yat">
                <a class="clickable-link">Buy a Yat</a>            
            </div>
            <div id="connect-a-yat">
                <a class="clickable-link">Connect / Manage your Yat(s)</a>
            </div>
        `
    }  
}

try {
    customElements.define('mym-yat-settings-view', YatSettingsView);
} catch (error) {
    // already defined
}