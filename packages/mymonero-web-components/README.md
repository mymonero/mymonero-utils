#MyMonero Web Components plugin
<p align="center">
  <img alt="MyMonero" src="https://user-images.githubusercontent.com/1645428/146000939-b06f8fd3-9ed2-4a5e-bdd6-3981281dde9c.png">
</p>

<p align="center">
  <a href="https://github.com/mymonero/mymonero-utils/actions?query=branch%3Amaster+workflow%3Aci"><img alt="CI Status" src="https://github.com/mymonero/mymonero-utils/workflows/ci/badge.svg?branch=master"></a>
  <a href="https://snyk.io/test/github/mymonero/mymonero-utils"><img src="https://snyk.io/test/github/mymonero/mymonero-utils/badge.svg"></a>
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/License-BSD%203--Clause-blue.svg"></a>
  <a href="https://codecov.io/gh/mymonero/mymonero-utils">
    <img src="https://codecov.io/gh/mymonero/mymonero-utils/branch/master/graph/badge.svg?token=YCDBLLJJEP"/>
  </a>
</p>

This npm module is a collection of [Lit-based](https://lit.dev) web components. These components are used by the desktop, Android and web versions of the [MyMonero wallet](https://github.com/mymonero/mymonero-app-js).

The package is comprised of the following components:

- Activity Indicator `<activity-indicator>` - A generic, customisable activity indicator component
- Provider Card `<provider-card>` - A UI component used to display MyMonero's various Exchange service providers
- Searchable Select `<searchable-select>` - A dropdown-based searchable select web component
- Wallet Selector `<wallet-selector>` - A component that renders a list of XMR wallets

# Installation

`npm i @mymonero/mymonero-web-components`

Usage

To make use of these components, import this module the same way you would a normal NPM package.

In your javascript file:

`require('@mymonero/mymonero-web-components');`

This will register the web component custom element tags, making them available for use in your HTML DOM

Then, in your HTML, use any of the custom elements like so:

`<activity-indicator></activity-indicator>`

## Detailed usage documentation
---
### Activity Indicator

Shows an animated indicator alongside an optional text message.

`<activity-indicator .loadingText=${"Loading supported currencies"}></activity-indicator>`

Suggested usage of this element would include a conditional expression to specify whether it should be hidden or not. For example:

`<activity-indicator ?hidden=${this.hideActivityIndicator}></activity-indicator>`

 

---
### Provider Card

`<provider-card .service=${service}></provider-card>`

.service should be a JSON object in the following format:

 

    {

        service_provider: "localmonero",
        title: "Buy Monero using LocalMonero",
        description: "Long description text"
    }



---
### Searchable Select 

A drop-down based select input field. Pass a list of your values in the following format:

    [
        {
            label: "Text to show inside <option> tag", 
            value: "Value for `<option value=${value}>`"
        }
    ]

`<searchable-select .values=${fiatCurrencies}></searchable-select>`

Emits the event `searchable-select-update` once a user selects a value

--- 
### Wallet selector

`<wallet-selector></wallet-selector>`
