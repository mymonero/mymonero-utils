import {html, css, LitElement } from 'lit';
import tippy from "tippy.js";
// For backwards-compatibility with CommonJS (desktop MyMonero), instead of doing `import 'tippy.js/dist/tippy.css'`, we incorporate the tippy dist CSS in our component

export class Tooltip extends LitElement {
  static get styles() {
    return css`
        .tippy-box[data-animation=fade][data-state=hidden]{opacity:0}[data-tippy-root]{max-width:calc(100vw - 10px)}.tippy-box{position:relative;background-color:#333;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;white-space:normal;outline:0;transition-property:transform,visibility,opacity}.tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}.tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.tippy-box[data-placement^=left]>.tippy-arrow{right:0}.tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.tippy-box[data-placement^=right]>.tippy-arrow{left:0}.tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{width:16px;height:16px;color:#333}.tippy-arrow:before{content:"";position:absolute;border-color:transparent;border-style:solid}.tippy-content{position:relative;padding:5px 9px;z-index:1}
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
    }
    
    async firstUpdated() {
        // Give the browser a chance to paint
        let shadowRoot = this.shadowRoot;
        let tooltipElement = shadowRoot.getElementById("tooltipLink");
        tippy(tooltipElement, {
            content: this.tooltipContent,
            allowHTML: this.allowHTML,
            theme: "mym"
        })
    }
        
    constructor() {
        super();
        this.clickHandler = this.clickHandler;
    }
        
    static get properties() {
        return {
            context: Object,
            tooltipContent: String,
            allowHTML: Boolean
        }
    }
    
    render() {
        return html`
            <span id="tooltipLink" class="clickableLinkButton">
                <slot></slot>
            </span>
        `
  }
  
}

try {
    customElements.define('mym-tooltip', Tooltip);
} catch (error) {
    // mym-tooltip is already defined by some other npm package
}

