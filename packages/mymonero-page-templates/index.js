/* Require reusable components */
require("@mymonero/mymonero-web-components");

/* Require various view elements */
require("./Exchange/Elements/ChangenowBuyWithFiatView");
require("./Exchange/Elements/ChangenowFixedRateView")
require("./Exchange/Elements/ChangenowFloatingRateView");

/* Import exchange landing page class */
let ExchangeLandingPage = require("./Exchange/ExchangeLandingPage");


/* Export page templates */
module.exports = {
    ExchangeLandingPage
}