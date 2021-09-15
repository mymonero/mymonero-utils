/* Require reusable components */
require("./Components/Shared/ProviderCard");
require("./Components/Exchange/ChangenowBuyWithFiatView");
require("./Components/Exchange/ChangenowFixedRateView")
require("./Components/Exchange/ChangenowFloatingRateView");

/* Import page templates */
import ExchangeLandingPage from "./Components/Exchange/ExchangeLandingPage";

/* Export page templates */
export default { 
    ExchangeLandingPage
}
