<p align="center">
  <img alt="MyMonero" src="https://user-images.githubusercontent.com/1645428/146000939-b06f8fd3-9ed2-4a5e-bdd6-3981281dde9c.png">
</p>

<p align="center">
  Open Alias library used in the MyMonero packages
</p>

<p align="center">
  <a href="https://github.com/mymonero/mymonero-utils/actions?query=branch%3Amaster+workflow%3Aci"><img alt="CI Status" src="https://github.com/mymonero/mymonero-utils/workflows/ci/badge.svg?branch=master"></a>
  <a href="https://snyk.io/test/github/mymonero/mymonero-utils"><img src="https://snyk.io/test/github/mymonero/mymonero-utils/badge.svg"></a>
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/License-BSD%203--Clause-blue.svg"></a>
  <a href="https://npmjs.com/package/@mymonero/mymonero-openalias"><img src="https://img.shields.io/npm/dt/@mymonero/mymonero-nettype.svg"></a>
</p>

> :warning: This project is under heavy development. Expect bugs & breaking changes.

## Installation

```bash
npm i @mymonero/mymonero-openalias
```

## Usage

```js
const OpenAlias = require('@mymonero/mymonero-openalias');
const oa = new OpenAlias();
const oaArray = await oa.lookup('donate.getmonero.org');
```

-----

## License

See `LICENSE.txt` for license.

All source code copyright © 2021 by MyMonero. All rights reserved.