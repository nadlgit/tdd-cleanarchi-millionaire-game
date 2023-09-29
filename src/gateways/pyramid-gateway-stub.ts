import { type Pyramid } from '../core/pyramid/pyramid';
import { type PyramidGateway } from '../core/pyramid/pyramid-gateway';

export class PyramidGatewayStub implements PyramidGateway {
  private _pyramid?: Pyramid;

  async load(): Promise<Pyramid> {
    return this._pyramid!;
  }

  setPyramid(pyramid: Pyramid) {
    this._pyramid = pyramid;
  }
}
