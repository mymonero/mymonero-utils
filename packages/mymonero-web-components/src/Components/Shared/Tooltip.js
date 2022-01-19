import {html, css, LitElement } from 'lit';
import {ref, createRef} from 'lit/directives/ref.js';

import tippy from "tippy.js";
import 'tippy.js/dist/tippy.css';

export class Tooltip extends LitElement {
  static get styles() {
    return css`
        .tippy-box {
            color: rgb(17, 187, 236);
            cursor: pointer;
            user-select: none;
            font-size: 10px;
            letter-spacing: 0.5px;
            font-weight: 300;
            width: auto;
            display: inline;
            clear: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            margin: 8px 0px 0px 7px;
            float: none;
            text-decoration: none;
            padding: 8px 8px 10px 8px;
            box-shadow: inset 0 0.5px 0 0 #ffffff;
            border-radius: 5px;
            font-size: 11px;
            line-height: 14px;
            color: #161416;
            font-weight: normal;
            -webkit-font-smoothing: subpixel-antialiased;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            text-shadow: -1px -1px 0px rgb(255 255 255 / 20%);
        }
        .tippy-arrow {
            color: #333;
        }
        span {
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
            margin: 8px 0px 0px 7px;
            float: none;
            text-decoration: none;
        }
    `;
  }

  
  connectedCallback() {
      super.connectedCallback();
      console.log("Bind to tooltip hover / click events")        
    }
    
    async firstUpdated() {
        // Give the browser a chance to paint
        const element = this.inputRef;
        console.log(this.useHTML);
        tippy(element.value, {
            content: this.tooltipContent,
            allowHTML: this.allowHTML,
            theme: "mym"
        })
    }
        
    constructor() {
        super();
        this.clickHandler = this.clickHandler;
        this.inputRef = createRef();
    }
        
    static get properties() {
        return {
            context: Object,
            tooltipHeader: String, 
            tooltipContent: String,
            allowHTML: Boolean
        }
    }
    
    render() {
        return html`
            <span id="tooltipLink" class="clickableLinkButton" ${ref(this.inputRef)}>
                <slot></slot>
            </span>
        `
  }
  
}

try {
    customElements.define('mym-tooltip', Tooltip);
} catch (error) {
    // already defined
}

