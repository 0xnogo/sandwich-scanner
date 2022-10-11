import { BigNumber } from 'ethers';

import { UniswapV2 } from '../dexes/UniswapV2Dex';

import type { Swap } from '../interfaces/Swap';

describe('UniswapV2Dex', () => {
  let uniswapV2Dex: UniswapV2;

  beforeEach(() => {
    uniswapV2Dex = new UniswapV2();
  });

  it('should get if the swap is from dex', () => {
    // GIVEN
    const swap: Swap = {
      txHash:
        '0x4dd182582bc7eedf0fb41a62da18322959e75483f6fde25cfddf7d06b0bb2fbe',
      txPosition: 71,
      blockNumber: 11698481,
      contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
      fromAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      toAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      tokenInAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
      tokenOutAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amountIn: BigNumber.from('1000000000000000000'),
      amountOut: BigNumber.from('1000000000000000000'),
    };

    // WHEN
    const result = uniswapV2Dex.isFromDex(swap);

    // THEN
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });

  it('should filter swaps from dex', async () => {
    // GIVEN
    const swaps: Swap[] = [
      {
        txHash:
          '0x4dd182582bc7eedf0fb41a62da18322959e75483f6fde25cfddf7d06b0bb2fbe',
        txPosition: 71,
        blockNumber: 11698481,
        contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
        fromAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
        toAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
        tokenInAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
        tokenOutAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        amountIn: BigNumber.from('1000000000000000000'),
        amountOut: BigNumber.from('1000000000000000000'),
      },
      {
        txHash:
          '0x4dd182582bc7eedf0fb41a62da18322959e75483f6fde25cfddf7d06b0bb2fbe',
        txPosition: 71,
        blockNumber: 11698481,
        contractAddress: 'DUMMY_ADDRESS',
        fromAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
        toAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
        tokenInAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
        tokenOutAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        amountIn: BigNumber.from('1000000000000000000'),
        amountOut: BigNumber.from('1000000000000000000'),
      },
    ];

    // WHEN
    const result = await uniswapV2Dex.filterDexSwap(swaps);

    // THEN
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
  });
});
