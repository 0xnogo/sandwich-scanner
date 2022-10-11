import type { Dex } from './Dex';
import type { Swap } from './Swap';
import type { TransactionDetails } from './TransactionDetails';

export interface IClassifier {
  dex: Dex;
  getSwapsFromTx(tx: TransactionDetails): Promise<Swap[]>;
  getSwapsFromAllTx(txs: TransactionDetails[]): Promise<Swap[]>;
}
