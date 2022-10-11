[sandwich-scanner](../README.md) / SandwichDetector

# Class: SandwichDetector

## Implements

- [`ISandwichDetector`](../interfaces/ISandwichDetector.md)

## Table of contents

### Constructors

- [constructor](SandwichDetector.md#constructor)

### Properties

- [classifierProvider](SandwichDetector.md#classifierprovider)
- [detector](SandwichDetector.md#detector)
- [fetcher](SandwichDetector.md#fetcher)

### Methods

- [getBlocksFromSwaps](SandwichDetector.md#getblocksfromswaps)
- [getSandwichesForAddress](SandwichDetector.md#getsandwichesforaddress)
- [getSandwichesForBlock](SandwichDetector.md#getsandwichesforblock)
- [getSwandwichesforAddressWithOffset](SandwichDetector.md#getswandwichesforaddresswithoffset)

## Constructors

### constructor

• **new SandwichDetector**(`provider`, `covalentApiKey`, `backupProviders?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `JsonRpcProvider` |
| `covalentApiKey` | `string` |
| `backupProviders?` | `JsonRpcProvider`[] |

#### Defined in

[SandwichDetector.ts:24](https://github.com/0xnogo/sandwich/blob/288b6da/src/SandwichDetector.ts#L24)

## Properties

### classifierProvider

• `Private` **classifierProvider**: `ClassifierProvider`

#### Defined in

[SandwichDetector.ts:20](https://github.com/0xnogo/sandwich/blob/288b6da/src/SandwichDetector.ts#L20)

___

### detector

• `Private` **detector**: `Detector`

#### Defined in

[SandwichDetector.ts:22](https://github.com/0xnogo/sandwich/blob/288b6da/src/SandwichDetector.ts#L22)

___

### fetcher

• `Private` **fetcher**: `Fetcher`

#### Defined in

[SandwichDetector.ts:21](https://github.com/0xnogo/sandwich/blob/288b6da/src/SandwichDetector.ts#L21)

## Methods

### getBlocksFromSwaps

▸ `Private` **getBlocksFromSwaps**(`swaps`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `swaps` | `Swap`[] |

#### Returns

`number`[]

#### Defined in

[SandwichDetector.ts:118](https://github.com/0xnogo/sandwich/blob/288b6da/src/SandwichDetector.ts#L118)

___

### getSandwichesForAddress

▸ **getSandwichesForAddress**(`address`, `dex`): `Promise`<`Sandwich`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `dex` | `DexType` |

#### Returns

`Promise`<`Sandwich`[]\>

#### Implementation of

[ISandwichDetector](../interfaces/ISandwichDetector.md).[getSandwichesForAddress](../interfaces/ISandwichDetector.md#getsandwichesforaddress)

#### Defined in

[SandwichDetector.ts:54](https://github.com/0xnogo/sandwich/blob/288b6da/src/SandwichDetector.ts#L54)

___

### getSandwichesForBlock

▸ **getSandwichesForBlock**(`blockNo`, `dexType`): `Promise`<`Sandwich`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNo` | `number` |
| `dexType` | `DexType` |

#### Returns

`Promise`<`Sandwich`[]\>

#### Implementation of

[ISandwichDetector](../interfaces/ISandwichDetector.md).[getSandwichesForBlock](../interfaces/ISandwichDetector.md#getsandwichesforblock)

#### Defined in

[SandwichDetector.ts:34](https://github.com/0xnogo/sandwich/blob/288b6da/src/SandwichDetector.ts#L34)

___

### getSwandwichesforAddressWithOffset

▸ **getSwandwichesforAddressWithOffset**(`address`, `offset`, `dex`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `offset` | `number` |
| `dex` | `DexType` |

#### Returns

`Promise`<`any`\>

#### Defined in

[SandwichDetector.ts:86](https://github.com/0xnogo/sandwich/blob/288b6da/src/SandwichDetector.ts#L86)
