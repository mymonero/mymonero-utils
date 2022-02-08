import { html, css, LitElement } from 'lit';
//import ExchangeNavigationController from "../../../mymonero-page-templates";

export class ExchangeServiceProviderCard extends LitElement {
  static get styles() {
    return css`
    * {
      touch-action: none;
    }
        .provider-card {
            position: relative;
            top: 0px;
            width: calc(100% - 30px);
            min-height: 80px;
            height: auto;
            background: rgb(56, 54, 56);
            box-shadow: rgb(22 20 22) 0px 0.5px 1px 0px, rgb(73 71 73) 0px 0.5px 0px 0px inset;
            border-radius: 5px;
            overflow: hidden;
            margin: 0 auto 10px auto;
        }

        .hoverable-cell {

        }
        .title-label {
            position: relative; box-sizing: border-box; padding: 8px 38px 4px 80px; 
            // display: block; 
            word-break: break-word; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; -webkit-font-smoothing: subpixel-antialiased; font-size: 12px; font-weight: 400; letter-spacing: 0.5px; color: rgb(252, 251, 252); cursor: default;
            margin-left: 50px;
            text-align: left;
        }
        .description-label { 
            position: relative;
            box-sizing: border-box;
            padding: 0px 38px 10px 80px;
            font-size: 13px;
            font-family: Native-Light, input, menlo, monospace;
            font-weight: 100;
            -webkit-font-smoothing: subpixel-antialiased;
            min-height: 32px; color: rgb(158, 156, 158); word-break: normal; overflow: hidden; text-overflow: ellipsis; cursor: default;
            margin-left: 50px;
            text-align: left;
        }
        .provider-logo {
            height: 48px;
            min-width: 48px;
            // display: block;
            position: absolute; 
            left: 6px; 
            top: 16px;
        }
        div.localmonero-logo {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='MuiSvgIcon-root' focusable='false' viewBox='0 0 546.45 546.45' aria-hidden='true' style='margin-left:0px;width:50px;height:50px;transition:margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'%3E%3Cpath fill='%231565C0' d='M149.385 505.172c-5.5 0-12.25-3.897-15-8.66L10.874 282.584c-2.75-4.763-2.75-12.557 0-17.32L134.385 51.336c2.75-4.763 9.5-8.66 15-8.66h247.021c5.5 0 12.25 3.897 15 8.66l123.512 213.928c2.75 4.763 2.75 12.558 0 17.32L411.407 496.512c-2.75 4.763-9.5 8.66-15 8.66H149.385z'%3E%3C/path%3E%3Cpath fill='%230D47A1' d='M396.771 505.176h-67.624L184.898 360.925l-3.178-8.881 101.343 39.38 74.5-39.166 26-77.667-3.5-35.167-20.082-50.082 145.036 145.035-.896 1.55-62.737 108.664-29.779 51.58s-.695 1.373-2.146 2.94c-2.094 2.265-7.42 6.065-12.688 6.065z'%3E%3C/path%3E%3Cpath fill='%23E3F2FD' d='M272.896 398.424c-67.822 0-123-55.178-123-123s55.178-123 123-123 123 55.178 123 123-55.178 123-123 123zm0-224c-55.691 0-101 45.309-101 101s45.309 101 101 101 101-45.309 101-101-45.309-101-101-101z'%3E%3C/path%3E%3Cpath fill='%23E3F2FD' d='M181.729 335.927h49v-52l42.167 42.996 41.973-43.877v52.75l47.911.131 14.391-14.392v-5.274l-40.637.132v-86.1l-63.638 66.631-63.875-66.5v86.001l-32.792.002z'%3E%3C/path%3E%3C/svg%3E");
            left: 38px;
        }
        div.changenow-logo {
            //background-image: url("/src/assets/img/ChangeNow120x69.jpg");
            background-image: url("data:image/jpeg;base64,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");
            top: 4px;
            width: 120px;
            height: 69px;
        }
        @media screen and (max-width: 548px) {
          .description-label {
            padding: 0px 10px 10px 0px !important;
            margin-top: 10px !important;
            margin-left: 10px !important;
            text-align: justify !important;
            line-height: 14px !important;
            font-size: 12px !important;
            max-width: 100% !important;
          }
          .title-label {
            padding: 0px 10px 10px 0px !important;
            margin-top: 80px !important;
            margin-right: 10px !important;
            border-top: 1px solid #CDCDCD !important;
            padding-top: 10px !important;
            max-width: 100% !important;
            margin-left: 10px !important;
          }
          .changenow-logo, .localmonero-logo {
            width: 100% !important;
            height: 69px !important;
            background-position: top !important;
            background-repeat: no-repeat !important;
            left: 0px !important;
          }
          .localmonero-logo {
            top: 4px !important;
            height: 65px !important;
          }
          .provider-card {
            left: 0px !important;
            max-width: calc(100% - 16px);
            margin: 0 auto 10px auto !important;
          }
          .provider-card .description-label, .provider-card .title-label {
            font-size: 12px !important;
            color: #ffffff;
            line-height: 14px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important; 
          }
        }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.addEventListener('touchstart', () => {
      console.log("PC: Touch start");
    });

    this.addEventListener('touchend', () => {
        console.log("PC: Touch end");
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleClickEvent(event) {
    //let selectObject = this.selectedElement;
    let options = {
      detail: this.service,
      bubbles: true,
      composed: true
    };
    let providerCardClickedEvent = new CustomEvent("provider-card-clicked", options)
    this.dispatchEvent(providerCardClickedEvent, options);
    // console.log("Dispatch click event from provider card:", event);
  }


  openExternal(url) {
    // Determine whether we're running as a browser (existence of window.location)
    if (typeof(window.location) !== 'undefined') {
      window.open(url, "_blank");
    } else if (typeof(global) !== "undefined") {

    }
  }

  static get properties() {
    return {
      providerServices: { type: Array },
      context: { type: Object },
      service: { type: Object }
    }
  }

  constructor() {
    super();
    this.service = {};
    this.context = {};
    this.destinationView = "";
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    // We still need to flesh this out for clicks
    root.addEventListener('click', (event) => { 
      console.log('click from PC'); 
      this.shadowName = event.target.localName 
    });
    root.addEventListener('touchend', (event) => { 
      let options = {
        detail: this.service,
        bubbles: true,
        composed: true
      };
      let providerCardClickedEvent = new CustomEvent("provider-card-clicked", options)
      this.dispatchEvent(providerCardClickedEvent, options);
    });
    return root;
  }

  render() {
    return html` 
        <div class="provider-card" @click=${this.handleClickEvent} ontouchstart=${this.handleClickEvent}>
             <div class="utility">
                 <div class="${this.service.service_provider}-logo provider-logo">

                 </div>
             </div>    
             <div class="title-label">${this.service.title}</div>
             <div class="description-label">${this.service.description}</div>
         </div>`

    // return html`
    //     <div class="provider-card">
    //         <div class="hoverable-cell utility">
    //             <div class="changenow-logo provider-logo">

    //             </div>
    //         </div>    
    //         <div class="title-label">Exchange Monero for other cryptocurrencies (floating rate)</div>
    //         <div class="description-label">Exchange your Monero for any of a number of cryptocurrencies using ChangeNow's floating rate exchange. The floating rate allows you to exchange smaller amounts of Monero than fixed rates. With this method of exchange, due to the volitility of cryptocurrency, you may receive an amount that is slightly different to what you expect.</div>
    //     </div>
    //     <div class="provider-card">
    //         <div class="hoverable-cell utility">
    //             <div class="localmonero-logo provider-logo">

    //             </div>
    //         </div>    
    //         <div class="title-label">Buy Monero with LocalMonero</div>
    //         <div class="description-label">LocalMonero is a marketplace that allows a user to buy and sell their Monero to others.</div>
    //     </div>
    // `;
  }

}

/*

*/

try {
  customElements.define('provider-card', ExchangeServiceProviderCard);
} catch (error) {
  // already defined
}

