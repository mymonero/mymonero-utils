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
        div.guardarian-logo {
          top: 10px !important;
          left: 33px;
          width: 65px;
          height: 65px;
          background: url(data:image/png;base64,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PSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDo5ZWJmM2Q1OC03Y2QzLTQ2NDQtOGRiMi01MWZlZjliMTIyZmQiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTA0Y2QxYWEtMDJkMi00YzY1LTkzMTktZTFkNjE4ODY2YWFjIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NzY2YmQ3MmItNDgzYi00NzNkLTlmYjYtN2FhOWY0Y2UwZTE2IgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJNYWMgT1MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjQ2MDQxMDc0Mjg0MzA3IgogICBHSU1QOlZlcnNpb249IjIuMTAuMjIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCI+CiAgIDxpcHRjRXh0OkxvY2F0aW9uQ3JlYXRlZD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkxvY2F0aW9uQ3JlYXRlZD4KICAgPGlwdGNFeHQ6TG9jYXRpb25TaG93bj4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgIDxpcHRjRXh0OkFydHdvcmtPck9iamVjdD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkFydHdvcmtPck9iamVjdD4KICAgPGlwdGNFeHQ6UmVnaXN0cnlJZD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjljM2I5NTg0LWFkYmQtNDcxNS1hM2M3LTM1NzE2NTM4YmFlZSIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChNYWMgT1MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTAyLTI4VDExOjM3OjU0KzAyOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICAgPHBsdXM6SW1hZ2VTdXBwbGllcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkltYWdlU3VwcGxpZXI+CiAgIDxwbHVzOkltYWdlQ3JlYXRvcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkltYWdlQ3JlYXRvcj4KICAgPHBsdXM6Q29weXJpZ2h0T3duZXI+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpDb3B5cmlnaHRPd25lcj4KICAgPHBsdXM6TGljZW5zb3I+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpMaWNlbnNvcj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pq2kXJ4AAAAGYktHRAAAAMYA/0FjvgAAAAAJcEhZcwAACxIAAAsS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);
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
          .changenow-logo, .localmonero-logo, .guardarian-logo {
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
      let options = {
        detail: this.service,
        bubbles: true,
        composed: true
      };
      let providerCardClickedEvent = new CustomEvent("provider-card-clicked", options)
      this.dispatchEvent(providerCardClickedEvent, options);
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

