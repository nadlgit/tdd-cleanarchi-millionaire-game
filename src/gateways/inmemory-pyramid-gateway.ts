import { type Pyramid } from '../core/pyramid/pyramid';
import { type PyramidGateway } from '../core/pyramid/pyramid-gateway';

export class InmemoryPyramidGateway implements PyramidGateway {
  constructor(private readonly _pyramid: Pyramid) {}

  async load(): Promise<Pyramid> {
    return this._pyramid!;
  }
}
