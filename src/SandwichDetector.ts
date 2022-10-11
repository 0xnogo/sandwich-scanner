import type { ethers } from 'ethers';
import _ from 'lodash';

import { ClassifierProvider } from './classifiers/ClassifierProvider';
import { Detector } from './Detector';
import { Fetcher } from './Fetcher';
import type { DexType } from './interfaces/Dex';
import type { Sandwich } from './interfaces/Sandwich';
import type { Swap } from './interfaces/Swap';
import type { TransactionDetails } from './interfaces/TransactionDetails';
import { ProviderWrapper } from './ProviderWrapper';

export interface ISandwichDetector {
  getSandwichesForBlock(blockNo: number, dex: DexType): Promise<Sandwich[]>;

  getSandwichesForAddress(address: string, dex: DexType): Promise<Sandwich[]>;
}

export class SandwichDetector implements ISandwichDetector {
  private classifierProvider: ClassifierProvider;
  private fetcher: Fetcher;
  private detector: Detector = new Detector();

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    covalentApiKey: string,
    backupProviders?: ethers.providers.JsonRpcProvider[],
  ) {
    const providerWrapper = new ProviderWrapper(provider, backupProviders);
    this.classifierProvider = new ClassifierProvider(providerWrapper);
    this.fetcher = new Fetcher(providerWrapper, covalentApiKey);
  }

  public async getSandwichesForBlock(
    blockNo: number,
    dexType: DexType,
  ): Promise<Sandwich[]> {
    const classifier = this.classifierProvider.getClassifierForDex(dexType);
    if (!classifier) {
      throw new Error('Classifier not found');
    }
    const transactionDetailsFromBlock =
      await this.fetcher.getAllTransactionDetailsFromBlock(blockNo);
    const swaps = await classifier.getSwapsFromAllTx(
      transactionDetailsFromBlock,
    );
    const sandwiches = this.detector.sandwichDetectorOnList(
      swaps,
      classifier.dex,
    );
    return sandwiches;
  }

  public async getSandwichesForAddress(
    address: string,
    dex: DexType,
  ): Promise<Sandwich[]> {
    const classifier = this.classifierProvider.getClassifierForDex(dex);
    if (!classifier) {
      throw new Error('Classifier not found');
    }

    const txDetailsFromAddress =
      await this.fetcher.getTransactionDetailsFromAddress(address);
    const swaps = await classifier.getSwapsFromAllTx(txDetailsFromAddress);
    const blocksWithSwapsFromAddress = this.getBlocksFromSwaps(swaps);
    console.log(
      `Found ${
        swaps.length
      } 🥪 from address ${address} in 🧱 ${blocksWithSwapsFromAddress.join(
        ', ',
      )}`,
    );

    const sandwiches = await Promise.all(
      blocksWithSwapsFromAddress.map((blockNo) =>
        this.getSandwichesForBlock(blockNo, dex),
      ),
    );

    return _.flatten(sandwiches).filter(
      (sandwich) => sandwich.victimSwap.toAddress === address,
    );
  }

  public async getSwandwichesforAddressWithOffset(
    address: string,
    offset: number,
    dex: DexType,
  ): Promise<any> {
    const classifier = this.classifierProvider.getClassifierForDex(dex);
    if (!classifier) {
      throw new Error('Classifier not found');
    }

    const txDetailsFromAddress =
      await this.fetcher.getTransactionDetailsFromAddress(address);
    const swaps = await classifier.getSwapsFromAllTx(txDetailsFromAddress);
    const swapMap: Map<Swap, TransactionDetails[]> =
      await this.fetcher.getTransactionsDetailsWithOffset(swaps, offset);
    const sandwiches = [];
    for (const [victimSwap, txDetails] of swapMap) {
      const otherSwaps = await classifier.getSwapsFromAllTx(txDetails);
      if (otherSwaps.length >= 2) {
        sandwiches.push(
          ...this.detector.sandwichDetectorOnTargetSwap(
            victimSwap,
            otherSwaps,
            classifier.dex,
          ),
        );
      }
    }

    return _.flatten(sandwiches);
  }

  private getBlocksFromSwaps(swaps: Swap[]): number[] {
    return _.uniq(swaps.map((swap) => swap.blockNumber));
  }
}
