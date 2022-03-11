import { html, css, LitElement } from 'lit';
import ExchangeNavigationController from "../Controllers/ExchangeNavigationController";
export default class ExchangeLandingPage extends ExchangeNavigationController(LitElement) {
    static get styles() {
        return css`
            #exchange-landing-page {
                margin-top: 20px;
                touch-action: manipulation !important;
            }
            provider-card {
                touch-action: manipulation !important;
            }
            * {
                touch-action: none;
            }
        `
    }

    connectedCallback() {
        super.connectedCallback();
        this.renderStyles();
        
        this.addEventListener('provider-card-clicked', this.handleProviderCardClicked);
        // const shadow = this.shadowRoot;
        // const childNodes = Array.from(shadow.childNodes);
        // console.log(childNodes);
        // console.log(this);
        // console.log(this.shadowRoot);
        // console.log(this.childNodes);
        // setTimeout(() => {
        //     childNodes.forEach((node, index) => {
        //         // console.log(node);
        //         // console.log(index);
        //         if (typeof(node.id) !== "undefined" && node.id === "exchange-landing-page") {
        //             let cN = node.children;
        //             // console.log("Victory");
        //             // console.log(cN);
        //             Array.from(cN).forEach((childValue, index) => {
        //                 // console.log(childValue);
        //                 if (childValue.nodeName == "PROVIDER-CARD") {
        //                     console.log("Victory 2");
        //                 }
        //                 // console.log("cN AEL")
        //                 childValue.addEventListener('touchstart', (event) => {
        //                     console.log("Touch start");
        //                     console.log(event);
        //                     this.handleAppleClick(event);
        //                 })
        //             });
        //         }
        //     })
        // }, 600);
        
    }
    
    handleAppleClick(event) {
        if (event.srcElement.service.navigationType == 'externalUrl') {
            this.openExternal(this.service.destination);
        } else if (event.srcElement.navigationType == 'internalLink') {
            this.navigateToPage(this.service.destination)
        }
    }

    constructor() {
        super();
        this.clickHandler = this.clickHandler;
        this.context = {};
        this.providerServices = [
            {
                service_provider: "changenow",
                title: "Exchange Monero for other cryptocurrencies (fixed rate)",
                description: `
                    Use a fixed rate when you want to avoid the risk of a fluctuating exchange rate. 
                    Due to the inherent risk, fixed rate exchanges have a higher minimum. 
                    With this method of exchange, you are guaranteed to receive the amount you are quoted.`,
                navigationType: "internalLink",
                destination: "changenowFixedRateView"
            },
            { 
                service_provider: "guardarian",
                title: "Buy Monero using fiat currency",
                description: `
                    No Monero? No problem! Seamlessly purchase Monero using your debit / credit card, and get your purchased Monero automatically paid into your wallet.`,
                navigationType: "internalLink",
                destination: "changenowBuyWithFiatView"
            },
            {
                service_provider: "localmonero",
                title: "Buy Monero using LocalMonero",
                description: `
                    LocalMonero is a marketplace that allows you to buy and sell Monero person-to-person. They act as an escrow service, ensuring that deals between buyers and sellers are concluded safely`,
                
                navigationType: "externalUrl",
                destination: "https://localmonero.co?rc=h2t1",
            }
        ];
    }
    
    static get properties() {
        return {
          context: Object,
        }
      }

    handleProviderCardClicked(event) {
        if (event.detail.navigationType == 'externalUrl') {
            this.openExternal(event.detail.destination);
        } else if (event.detail.navigationType == 'internalLink') {
            this.navigateToPage(event.detail.destination)
        }
    }
    
    openClickableLink(event, context) {
        // We need to determine whether we're invoking this via Electron or via a browser, and adjust accordingly
        let referrer_id = event.srcElement.getAttribute("referrer_id");
        let url = event.srcElement.getAttribute("url");
        let paramStr = event.srcElement.getAttribute("param_str");
        if (typeof(this.context.shell) !== "undefined") { // Electron passes the shell variable as part of context
            if (referrer_id.length > 0) {
                let urlToOpen = url + "?" + paramStr + "=" + referrer_id;
                context.shell.openExternal(urlToOpen);
            } else {
                context.shell.openExternal("https://localmonero.co");
            }
        } else { // Web (and Capacitor?) codebase
            if (referrer_id.length > 0) {
                let urlToOpen = url + "?" + paramStr + "=" + referrer_id;
                window.open(urlToOpen);
            } else {
                window.open("https://localmonero.co");
            }
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

    handleTouchEvent(event) {
        console.log("Handle click event");
        console.log(event);
    }

    handleClickEvent(event) {
        console.log("Handle click event");
        console.log(event);
    }

    render() {

        let i = 0;
        return html`
        <div id="exchange-landing-page">
            ${this.providerServices.map((service, index) => {
                return html`<provider-card .service=${service} .context=${this.context} @click="${this.handleClickEvent}"></provider-card>`
            })}            
        </div>
        `;
    }

}

try {
    customElements.define('exchange-landing-page', ExchangeLandingPage);
} catch (error) {
    // already defined
}