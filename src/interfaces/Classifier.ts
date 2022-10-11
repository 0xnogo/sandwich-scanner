import { Dex } from './Dex';
import { Swap } from './Swap';
import { TransactionDetails } from './TransactionDetails';

export interface IClassifier {
  dex: Dex;
  getSwapsFromTx(tx: TransactionDetails): Promise<Swap[]>;
  getSwapsFromAllTx(txs: TransactionDetails[]): Promise<Swap[]>;
}
