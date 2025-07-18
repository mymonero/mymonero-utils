/* Require reusable components */
require("@mymonero/mymonero-web-components");

/* Require various view elements */
require("./src/Exchange/Elements/MajesticBankFloatingRateView");
require("./src/Exchange/Elements/ChangenowBuyWithFiatView");
require("./src/Exchange/Elements/ChangenowFixedRateView")
require("./src/Exchange/Elements/ChangenowFloatingRateView");
require("./src/Yat/Elements/YatSettingsView");

/* Import exchange landing page class */
import ExchangeLandingPage from "./src/Exchange/Elements/ExchangeLandingPage";
import ExchangeNavigationController from "./src/Exchange/Controllers/ExchangeNavigationController";

/* Export page templates */
export default { 
    ExchangeLandingPage,
    ExchangeNavigationController
}
