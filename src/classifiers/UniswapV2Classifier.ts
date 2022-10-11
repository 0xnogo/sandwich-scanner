import type { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';

import UniwapV2Abi from '../data/uniswapv2-pair-abi.json';
import { UniswapV2 } from '../dexes/UniswapV2Dex';
import type { IClassifier } from '../interfaces/Classifier';
import type { Dex } from '../interfaces/Dex';
import type { Swap } from '../interfaces/Swap';
import type { TransactionDetails } from '../interfaces/TransactionDetails';
import type { ProviderWrapper } from '../ProviderWrapper';

const UNISWAPV2_PAIR_INTERFACE = new Interface(UniwapV2Abi);

export class UniswapV2Classifier implements IClassifier {
  public readonly dex: Dex = new UniswapV2();

  private provider: ProviderWrapper;

  constructor(provider: ProviderWrapper) {
    this.provider = provider;
  }

  public async getSwapsFromAllTx(txs: TransactionDetails[]): Promise<Swap[]> {
    const swaps = await Promise.all(txs.map((tx) => this.getSwapsFromTx(tx)));
    return this.orderSwaps(swaps.flat());
  }

  public async getSwapsFromTx(tx: TransactionDetails): Promise<Swap[]> {
    const result = await Promise.all(
      tx.logs
        .filter((log) => {
          try {
            const logDescription = UNISWAPV2_PAIR_INTERFACE.parseLog(log);
            return logDescription.name === 'Swap';
          } catch (e) {
            return false;
          }
        })
        .map(async (log): Promise<Swap> => {
          const parsedLog = UNISWAPV2_PAIR_INTERFACE.parseLog(log);
          const token0 = await this.provider.callContractMethodWithRetries(
            'token0',
            [],
            log.address,
            UNISWAPV2_PAIR_INTERFACE,
          );
          const token1 = await this.provider.callContractMethodWithRetries(
            'token1',
            [],
            log.address,
            UNISWAPV2_PAIR_INTERFACE,
          );

          let tokenIn: string;
          let tokenOut: string;
          let amountIn: ethers.BigNumber;
          let amountOut: ethers.BigNumber;

          // check if amount0in > 0
          if (parsedLog.args['amount0In'].gt(0)) {
            tokenIn = token0;
            tokenOut = token1;
            amountIn = parsedLog.args['amount0In'];
            amountOut = parsedLog.args['amount1Out'];
          } else {
            // else amount1in > 0
            tokenIn = token1;
            tokenOut = token0;
            amountIn = parsedLog.args['amount1In'];
            amountOut = parsedLog.args['amount0Out'];
          }

          return {
            txHash: tx.hash,
            txPosition: tx.transactionIndex,
            blockNumber: tx.blockNumber!,
            contractAddress: log.address,
            fromAddress: parsedLog.args['sender'],
            toAddress: parsedLog.args['to'],
            tokenInAddress: tokenIn,
            tokenOutAddress: tokenOut,
            amountIn,
            amountOut,
          };
        }),
    );

    return result.filter((swap) => this.dex.isFromDex(swap));
  }

  private orderSwaps(swaps: Swap[]): Swap[] {
    return swaps.sort((a, b) => a.txPosition - b.txPosition);
  }
}
