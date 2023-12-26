import * as lodash from 'lodash';
import { Low } from 'lowdb/lib';

export class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}