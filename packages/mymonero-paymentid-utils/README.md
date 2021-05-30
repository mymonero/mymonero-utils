<p align="center">
  <img alt="MyMonero" src="https://user-images.githubusercontent.com/1645428/120083066-8a394a00-c0c6-11eb-9bc5-1ce02784dab3.png">
</p>

<p align="center">
  Validate Monero Payment ID's, used in the MyMonero packages
</p>

<p align="center">
  <a href="https://github.com/mymonero/mymonero-utils/actions?query=branch%3Amaster+workflow%3Aci"><img alt="CI Status" src="https://github.com/mymonero/mymonero-utils/workflows/ci/badge.svg?branch=master"></a>
  <a href="https://snyk.io/test/github/mymonero/mymonero-utils"><img src="https://snyk.io/test/github/mymonero/mymonero-utils/badge.svg"></a>
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/License-BSD%203--Clause-blue.svg"></a>
  <a href="https://npmjs.com/package/@mymonero/mymonero-paymentid-utils"><img src="https://img.shields.io/npm/dt/@mymonero/mymonero-paymentid-utils.svg"></a>
</p>

> :warning: This project is under heavy development. Expect bugs & breaking changes.

## Installation

```bash
npm i @mymonero/mymonero-paymentid-utils
```

## Usage

```js
const paymentTool = require('@mymonero/mymonero-paymentid-utils');
const paymentID = 'f020853457bd110b';
const result = paymentTool.IsValidPaymentIDOrNoPaymentID(paymentID);
```

-----

## License

See `LICENSE.txt` for license.

All source code copyright © 2021 by MyMonero. All rights reserved.