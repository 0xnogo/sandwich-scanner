# Sandwich-scanner

[![Continuous Integrations](https://github.com/0xnogo/sandwich-scanner/actions/workflows/continuous-integrations.yaml/badge.svg?branch=main)](https://github.com/0xnogo/sandwich-scanner/actions/workflows/continu§ous-integrations.yaml)
[![License](https://badgen.net/github/license/0xnogo/sandwich-scanner)](./LICENSE)
[![Package dependency count](https://badgen.net/bundlephobia/dependency-count/sandwich-scanner)](https://npmjs.com/package/sandwich-scanner)
[![Npm package version](https://badgen.net/npm/v/sandwich-scanner)](https://www.npmjs.com/package/sandwich-scanner)

## Description

`Sandwich-scanner` is a simple library to scanning the ethereum blockchain for sandwich attacks.

A sandwich attack is a type of arbitrage attack that occurs when a user is able to buy an asset at a low price and sell it at a higher price, all within the same transaction.

> This tool is in beta and might not be 100% accurate. Only Uniswap V2 is supported for now.

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install sandwich-scanner --save

# For Yarn, use the command below.
yarn add sandwich-scanner
```

### Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/sandwich-scanner"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/sandwich-scanner"></script>

<script>
  // UMD module is exposed through the "sandwich-scanner" global variable.
  console.log(sandwich-scanner);
</script>
```

## Usage

### Instantiation

```js
const provider = new ethers.providers.JsonRpcProvider(INFURA_MAINNET_RPC);
const sandwichDetector = new SandwichDetector(provider, covalentApiKey);
```

The library has implemented a provider wrapper for retrying failed requests. This is useful for handling rate limiting errors from the RPC node.

In order to leverage the retry option, you can pass an array of providers to the `SandwichDetector` constructor.

```js
const provider1 = new ethers.providers.JsonRpcProvider(INFURA_MAINNET_RPC);
const provider2 = new ethers.providers.JsonRpcProvider(ANKR_MAINNET_RPC);
const provider3 = new ethers.providers.JsonRpcProvider(BLASTAPI_MAINNET_RPC);

const sandwichDetector = new SandwichDetector(
  provider1, 
  covalentApiKey, 
  [provider2, provider3]);
```

`provider1` will be consider as the main provider. In case of failure, the wrapper will route the calls to the next provider in the array.

### Get sandwich transactions

```js
// Get all sandwich transactions for a specific block and Dex
const sandwichesForBlock = await sandwichDetector.getSandwichesForBlock(11698481, "UniswapV2");

// Get all sandwich transactions for a specific address block and Dex
const sandwichesOnAddress = await sandwichDetector.getSandwichesForAddress('"0x1234..."', "UniswapV2");

// Get sandwich transactions with on offset for a specific address block and Dex
const sandwichesOnAddressWithOffset = await sandwichDetector.getSwandwichesforAddressWithOffset("0x1234...", 1, "UniswapV2");
```

`offset`: considering the tx in block y at position n. The detector will fetch txs in block y at position [n-offset ; n] and [n ; n+offset]. The detection logic will be applied on theses txs. 

> As most of the sandwiches are happening at the index before and after the swap transaction, it is recommended to opt for an offset of 1.

> Note that `getSandwichesForAddress` is very resource intensive and will hit hard your RPC. It is recommended to use `getSandwichesForAddressWithOffset` instead.

## Documentation

[Documentation generated from source files by Typedoc](./docs/README.md).

## License

Released under [MIT License](./LICENSE).
