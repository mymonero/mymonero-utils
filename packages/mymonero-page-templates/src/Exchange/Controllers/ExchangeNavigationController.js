// This file is a copy of lit-html branch's navigation controller. Move this to appropriate component folder once we roll out lit

// NavigationController is a function that takes a superclass as an argument, and mixins the superclass with navigation controller methods
const ExchangeNavigationController = (superClass) => class extends superClass {
    /* class fields & methods to extend superClass with */
    navigateToPage(destination) {
        let routeMap = {
            "majesticbankFloatingRateView": "majesticbank-floating-rate-view",
            "changenowBuyWithFiatView": "changenow-buy-with-fiat-view",
            "changenowFixedRateView": "changenow-fixed-rate-view",
            "changenowFloatingRateView": "changenow-floating-rate-view",
            "landingPageView": "exchange-landing-page"
        }
        //console.log("We want to navigate to " + destination)
        let contentView = document.getElementById('exchange-content-container');
        contentView.innerHTML = "";
        let pageElement = document.createElement(routeMap[destination]);
        pageElement.context = this.context;
        contentView.appendChild(pageElement);
        if (destination !== "landingPageView") {
            this.drawBackButton("landingPageView");
        } else {
            let backButtonDiv = document.getElementById("leftBarButtonHolderView");
            backButtonDiv.innerHTML = "";
        }
    }

    drawBackButton(destination) {
        let backButtonDiv = document.getElementById("leftBarButtonHolderView");
        // Since the backButtonDiv might have an event listener, we clone and replace it to make sure we don't end up with multiple listener
        backButtonDiv.innerHTML = backButtonDiv.cloneNode(true);
        backButtonDiv.innerHTML = '<div class="base-button hoverable-cell utility grey-menu-button disableable left-back-button" style="cursor: default; -webkit-app-region: no-drag; position: absolute; opacity: 1; left: 0px;"></div>';
        let instance = this;
        backButtonDiv.firstChild.addEventListener('click', (event) => {
            //
            instance.navigateToPage(destination);
        })
    }

    renderStyles() {
        let styleElement = document.getElementById("lit-styles");
        if (styleElement == null) {
            let styles = document.createElement("style");
            styles.innerHTML = `

                #leftBarButtonHolderView, #rightBarButtonHolderView {
                    z-index: 10;
                }
                #navigation-bar-view-sub-wrapper {
                    display: none;
                } 
                .exchangeScreen .empty-page-content-container {
                    transform: translateY(0px) !important;
                }
                #exchange-landing-page {
                    margin: 20px !important;
                }
                #exchange-landing-page .exchange-page-panel {
                    margin: 0 auto !important;
                }
                #exchange-landing-page .exchangeScreen {

                }
                .exchange-page-panel {
                    position: relative;
                    margin: 0 auto;
                    display: table;
                    border-radius: 5px;
                    width: 100% !important;
                    border: none !important;
                }
                .exchange-page-panel .exchange-page-content-container {
                    margin: 20px 0px !important;
                }
            `
            styles.id = "lit-styles";
            let body = document.body;
            body.appendChild(styles);
        }
    }

    clearBackButton() {

    }

    handleBackButtonClickEvent() {

    }

    handleBackButtonTouchEvent() {

    }

    selfNavigate(page) {
        let routeMap = {
            "majesticbankFloatingRateView": "majesticbank-floating-rate-view",
            "changenowBuyWithFiatView": "changenow-buy-with-fiat-view",
            "changenowFixedRateView": "changenow-fixed-rate-view",
            "changenowFloatingRateView": "changenow-floating-rate-view"
        }
        let contentView = document.querySelector('content-view');
        contentView.innerHTML = "";
        let pageElement = document.createElement(routeMap[page]);
        pageElement.context = this.context;
        contentView.appendChild(pageElement);
    }

}

module.exports = ExchangeNavigationController;