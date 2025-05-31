import { Low } from "lowdb";

export class LowWithLodash<T> extends Low<T> {
  chain: any;

  async initializeChain() {
    const lodash = await import("lodash");
    if (this.data) {
      this.chain = lodash.chain(this.data);
    }
  }
}
