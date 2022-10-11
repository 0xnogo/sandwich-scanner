[sandwich-scanner](../README.md) / UniswapV2

# Class: UniswapV2

## Implements

- `Dex`

## Table of contents

### Constructors

- [constructor](UniswapV2.md#constructor)

### Properties

- [factoryAddresss](UniswapV2.md#factoryaddresss)
- [initCodeHash](UniswapV2.md#initcodehash)
- [routers](UniswapV2.md#routers)
- [type](UniswapV2.md#type)

### Methods

- [computePairAddress](UniswapV2.md#computepairaddress)
- [filterDexSwap](UniswapV2.md#filterdexswap)
- [isFromDex](UniswapV2.md#isfromdex)

## Constructors

### constructor

• **new UniswapV2**()

## Properties

### factoryAddresss

• `Readonly` **factoryAddresss**: ``"0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"``

#### Defined in

[dexes/UniswapV2Dex.ts:18](https://github.com/0xnogo/sandwich/blob/288b6da/src/dexes/UniswapV2Dex.ts#L18)

___

### initCodeHash

• `Readonly` **initCodeHash**: ``"0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"``

#### Defined in

[dexes/UniswapV2Dex.ts:20](https://github.com/0xnogo/sandwich/blob/288b6da/src/dexes/UniswapV2Dex.ts#L20)

___

### routers

• `Readonly` **routers**: `string`[]

#### Implementation of

Dex.routers

#### Defined in

[dexes/UniswapV2Dex.ts:22](https://github.com/0xnogo/sandwich/blob/288b6da/src/dexes/UniswapV2Dex.ts#L22)

___

### type

• `Readonly` **type**: `DexType` = `'UniswapV2'`

#### Implementation of

Dex.type

#### Defined in

[dexes/UniswapV2Dex.ts:17](https://github.com/0xnogo/sandwich/blob/288b6da/src/dexes/UniswapV2Dex.ts#L17)

## Methods

### computePairAddress

▸ `Private` **computePairAddress**(`__namedParameters`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.factoryAddress` | `string` |
| `__namedParameters.tokenA` | `string` |
| `__namedParameters.tokenB` | `string` |

#### Returns

`string`

#### Defined in

[dexes/UniswapV2Dex.ts:54](https://github.com/0xnogo/sandwich/blob/288b6da/src/dexes/UniswapV2Dex.ts#L54)

___

### filterDexSwap

▸ **filterDexSwap**(`swaps`): `Promise`<`Swap`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swaps` | `Swap`[] |

#### Returns

`Promise`<`Swap`[]\>

#### Implementation of

Dex.filterDexSwap

#### Defined in

[dexes/UniswapV2Dex.ts:38](https://github.com/0xnogo/sandwich/blob/288b6da/src/dexes/UniswapV2Dex.ts#L38)

___

### isFromDex

▸ **isFromDex**(`swap`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swap` | `Swap` |

#### Returns

`boolean`

#### Implementation of

Dex.isFromDex

#### Defined in

[dexes/UniswapV2Dex.ts:28](https://github.com/0xnogo/sandwich/blob/288b6da/src/dexes/UniswapV2Dex.ts#L28)
