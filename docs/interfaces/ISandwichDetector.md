[[libraryNameWithSpacesAndUpperCases]](../README.md) / ISandwichDetector

# Interface: ISandwichDetector

## Implemented by

- [`SandwichDetector`](../classes/SandwichDetector.md)

## Table of contents

### Methods

- [getSandwichesForAddress](ISandwichDetector.md#getsandwichesforaddress)
- [getSandwichesForBlock](ISandwichDetector.md#getsandwichesforblock)

## Methods

### getSandwichesForAddress

▸ **getSandwichesForAddress**(`address`, `dex`): `Promise`<`Sandwich`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `dex` | `DexType` |

#### Returns

`Promise`<`Sandwich`[]\>

#### Defined in

[SandwichDetector.ts:16](https://github.com/0xnogo/sandwich/blob/75b88ce/src/SandwichDetector.ts#L16)

___

### getSandwichesForBlock

▸ **getSandwichesForBlock**(`blockNo`, `dex`): `Promise`<`Sandwich`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNo` | `number` |
| `dex` | `DexType` |

#### Returns

`Promise`<`Sandwich`[]\>

#### Defined in

[SandwichDetector.ts:14](https://github.com/0xnogo/sandwich/blob/75b88ce/src/SandwichDetector.ts#L14)
