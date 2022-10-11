import { ethers } from 'ethers';

export interface Swap {
  txHash: string;
  txPosition: number;
  blockNumber: number;
  contractAddress: string;
  fromAddress: string;
  toAddress: string;
  tokenInAddress: string;
  tokenOutAddress: string;
  amountIn: ethers.BigNumber;
  amountOut: ethers.BigNumber;
  error?: string;
}
