import type { Swap } from './Swap';

export interface Sandwich {
  frontSwap: Swap;
  victimSwap: Swap;
  backSwap: Swap;
}
