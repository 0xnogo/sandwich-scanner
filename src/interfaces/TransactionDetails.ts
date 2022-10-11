import type { ethers } from 'ethers';

export interface TransactionDetails {
  hash: string;
  transactionIndex: number;
  blockNumber: number;
  logs: ethers.providers.Log[];
}
