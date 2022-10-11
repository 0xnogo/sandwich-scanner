import {
  getCreate2Address,
  solidityKeccak256,
  solidityPack,
} from 'ethers/lib/utils';
import _ from 'lodash';
import {
  UNISWAP_V2_ROUTER,
  UNISWAP_V3_ROUTER,
  UNISWAP_V3_ROUTER_2,
} from '../constants';

import type { Dex, DexType } from '../interfaces/Dex';
import type { Swap } from '../interfaces/Swap';

export class UniswapV2 implements Dex {
  public readonly type: DexType = 'UniswapV2';
  public readonly factoryAddresss =
    '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
  public readonly initCodeHash =
    '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
  public readonly routers = [
    UNISWAP_V2_ROUTER,
    UNISWAP_V3_ROUTER,
    UNISWAP_V3_ROUTER_2,
  ];

  public isFromDex(swap: Swap): boolean {
    return (
      this.computePairAddress({
        factoryAddress: this.factoryAddresss,
        tokenA: swap.tokenInAddress,
        tokenB: swap.tokenOutAddress,
      }) === swap.contractAddress
    );
  }

  public async filterDexSwap(swaps: Swap[]): Promise<Swap[]> {
    const flattenSwaps: Swap[] = _.flattenDeep(swaps);
    let swapsFromDex: Swap[] = [];

    swapsFromDex = flattenSwaps.filter(
      (swap) =>
        this.computePairAddress({
          factoryAddress: this.factoryAddresss,
          tokenA: swap.tokenInAddress,
          tokenB: swap.tokenOutAddress,
        }) === swap.contractAddress,
    );

    return swapsFromDex;
  }

  private computePairAddress({
    factoryAddress,
    tokenA,
    tokenB,
  }: {
    factoryAddress: string;
    tokenA: string;
    tokenB: string;
  }): string {
    const [token0, token1] =
      tokenA.toLocaleLowerCase() < tokenB.toLocaleLowerCase()
        ? [tokenA, tokenB]
        : [tokenB, tokenA]; // does safety checks
    return getCreate2Address(
      factoryAddress,
      solidityKeccak256(
        ['bytes'],
        [solidityPack(['address', 'address'], [token0, token1])],
      ),
      this.initCodeHash,
    );
  }
}
