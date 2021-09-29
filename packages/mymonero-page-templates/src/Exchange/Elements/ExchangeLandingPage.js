import { html, css, LitElement } from 'lit';
import ExchangeNavigationController from "../Controllers/ExchangeNavigationController";

export default class ExchangeLandingPage extends ExchangeNavigationController(LitElement) {

    connectedCallback() {
        super.connectedCallback();
        console.log("ELP Template view connected to DOM");
        // TODO: disable fiat options if fiat api status returns an error
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
                service_provider: "changenow",
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
        this.addEventListener('provider-card-clicked', this.handleProviderCardClicked);
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
    
    openExternal(url) {
        // Determine whether we're running as a browser (existence of window.location)
        if (typeof(window.location) !== 'undefined') {
          window.open(url, "_blank");
        } else if (typeof(global) !== "undefined") {
    
        }
    }

    render() {
        return html`
        <div id="exchange-landing-page">
            <div></div>
            ${this.providerServices.map((service) => {
                //return html`<provider-card .service=${service} .context=${this.context} @click=${this.clickHandler}></provider-card>`
                return html`<provider-card .service=${service} .context=${this.context}></provider-card>`
            })}            
            </div>
        </div>
        `;
    }

}

customElements.define('exchange-landing-page', ExchangeLandingPage);