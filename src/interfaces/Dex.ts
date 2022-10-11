import type { Swap } from './Swap';

export type DexType = 'UniswapV2' | 'UniswapV3';

export interface Dex {
  type: DexType;
  filterDexSwap(swaps: Swap[]): Promise<Swap[]>;
  isFromDex(swap: Swap): boolean;
  routers: string[];
}
