import _ from 'lodash';
import type { Dex } from './interfaces/Dex';
import type { Sandwich } from './interfaces/Sandwich';
import type { Swap } from './interfaces/Swap';

export class Detector {
  // For [0;n-1], check for possible front swap
  // For [n+1;end], check for possible back swap
  public sandwichDetectorOnList(swaps: Swap[], dex: Dex): Sandwich[] {
    const sandwiches: Sandwich[] = [];
    for (let i = 0; i < swaps.length; i++) {
      const victimSwap = swaps[i];
      const frontSwaps = swaps.slice(0, i);
      const backSwaps = swaps.slice(i + 1, swaps.length);

      sandwiches.push(
        ...this.sandwichDetection(victimSwap!, frontSwaps, backSwaps, dex)
      );
    }
    return sandwiches;
  }

  public sandwichDetectorOnTargetSwap(
    victimSwap: Swap,
    otherSwaps: Swap[],
    dex: Dex
  ): Sandwich[] {
    const index = otherSwaps.findIndex(
      s => s.txPosition > victimSwap.txPosition
    );
    const frontSwaps = otherSwaps.slice(0, index);
    const backSwaps = otherSwaps.slice(index, otherSwaps.length);

    return this.sandwichDetection(victimSwap, frontSwaps, backSwaps, dex);
  }

  private sandwichDetection(
    victimSwap: Swap,
    frontSwaps: Swap[],
    backSwaps: Swap[],
    dex: Dex
  ): Sandwich[] {
    const sandwiches: Sandwich[] = [];

    const frontSwap = frontSwaps.find(
      s =>
        s.tokenInAddress === victimSwap.tokenInAddress &&
        s.tokenOutAddress === victimSwap.tokenOutAddress &&
        _.indexOf(dex.routers, s.toAddress.toLowerCase()) === -1
    );
    const backSwap = backSwaps.find(
      s =>
        s.tokenInAddress === victimSwap.tokenOutAddress &&
        s.tokenOutAddress === victimSwap.tokenInAddress &&
        frontSwap?.toAddress === s.fromAddress
    );

    if (frontSwap && backSwap) {
      sandwiches.push({ frontSwap, victimSwap, backSwap });
    }

    return sandwiches;
  }
}
