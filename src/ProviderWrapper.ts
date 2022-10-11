import { ethers } from 'ethers';
import type { Interface } from 'ethers/lib/utils';

export class ProviderWrapper {
  private providers: ethers.providers.JsonRpcProvider[] = [];

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    backupProviders?: ethers.providers.JsonRpcProvider[],
  ) {
    this.providers = [provider, ...(backupProviders ? backupProviders : [])];
  }

  public async callProviderWithRetries(
    fn: (provider: ethers.providers.JsonRpcProvider) => Promise<any>,
    retries = 0,
  ): Promise<any> {
    try {
      const data = await fn(this.providers[retries]!);
      if (data === null) {
        throw new Error('Data is null');
      }
      return data;
    } catch (error) {
      if (retries > this.providers.length - 1) {
        console.log(`Fast attempt rejected: ${retries}. Failing`);
        return Promise.reject(error);
      }
      return this.callProviderWithRetries(fn, retries + 1);
    }
  }

  public async callContractMethodWithRetries(
    method: string,
    params: any[],
    address: string,
    _interface: Interface,
    retries = 0,
  ): Promise<any> {
    try {
      const contractPair = new ethers.Contract(
        address,
        _interface,
        this.providers[retries],
      );
      const data = await contractPair[method](...params);
      return data;
    } catch (error) {
      if (retries > this.providers.length - 1) {
        return Promise.reject(error);
      }
      return this.callContractMethodWithRetries(
        method,
        params,
        address,
        _interface,
        retries + 1,
      );
    }
  }

  public async callProviderWithRetriesAndWait(
    fn: (provider: ethers.providers.JsonRpcProvider) => Promise<any>,
    retries = 0,
  ): Promise<any> {
    try {
      const data = await fn(this.providers[retries]!);
      if (data === null) {
        throw new Error('Data is null');
      }
      return data;
    } catch (error) {
      // console.log("Error: ", error);
      if (retries > this.providers.length - 1) {
        return Promise.reject(error);
      }
      console.log(`waiting ${100 * 10 ** retries}ms before retrying`);

      await this.wait(100 * 10 ** retries);
      return this.callProviderWithRetriesAndWait(fn, retries + 1);
    }
  }

  public getProvider(retries: number): ethers.providers.JsonRpcProvider {
    return this.providers[retries]!;
  }

  private wait(ms: number) {
    return new Promise<void>((resolve, _) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}
