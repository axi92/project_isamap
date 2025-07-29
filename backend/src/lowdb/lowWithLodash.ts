// eslint-disable-next-line import/no-unresolved
import { Low } from 'lowdb';

export class LowWithLodash<T> extends Low<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chain: any;

  async initializeChain() {
    const lodash = await import('lodash');
    if (this.data) {
      this.chain = lodash.chain(this.data);
    }
  }
}
