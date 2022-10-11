import { BigNumber } from 'ethers';
import { Detector } from '../Detector';
import { UniswapV2 } from '../dexes';
import type { Dex } from '../interfaces/Dex';
import type { Sandwich } from '../interfaces/Sandwich';
import type { Swap } from '../interfaces/Swap';

describe('Detector', () => {
  let detector: Detector;
  const swapsWithSandwich: Swap[] = [
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
        '0xde4349e4eaf8dcebd0b9b6ee4e10781ce43c09039b8a6bedd7bfdea5620ef28c',
      txPosition: 78,
      blockNumber: 11698481,
      contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
      fromAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      toAddress: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
      tokenInAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
      tokenOutAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amountIn: BigNumber.from('1000000000000000000'),
      amountOut: BigNumber.from('1000000000000000000'),
    },
    {
      txHash:
        '0x75eea569f1e5044f2e0beb10f60204bb1381965bf18fbba01b6c400cf70b2b4b',
      txPosition: 79,
      blockNumber: 11698481,
      contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
      fromAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      toAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      tokenInAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      tokenOutAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
      amountIn: BigNumber.from('1000000000000000000'),
      amountOut: BigNumber.from('1000000000000000000'),
    },
  ];
  const swapsWithoutSandwich: Swap[] = [
    {
      txHash:
        '0x4dd182582bc7eedf0fb41a62da18322959e75483f6fde25cfddf7d06b0bb2fbe',
      txPosition: 71,
      blockNumber: 11698481,
      contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
      fromAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      toAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      tokenInAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      tokenOutAddress: '0x73D9E335669462Cbdd6aa3AdaFe9efeE86a37Fe9',
      amountIn: BigNumber.from('1000000000000000000'),
      amountOut: BigNumber.from('1000000000000000000'),
    },
    {
      txHash:
        '0xde4349e4eaf8dcebd0b9b6ee4e10781ce43c09039b8a6bedd7bfdea5620ef28c',
      txPosition: 78,
      blockNumber: 11698481,
      contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
      fromAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      toAddress: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
      tokenInAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
      tokenOutAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amountIn: BigNumber.from('1000000000000000000'),
      amountOut: BigNumber.from('1000000000000000000'),
    },
    {
      txHash:
        '0x75eea569f1e5044f2e0beb10f60204bb1381965bf18fbba01b6c400cf70b2b4b',
      txPosition: 79,
      blockNumber: 11698481,
      contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
      fromAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      toAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      tokenInAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      tokenOutAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
      amountIn: BigNumber.from('1000000000000000000'),
      amountOut: BigNumber.from('1000000000000000000'),
    },
  ];

  const sandwichExpected: Sandwich = {
    frontSwap: swapsWithSandwich[0]!,
    victimSwap: swapsWithSandwich[1]!,
    backSwap: swapsWithSandwich[2]!,
  };

  const dummyDex: Dex = new UniswapV2();
  beforeEach(() => {
    detector = new Detector();
  });

  it('should detect sandwiches on swap list', () => {
    // WHEN
    const detectedSandwich = detector.sandwichDetectorOnList(
      swapsWithSandwich,
      dummyDex,
    );

    // THEN
    expect(detectedSandwich).toContainEqual(sandwichExpected);
  });

  it('should not detect sandwiches on swap list', () => {
    // WHEN
    const detectedSandwich = detector.sandwichDetectorOnList(
      swapsWithoutSandwich,
      dummyDex,
    );

    // THEN
    expect(detectedSandwich).toHaveLength(0);
  });

  it('it should detect sandwiches on target swap', () => {
    // WHEN
    const detectedSandwich = detector.sandwichDetectorOnTargetSwap(
      swapsWithSandwich[1]!,
      [swapsWithSandwich[0]!, swapsWithSandwich[2]!],
      dummyDex,
    );

    // THEN
    expect(detectedSandwich).toContainEqual(sandwichExpected);
  });

  it('it should not detect sandwiches on target swap', () => {
    // WHEN
    const detectedSandwich = detector.sandwichDetectorOnTargetSwap(
      swapsWithoutSandwich[1]!,
      [swapsWithoutSandwich[0]!, swapsWithoutSandwich[2]!],
      dummyDex,
    );

    // THEN
    expect(detectedSandwich).toHaveLength(0);
  });
});
