import type { IClassifier } from '../interfaces/Classifier';
import type { DexType } from '../interfaces/Dex';
import type { ProviderWrapper } from '../ProviderWrapper';
import { UniswapV2Classifier } from './UniswapV2Classifier';

export class ClassifierProvider {
  private classifiers: IClassifier[];

  constructor(provider: ProviderWrapper) {
    this.classifiers = [new UniswapV2Classifier(provider)];
  }

  public getClassifiers(): IClassifier[] {
    return this.classifiers;
  }

  public getClassifierForDex(dexType: DexType): IClassifier | undefined {
    return this.classifiers.find(c => c.dex.type === dexType);
  }
}
