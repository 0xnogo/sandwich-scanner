import axios from 'axios';
import { ethers } from 'ethers';
import _ from 'lodash';

import type { Swap } from './interfaces/Swap';
import type { TransactionDetails } from './interfaces/TransactionDetails';
import type { ProviderWrapper } from './ProviderWrapper';

export class Fetcher {
  private provider: ProviderWrapper;
  private covalentApiKey: string;

  constructor(provider: ProviderWrapper, covalentApiKey: string) {
    this.provider = provider;
    this.covalentApiKey = covalentApiKey;
  }

  public async getTransactionsDetailsWithOffset(
    swaps: Swap[],
    offset: number
  ): Promise<Map<Swap, TransactionDetails[]>> {
    const map: Map<Swap, TransactionDetails[]> = new Map();
    const data: {
      swap: Swap;
      otherTxs: TransactionDetails[];
    }[] = await Promise.all(
      swaps.map(async swap => {
        let counter = 1;
        const txDetails: TransactionDetails[] = [];
        while (counter <= offset) {
          if (swap.txPosition - counter >= 0) {
            const txDetailDown = await this.getTransactionDetailsByBlockNumberAndIndex(
              swap.blockNumber,
              swap.txPosition - counter
            );
            if (txDetailDown !== undefined) {
              txDetails.push(txDetailDown);
            }
          }

          const txDetailsUp = await this.getTransactionDetailsByBlockNumberAndIndex(
            swap.blockNumber,
            swap.txPosition + counter
          );
          if (txDetailsUp !== undefined) {
            txDetails.push(txDetailsUp);
          }

          counter++;
        }
        return { swap, otherTxs: txDetails };
      })
    );
    data.forEach(d => map.set(d.swap, d.otherTxs));

    return map;
  }

  public async getTransactionDetailsByBlockNumberAndIndex(
    blockNumber: number,
    transactionIndex: number
  ): Promise<TransactionDetails | undefined> {
    try {
      const txHash = (
        await this.provider.callProviderWithRetries(provider =>
          provider.send('eth_getTransactionByBlockNumberAndIndex', [
            ethers.utils.hexValue(blockNumber),
            ethers.utils.hexValue(transactionIndex),
          ])
        )
      ).hash;
      const txReceipt = await this.getTransactionDetails(txHash);
      return txReceipt;
    } catch (error) {
      return Promise.resolve(undefined);
    }
  }

  public async getTransactionDetails(
    txHash: string
  ): Promise<TransactionDetails | undefined> {
    try {
      const txReceipt = await this.provider.callProviderWithRetriesAndWait(
        provider => provider.getTransactionReceipt(txHash)
      );
      return {
        hash: txHash,
        transactionIndex: txReceipt.transactionIndex,
        blockNumber: txReceipt.blockNumber!,
        logs: txReceipt.logs,
      } as TransactionDetails;
    } catch (error) {
      console.log(`No receipt found for tx ${txHash}, error: ${error}`);
      return Promise.resolve(undefined);
    }
  }

  public async getTransactionDetailsFromAddress(
    address: string
  ): Promise<TransactionDetails[]> {
    const txHashes = await this.getAllTxFromAddress(address);
    const txDetails = await Promise.all(
      txHashes.map(txHash => this.getTransactionDetails(txHash))
    );
    return txDetails.filter(tx => tx !== undefined) as TransactionDetails[];
  }

  public async getAllTransactionDetailsFromBlock(
    blockNo: number
  ): Promise<TransactionDetails[]> {
    const txHashes = await this.getAllTxFromBlock(blockNo);
    const txDetails = await Promise.all(
      txHashes.map(txHash => this.getTransactionDetails(txHash))
    );
    return txDetails.filter(tx => tx !== undefined) as TransactionDetails[];
  }

  public async getAllTxFromAddress(address: string): Promise<string[]> {
    const urlGetAllTxFromAddress = `https://api.covalenthq.com/v1/1/address/${address}/transactions_v2/`;
    let params: any = {
      key: this.covalentApiKey,
      format: 'JSON',
      'quote-currency': 'USD',
      'block-signed-at-asc': false,
      'no-logs': false,
      'page-number': 0,
      'page-size': 100,
    };
    const txFromAddress = [];
    try {
      let response = await axios.get(urlGetAllTxFromAddress, { params });
      txFromAddress.push(response.data.data.items);
      while (response.data.data.pagination.has_more) {
        params['page-number'] = response.data.data.pagination.page_number + 1;
        response = await axios.get(urlGetAllTxFromAddress, { params });
        txFromAddress.push(response.data.data.items);
      }
    } catch (error) {
      throw new Error(
        `Error fetching tx from address ${address} with error: ${error}`
      );
    }

    return _.flatten(txFromAddress).map(tx => tx.tx_hash);
  }

  private async getAllTxFromBlock(blockNo: number): Promise<string[]> {
    try {
      const block = await this.provider.callProviderWithRetriesAndWait(
        provider => provider.getBlock(blockNo)
      );
      return block.transactions;
    } catch (error) {
      throw new Error(
        `Error fetching tx from block ${blockNo} with error: ${error}`
      );
    }
  }
}
