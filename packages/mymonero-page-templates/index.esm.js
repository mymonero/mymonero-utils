/* Require reusable components */
require("@mymonero/mymonero-web-components");

/* Require various view elements */
require("./Exchange/Elements/ChangenowBuyWithFiatView");
require("./Exchange/Elements/ChangenowFixedRateView")
require("./Exchange/Elements/ChangenowFloatingRateView");

/* Import exchange landing page class */
import ExchangeLandingPage from "./Exchange/Elements/ExchangeLandingPage";
import ExchangeNavigationController from "./Exchange/Controllers/ExchangeNavigationController";

/* Export page templates */
export default { 
    ExchangeLandingPage,
    ExchangeNavigationController
}
